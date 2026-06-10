/**
 * 数查 (ShuCha) 支付服务
 * 前端不持有任何密钥，全部走后端代理 /api/pay/*
 * 支持：小程序 JSAPI 支付 / H5 浏览器支付
 */

export interface JsapiPayParams {
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: 'RSA';
  paySign: string;
}

export interface PayOrderResult {
  out_trade_no: string;
  prepay_id?: string;
  payParams?: JsapiPayParams;
  h5_url?: string;
}

export async function createJsapiOrder(opts: {
  totalFen: number;       // 金额（分）
  subject: string;         // 商品描述
  openid: string;          // 用户 openid（小程序 wx.login 获取）
  outTradeNo?: string;     // 自定义订单号（可选）
  attach?: string;         // 附加数据
}): Promise<PayOrderResult | null> {
  return new Promise((resolve) => {
    uni.request({
      url: '/api/pay/jsapi',
      method: 'POST',
      timeout: 15000,
      header: { 'Content-Type': 'application/json' },
      data: opts,
      success: (res) => {
        if (res.statusCode === 200 && (res.data as any)?.code === 0) {
          resolve(res.data as PayOrderResult);
        } else {
          uni.showToast({ title: (res.data as any)?.msg || '下单失败', icon: 'none' });
          resolve(null);
        }
      },
      fail: (err) => {
        uni.showToast({ title: err.errMsg || '网络错误', icon: 'none' });
        resolve(null);
      },
    });
  });
}

export async function createH5Order(opts: {
  totalFen: number;
  subject: string;
  outTradeNo?: string;
  attach?: string;
}): Promise<PayOrderResult | null> {
  return new Promise((resolve) => {
    uni.request({
      url: '/api/pay/h5',
      method: 'POST',
      timeout: 15000,
      header: { 'Content-Type': 'application/json' },
      data: opts,
      success: (res) => {
        if (res.statusCode === 200 && (res.data as any)?.code === 0) {
          resolve(res.data as PayOrderResult);
        } else {
          uni.showToast({ title: (res.data as any)?.msg || '下单失败', icon: 'none' });
          resolve(null);
        }
      },
      fail: (err) => {
        uni.showToast({ title: err.errMsg || '网络错误', icon: 'none' });
        resolve(null);
      },
    });
  });
}

export async function queryOrder(outTradeNo: string): Promise<any> {
  return new Promise((resolve) => {
    uni.request({
      url: `/api/pay/query/${outTradeNo}`,
      method: 'GET',
      timeout: 10000,
      success: (res) => resolve(res.data),
      fail: () => resolve(null),
    });
  });
}

/**
 * 调起微信支付（自动适配小程序 / H5）
 *  - 小程序：uni.requestPayment（微信内置 API）
 *  - H5 微信内：WeixinJSBridge.invoke
 *  - H5 浏览器：直接跳转 h5_url
 */
export async function invokePay(p: PayOrderResult, platform: 'mp' | 'h5' = 'mp'): Promise<boolean> {
  if (!p) return false;
  // 平台判断
  // #ifdef MP-WEIXIN
  return await invokeMpPay(p);
  // #endif
  // #ifdef H5
  return await invokeH5Pay(p, platform);
  // #endif
  return false;
}

async function invokeMpPay(p: PayOrderResult): Promise<boolean> {
  if (!p.payParams) return false;
  return new Promise((resolve) => {
    uni.requestPayment({
      provider: 'wxpay',
      timeStamp: p.payParams!.timeStamp,
      nonceStr: p.payParams!.nonceStr,
      package: p.payParams!.package,
      signType: p.payParams!.signType,
      paySign: p.payParams!.paySign,
      success: () => {
        uni.showToast({ title: '支付成功', icon: 'success' });
        resolve(true);
      },
      fail: (err) => {
        uni.showToast({ title: err.errMsg || '支付取消', icon: 'none' });
        resolve(false);
      },
    });
  });
}

async function invokeH5Pay(p: PayOrderResult, mode: 'h5' = 'h5'): Promise<boolean> {
  // H5 浏览器：直接跳转到 mweb_url
  if (p.h5_url) {
    window.location.href = p.h5_url;
    return true;
  }
  return false;
}

/** 拉起支付一键方法：根据商品参数自动完成下单+调起 */
export async function payFor(params: {
  totalFen: number;
  subject: string;
  outTradeNo?: string;
  attach?: string;
  openid?: string; // 小程序必填
}): Promise<{ out_trade_no: string; success: boolean } | null> {
  // 平台检测
  // #ifdef MP-WEIXIN
  if (!params.openid) {
    uni.showToast({ title: '请先登录小程序', icon: 'none' });
    return null;
  }
  const order = await createJsapiOrder({
    totalFen: params.totalFen,
    subject: params.subject,
    openid: params.openid,
    outTradeNo: params.outTradeNo,
    attach: params.attach,
  });
  if (!order) return null;
  const success = await invokeMpPay(order);
  return { out_trade_no: order.out_trade_no, success };
  // #endif

  // #ifdef H5
  const order = await createH5Order({
    totalFen: params.totalFen,
    subject: params.subject,
    outTradeNo: params.outTradeNo,
    attach: params.attach,
  });
  if (!order) return null;
  await invokeH5Pay(order, 'h5');
  return { out_trade_no: order.out_trade_no, success: false }; // H5 跳转后由用户完成支付
  // #endif
}
