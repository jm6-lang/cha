/**
 * 数查 (ShuCha) API 代理 - Cloudflare Worker
 * 把第三方 API Key 隔离在后端，前端只调本代理
 *
 * 路由表：
 *   GET  /api/tianapi/:endpoint?params...   → 代理天行数据
 *   GET  /api/tmini/:endpoint?params...     → 代理 tmini.net
 *   POST /api/marriage/single               → 个人婚姻核验
 *   POST /api/marriage/dual                 → 双人婚姻核验
 *   GET  /api/health                        → 健康检查
 *
 * 部署：
 *   wrangler secret put TIANAPI_KEY
 *   wrangler secret put MARRIAGE_APIKEY
 *   wrangler secret put MARRIAGE_PROVIDER     # aliyun / hunyin / yushan / tianyuan
 *   wrangler secret put MARRIAGE_GATEWAY      # 可选，覆盖默认网关
 *   wrangler deploy
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(request) });
    }

    try {
      if (pathname === '/api/health') {
        return json({ ok: true, ts: Date.now() }, 200, request);
      }

      if (pathname.startsWith('/api/tianapi/')) {
        return await handleTianapi(pathname, url, env, request);
      }

      if (pathname.startsWith('/api/tmini/')) {
        return await handleTmini(pathname, url, env, request);
      }

      if (pathname === '/api/marriage/single' || pathname === '/api/marriage/dual') {
        if (request.method !== 'POST') {
          return json({ code: 405, msg: 'POST required' }, 405, request);
        }
        return await handleMarriage(pathname, request, env);
      }

      return json({ code: 404, msg: 'Not Found', path: pathname }, 404, request);
    } catch (e) {
      return json({ code: 500, msg: e.message || 'Internal Error' }, 500, request);
    }
  },
};

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data, status, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(request),
    },
  });
}

// ============= 天行数据代理 =============
async function handleTianapi(pathname, url, env, request) {
  const key = env.TIANAPI_KEY;
  if (!key) return json({ code: 503, msg: '后端未配置 TIANAPI_KEY（wrangler secret put TIANAPI_KEY）' }, 503, request);

  const endpoint = pathname.replace('/api/tianapi/', '').replace(/\/+$/, '');
  if (!endpoint) return json({ code: 400, msg: 'endpoint required' }, 400, request);

  // 透传查询参数（除内部用 key）
  const params = new URLSearchParams();
  for (const [k, v] of url.searchParams.entries()) {
    if (k === 'key') continue;
    params.set(k, v);
  }
  params.set('key', key);

  const base = env.TIANAPI_BASE || 'https://apis.tianapi.com';
  const target = `${base}/${endpoint}?${params.toString()}`;

  return await proxyFetch(target, request);
}

// ============= tmini 代理 =============
async function handleTmini(pathname, url, env, request) {
  const key = env.TMINI_KEY; // 可选，部分 tmini 接口需要 key
  const endpoint = pathname.replace('/api/tmini/', '').replace(/\/+$/, '');
  if (!endpoint) return json({ code: 400, msg: 'endpoint required' }, 400, request);

  const params = new URLSearchParams();
  for (const [k, v] of url.searchParams.entries()) params.set(k, v);
  if (key) params.set('apikey', key);

  const base = env.TMINI_BASE || 'https://tmini.net/api';
  const target = `${base}/${endpoint}?${params.toString()}`;
  return await proxyFetch(target, request);
}

// ============= 婚姻核验代理 =============
async function handleMarriage(pathname, request, env) {
  const apiKey = env.MARRIAGE_APIKEY;
  if (!apiKey) return json({ code: 503, msg: '后端未配置 MARRIAGE_APIKEY' }, 503, request);
  const provider = env.MARRIAGE_PROVIDER || 'aliyun';
  const gateway = env.MARRIAGE_GATEWAY || 'https://market.aliyun.com';

  const body = await request.json().catch(() => null);
  if (!body) return json({ code: 400, msg: 'JSON body required' }, 400, request);

  // 不同供应商的入参和路径
  const config = {
    aliyun: {
      path: '/dataApi/openApi/marriageCheck',
      transform: (b, p) => ({
        name1: p === 'dual' ? b.name1 : b.name,
        idCard1: p === 'dual' ? b.idCard1 : b.idCard,
        name2: p === 'dual' ? b.name2 : '',
        idCard2: p === 'dual' ? b.idCard2 : '',
      }),
    },
    hunyin: {
      path: pathname === '/api/marriage/dual' ? '/api/marriage/dual' : '/api/marriage/single',
      transform: (b) => b,
    },
    yushan: {
      path: '/api/v1/IDV041',
      transform: (b) => ({ real_name: b.name, id_card: b.idCard }),
    },
    tianyuan: {
      path: pathname === '/api/marriage/dual' ? '/marital/dual' : '/marital/single',
      transform: (b) => b,
    },
  };

  const cfg = config[provider];
  if (!cfg) return json({ code: 400, msg: `未知供应商：${provider}` }, 400, request);

  const param = pathname === '/api/marriage/dual' ? 'dual' : 'single';
  const target = `${gateway}${cfg.path}`;
  const header = { 'Content-Type': 'application/json' };
  if (provider === 'aliyun') {
    header['Authorization'] = 'APPCODE ' + apiKey;
  } else {
    header['Authorization'] = 'Bearer ' + apiKey;
  }

  const resp = await fetch(target, {
    method: 'POST',
    headers: header,
    body: JSON.stringify(cfg.transform(body, param)),
  });

  const text = await resp.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  return json(data, resp.status, request);
}

// ============= 通用 fetch 代理 =============
async function proxyFetch(target, request) {
  const resp = await fetch(target, {
    method: 'GET',
    headers: { 'User-Agent': 'ShuCha-API-Proxy/1.0' },
    cf: { cacheTtl: 0, cacheEverything: false },
  });
  const text = await resp.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  return json(data, resp.status, request);
}
