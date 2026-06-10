/**
 * 微信支付 v3 模块
 * 文档：https://pay.weixin.qq.com/docs/merchant/apis/jsapi-payment/jsapi-transfer-payment.html
 *
 * 鉴权：商户 API 证书 + 商户 API v3 密钥
 * 签名：SHA256 with RSA（用 API 证书私钥）
 * 通信：HTTPS + JSON
 *
 * 部署：需要以下 3 个文件（不在仓库中，由 wrangler secret 注入）
 *   - apiclient_cert.pem   商户 API 证书
 *   - apiclient_key.pem    商户 API 证书私钥
 *   - apiv3_key            32 位 API v3 密钥
 *
 * 但 CF Workers 不支持文件上传，全部用环境变量：
 *   - WECHAT_MCH_ID               商户号
 *   - WECHAT_APPID                小程序 AppID
 *   - WECHAT_API_V3_KEY           32 位 API v3 密钥
 *   - WECHAT_MCH_CERT_PEM         证书（base64 编码）
 *   - WECHAT_MCH_KEY_PEM          私钥（base64 编码）
 */

const WX_API = 'https://api.mch.weixin.qq.com';

// ============= 1. 通用工具 =============
function utf8(s) { return new TextEncoder().encode(s); }
function b64encode(s) { return btoa(String.fromCharCode(...new Uint8Array(s))); }
function b64decode(s) { return Uint8Array.from(atob(s), c => c.charCodeAt(0)); }

function randomNonceStr(len = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

// 导入 PEM 私钥为 CryptoKey
async function importPrivateKey(pem) {
  // 去掉 BEGIN/END 头尾和换行
  const b64 = pem.replace(/-----BEGIN PRIVATE KEY-----/, '')
                  .replace(/-----END PRIVATE KEY-----/, '')
                  .replace(/\s+/g, '');
  const der = b64decode(b64);
  return await crypto.subtle.importKey(
    'pkcs8', der,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );
}

// 微信 v3 签名
async function wxSign(method, url, body, privateKey) {
  const ts = Math.floor(Date.now() / 1000).toString();
  const nonce = randomNonceStr();
  const bodyStr = body ? JSON.stringify(body) : '';
  const message = `${method}\n${url}\n${ts}\n${nonce}\n${bodyStr}\n`;
  const sigBuf = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    privateKey,
    utf8(message)
  );
  const signature = b64encode(sigBuf);
  return `mchid="${WECHAT_MCH_ID}",nonce_str="${nonce}",timestamp="${ts}",serial_no="${SERIAL_NO}",signature="${signature}"`;
}

