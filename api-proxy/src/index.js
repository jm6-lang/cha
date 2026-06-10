/**
 * 数查 (ShuCha) API 代理 - Cloudflare Worker
 * 把第三方 API Key 隔离在后端，前端只调本代理
 *
 * 路由表：
 *   GET  /api/tianapi/:endpoint?params...   → 代理天行数据
 *   GET  /api/tmini/:endpoint?params...     → 代理 tmini.net
 *   POST /api/marriage/single               → 个人婚姻核验
 *   POST /api/marriage/dual                 → 双人婚姻核验
 *   POST /api/pay/jsapi                     → 小程序支付下单
 *   POST /api/pay/h5                        → H5 浏览器支付下单
 *   GET  /api/pay/query/:out_trade_no       → 查单
 *   POST /api/pay/refund                    → 退款
 *   POST /api/pay/notify                    → 微信支付回调（验签）
 *   GET  /api/health                        → 健康检查
 *
 * 部署：
 *   wrangler secret put TIANAPI_KEY
 *   wrangler secret put MARRIAGE_APIKEY
 *   wrangler secret put MARRIAGE_PROVIDER     # aliyun / hunyin / yushan / tianyuan
 *   wrangler secret put MARRIAGE_GATEWAY      # 可选，覆盖默认网关
 *
 *   # 微信支付（拿到商户号后注入）
 *   wrangler secret put WECHAT_MCH_ID
 *   wrangler secret put WECHAT_APPID
 *   wrangler secret put WECHAT_API_V3_KEY
 *   wrangler secret put WECHAT_MCH_KEY_PEM    # base64 编码
 *   wrangler secret put SERIAL_NO
 *   wrangler deploy
 */

import {
  createJsapiOrder, buildJsapiPayParams,
  createH5Order, queryOrder, refund, verifyNotify,
  createOutTradeNo,
} from './pay.js';

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

      // 支付路由
      if (pathname === '/api/pay/jsapi' && request.method === 'POST') {
        return await handleJsapiPay(request, env);
      }
      if (pathname === '/api/pay/h5' && request.method === 'POST') {
        return await handleH5Pay(request, env);
      }
      if (pathname.startsWith('/api/pay/query/') && request.method === 'GET') {
        const outTradeNo = pathname.replace('/api/pay/query/', '');
        return await handlePayQuery(outTradeNo, env);
      }
      if (pathname === '/api/pay/refund' && request.method === 'POST') {
        return await handleRefund(request, env);
      }
      if (pathname === '/api/pay/notify' && request.method === 'POST') {
        return await handleNotify(request, env);
      }

      if (pathname === '/api/wx/jscode2session' && request.method === 'POST') {
        return await handleWxCode2Session(request, env);
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

// ============= 微信支付路由 =============
function requirePayConfig(env) {
  if (!env.WECHAT_MCH_ID || !env.WECHAT_APPID || !env.WECHAT_API_V3_KEY || !env.WECHAT_MCH_KEY_PEM) {
    throw new Error('未配置微信支付参数（wrangler secret put WECHAT_MCH_ID / APPID / API_V3_KEY / MCH_KEY_PEM）');
  }
}

async function handleJsapiPay(request, env) {
  requirePayConfig(env);
  const body = await request.json().catch(() => null);
  if (!body) return json({ code: 400, msg: 'JSON body required' }, 400, request);
  const { openid, totalFen, subject, outTradeNo, attach } = body;
  if (!openid || !totalFen || !subject) {
    return json({ code: 400, msg: 'openid/totalFen/subject 必填' }, 400, request);
  }
  const order = await createJsapiOrder(env, openid, outTradeNo || createOutTradeNo('JS'), totalFen, subject, attach);
  const payParams = await buildJsapiPayParams(env, order.prepay_id);
  return json({ code: 0, prepay_id: order.prepay_id, payParams, out_trade_no: outTradeNo || createOutTradeNo('JS') }, 200, request);
}

async function handleH5Pay(request, env) {
  requirePayConfig(env);
  const body = await request.json().catch(() => null);
  if (!body) return json({ code: 400, msg: 'JSON body required' }, 400, request);
  const { totalFen, subject, outTradeNo, clientIp, attach } = body;
  if (!totalFen || !subject) return json({ code: 400, msg: 'totalFen/subject 必填' }, 400, request);
  const ip = clientIp || request.headers.get('CF-Connecting-IP') || '127.0.0.1';
  const order = await createH5Order(env, outTradeNo || createOutTradeNo('H5'), totalFen, subject, ip, attach);
  return json({ code: 0, h5_url: order.h5_url, out_trade_no: outTradeNo || createOutTradeNo('H5') }, 200, request);
}

async function handlePayQuery(outTradeNo, env) {
  requirePayConfig(env);
  const r = await queryOrder(env, outTradeNo);
  return json({ code: 0, ...r }, 200, request);
}

async function handleRefund(request, env) {
  requirePayConfig(env);
  const body = await request.json().catch(() => null);
  if (!body) return json({ code: 400, msg: 'JSON body required' }, 400, request);
  const { outTradeNo, refundNo, totalFen, refundFen, reason } = body;
  const r = await refund(env, outTradeNo, refundNo || createOutTradeNo('RF'), totalFen, refundFen, reason);
  return json({ code: 0, ...r }, 200, request);
}

async function handleNotify(request, env) {
  // 验签（生产环境需从微信下载平台证书，此处为简化）
  const ok = await verifyNotify(env, request.headers.get('Wechatpay-Signature'), null);
  if (!ok) return new Response('FAIL', { status: 401 });
  // 解析回调内容（业务逻辑：更新订单状态、发货、查询服务等）
  const body = await request.json();
  console.log('支付回调：', body);
  // 业务处理成功后必须返回 200 + 特定 JSON
  return new Response(JSON.stringify({ code: 'SUCCESS', message: '成功' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ============= 微信 code 换 openid =============
async function handleWxCode2Session(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.code) return json({ code: 400, msg: 'code required' }, 400, request);
  const appid = env.WECHAT_APPID;
  const secret = env.WECHAT_APP_SECRET;
  if (!appid || !secret) {
    return json({ code: 503, msg: '后端未配置 WECHAT_APPID / WECHAT_APP_SECRET' }, 503, request);
  }
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${body.code}&grant_type=authorization_code`;
  const resp = await fetch(url);
  const data: any = await resp.json();
  if (data.openid) {
    return json({ code: 0, openid: data.openid, unionid: data.unionid, session_key: data.session_key }, 200, request);
  }
  return json({ code: data.errcode || 500, msg: data.errmsg || 'session 失败' }, 500, request);
}