// ============= 2. JSAPI 下单（小程序支付）=============
export async function createJsapiOrder(env, openid, outTradeNo, totalFen, body, attach) {
  // totalFen 单位：分
  if (!openid) throw new Error('openid 必填（需 wx.login 拿）');
  if (!Number.isInteger(totalFen) || totalFen < 1) throw new Error('金额必须 ≥ 1 分');

  const path = '/v3/pay/transactions/jsapi';
  const body = {
    appid: env.WECHAT_APPID,
    mchid: env.WECHAT_MCH_ID,
    description: body,
    out_trade_no: outTradeNo,
    notify_url: `${env.NOTIFY_BASE || 'https://shucha.524900.xyz'}/api/pay/notify`,
    amount: { total: totalFen, currency: 'CNY' },
    payer: { openid },
    attach: attach || '',
  };

  const keyPem = atob(env.WECHAT_MCH_KEY_PEM);
  const key = await importPrivateKey(keyPem);
  const auth = await wxSign('POST', path, body, key);

  const resp = await fetch(`${WX_API}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `WECHATPAY2-SHA256-RSA2048 ${auth}`,
      'User-Agent': 'ShuCha-Pay/1.0',
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`JSAPI 下单失败: ${resp.status} ${err}`);
  }
  return await resp.json(); // { prepay_id: 'wx...' }
}

// 生成小程序端调起支付所需的参数
export async function buildJsapiPayParams(env, prepayId) {
  const key = atob(env.WECHAT_API_V3_KEY);
  const ts = Math.floor(Date.now() / 1000).toString();
  const nonce = randomNonceStr();
  const pkg = `prepay_id=${prepayId}`;
  const message = `${env.WECHAT_APPID}\n${ts}\n${nonce}\n${pkg}\n`;

  // HMAC-SHA256
  const cryptoKey = await crypto.subtle.importKey(
    'raw', utf8(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', cryptoKey, utf8(message));
  const paySign = b64encode(sigBuf);

  return {
    timeStamp: ts,
    nonceStr: nonce,
    package: pkg,
    signType: 'RSA',
    paySign,
  };
}

// ============= 3. H5 浏览器支付 =============
export async function createH5Order(env, outTradeNo, totalFen, body, clientIp, attach) {
  if (!clientIp) throw new Error('H5 支付需传 clientIp');

  const path = '/v3/pay/transactions/h5';
  const body = {
    appid: env.WECHAT_APPID,
    mchid: env.WECHAT_MCH_ID,
    description: body,
    out_trade_no: outTradeNo,
    notify_url: `${env.NOTIFY_BASE || 'https://shucha.524900.xyz'}/api/pay/notify`,
    amount: { total: totalFen, currency: 'CNY' },
    scene_info: {
      payer_client_ip: clientIp,
      h5_info: { type: 'Wap', app_name: '数查', app_url: 'https://shucha.524900.xyz' },
    },
    attach: attach || '',
  };

  const keyPem = atob(env.WECHAT_MCH_KEY_PEM);
  const key = await importPrivateKey(keyPem);
  const auth = await wxSign('POST', path, body, key);

  const resp = await fetch(`${WX_API}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `WECHATPAY2-SHA256-RSA2048 ${auth}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) throw new Error(`H5 下单失败: ${resp.status} ${await resp.text()}`);
  return await resp.json(); // { h5_url: 'https://wx.tenpay.com/...' }
}

// ============= 4. 回调验签 =============
export async function verifyNotify(env, header, body) {
  if (!header) return false;
  // 解析 Authorization header
  const m = header.match(/signature="([^"]+)"/);
  if (!m) return false;
  // 简化版：实际需从微信下载平台证书验签（异步获取），此处仅作演示
  // 生产应使用 wechatpay-axios-plugin 完整流程
  return true;
}

// ============= 5. 查单 =============
export async function queryOrder(env, outTradeNo) {
  const path = `/v3/pay/transactions/out-trade-no/${outTradeNo}?mchid=${env.WECHAT_MCH_ID}`;
  const keyPem = atob(env.WECHAT_MCH_KEY_PEM);
  const key = await importPrivateKey(keyPem);
  const auth = await wxSign('GET', path, null, key);

  const resp = await fetch(`${WX_API}${path}`, {
    method: 'GET',
    headers: { 'Authorization': `WECHATPAY2-SHA256-RSA2048 ${auth}` },
  });
  if (!resp.ok) throw new Error(`查单失败: ${resp.status}`);
  return await resp.json();
}

// ============= 6. 退款 =============
export async function refund(env, outTradeNo, refundNo, totalFen, refundFen, reason) {
  const path = '/v3/refund/domestic/refunds';
  const body = {
    out_trade_no: outTradeNo,
    out_refund_no: refundNo,
    reason: reason || '用户申请退款',
    notify_url: `${env.NOTIFY_BASE || 'https://shucha.524900.xyz'}/api/pay/refund-notify`,
    amount: { refund: refundFen, total: totalFen, currency: 'CNY' },
  };

  const keyPem = atob(env.WECHAT_MCH_KEY_PEM);
  const key = await importPrivateKey(keyPem);
  const auth = await wxSign('POST', path, body, key);

  const resp = await fetch(`${WX_API}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `WECHATPAY2-SHA256-RSA2048 ${auth}`,
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`退款失败: ${resp.status} ${await resp.text()}`);
  return await resp.json();
}

// ============= 7. 创建订单号 =============
export function createOutTradeNo(prefix = 'SC') {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).substring(2, 8);
  return `${prefix}${stamp}${rand}`;
}

// 证书序列号（从证书中提取），这里用环境变量 SERIAL_NO
const SERIAL_NO = ''; // 可从 wrangler secret put SERIAL_NO 注入
