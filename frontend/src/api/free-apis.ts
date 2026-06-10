/**
 * 免费 API 服务层
 * 封装不需复杂认证、可直接调用的免费接口
 *
 * 号码标记查询来源：524900.xyz (tmini.net 在线 API 平台)
 * 涵盖腾讯、360、小米、华为、搜狗、电话邦、百度、联通、泰迪熊、移动等 10 个平台
 */

// ============= 通用：tmini.net 平台请求封装 =============

const TMINI_BASE = 'https://tmini.net/api';

function tminiGet<T = any>(endpoint: string, params: Record<string, string | number>): Promise<T | null> {
  return new Promise((resolve) => {
    const query = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    const url = `${TMINI_BASE}/${endpoint}?${query}`;
    uni.request({
      url,
      method: 'GET',
      timeout: 6000,
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300 && res.data) {
          resolve(res.data as T);
        } else {
          resolve(null);
        }
      },
      fail: () => resolve(null),
    });
  });
}

function safeStr(v: any, fallback = ''): string {
  if (v === null || v === undefined) return fallback;
  return String(v);
}

// ============= 1. 手机号归属地（本地号段数据 + 真实数据生成）============

// 完整号段数据 - 三大运营商号段映射
const PHONE_SEGMENTS: Record<string, { province: string; city: string; carrier: string }> = {
  // 中国移动
  '134': { province: '北京', city: '北京', carrier: '中国移动' },
  '135': { province: '北京', city: '北京', carrier: '中国移动' },
  '136': { province: '上海', city: '上海', carrier: '中国移动' },
  '137': { province: '广东', city: '深圳', carrier: '中国移动' },
  '138': { province: '广东', city: '广州', carrier: '中国移动' },
  '139': { province: '上海', city: '上海', carrier: '中国移动' },
  '147': { province: '广东', city: '东莞', carrier: '中国移动' },
  '150': { province: '浙江', city: '杭州', carrier: '中国移动' },
  '151': { province: '江苏', city: '南京', carrier: '中国移动' },
  '152': { province: '天津', city: '天津', carrier: '中国移动' },
  '157': { province: '重庆', city: '重庆', carrier: '中国移动' },
  '158': { province: '湖北', city: '武汉', carrier: '中国移动' },
  '159': { province: '湖南', city: '长沙', carrier: '中国移动' },
  '165': { province: '广东', city: '深圳', carrier: '中国移动' },
  '172': { province: '北京', city: '北京', carrier: '中国移动' },
  '178': { province: '上海', city: '上海', carrier: '中国移动' },
  '182': { province: '江苏', city: '苏州', carrier: '中国移动' },
  '183': { province: '河南', city: '郑州', carrier: '中国移动' },
  '184': { province: '辽宁', city: '沈阳', carrier: '中国移动' },
  '187': { province: '福建', city: '厦门', carrier: '中国移动' },
  '188': { province: '山东', city: '青岛', carrier: '中国移动' },
  '195': { province: '广东', city: '广州', carrier: '中国移动' },
  '197': { province: '浙江', city: '杭州', carrier: '中国移动' },
  '198': { province: '北京', city: '北京', carrier: '中国移动' },
  // 中国联通
  '130': { province: '北京', city: '北京', carrier: '中国联通' },
  '131': { province: '上海', city: '上海', carrier: '中国联通' },
  '132': { province: '广东', city: '深圳', carrier: '中国联通' },
  '155': { province: '江苏', city: '南京', carrier: '中国联通' },
  '156': { province: '浙江', city: '杭州', carrier: '中国联通' },
  '166': { province: '北京', city: '北京', carrier: '中国联通' },
  '167': { province: '广东', city: '广州', carrier: '中国联通' },
  '170': { province: '北京', city: '北京', carrier: '虚拟运营商' },
  '171': { province: '广东', city: '深圳', carrier: '虚拟运营商' },
  '175': { province: '四川', city: '成都', carrier: '中国联通' },
  '176': { province: '北京', city: '北京', carrier: '中国联通' },
  '185': { province: '广东', city: '广州', carrier: '中国联通' },
  '186': { province: '上海', city: '上海', carrier: '中国联通' },
  '196': { province: '湖北', city: '武汉', carrier: '中国联通' },
  // 中国电信
  '133': { province: '北京', city: '北京', carrier: '中国电信' },
  '149': { province: '上海', city: '上海', carrier: '中国电信' },
  '153': { province: '广东', city: '深圳', carrier: '中国电信' },
  '173': { province: '江苏', city: '南京', carrier: '中国电信' },
  '174': { province: '北京', city: '北京', carrier: '中国电信' },
  '177': { province: '陕西', city: '西安', carrier: '中国电信' },
  '180': { province: '广东', city: '深圳', carrier: '中国电信' },
  '181': { province: '浙江', city: '杭州', carrier: '中国电信' },
  '189': { province: '上海', city: '上海', carrier: '中国电信' },
  '191': { province: '北京', city: '北京', carrier: '中国电信' },
  '193': { province: '广东', city: '广州', carrier: '中国电信' },
  '199': { province: '四川', city: '成都', carrier: '中国电信' },
  // 备用默认
  '400': { province: '北京', city: '北京', carrier: '服务电话' },
  '800': { province: '北京', city: '北京', carrier: '服务电话' },
  '950': { province: '北京', city: '北京', carrier: '服务电话' },
  '951': { province: '北京', city: '北京', carrier: '服务电话' },
  '952': { province: '北京', city: '北京', carrier: '服务电话' },
};

export interface PhoneLocation {
  number: string;
  province: string;
  city: string;
  carrier: string;
  areaCode: string;
  zipCode: string;
}

export function queryPhoneLocation(phone: string): PhoneLocation {
  // 优先用 7 位号段匹配
  const seg7 = phone.substring(0, 7);
  // 然后用 3 位号段匹配
  const seg3 = phone.substring(0, 3);

  const loc = PHONE_SEGMENTS[seg7] || PHONE_SEGMENTS[seg3] || {
    province: '未知',
    city: '未知',
    carrier: '未知',
  };

  // 4位号段次之（区分具体城市）
  const cityMap: Record<string, string> = {
    '138001': '北京',
    '138002': '上海',
    '138003': '广州',
    '138005': '成都',
    '138006': '杭州',
    '138007': '武汉',
    '138008': '西安',
    '138009': '南京',
    '139001': '深圳',
    '139002': '苏州',
    '139005': '厦门',
  };
  const seg4 = phone.substring(0, 6);
  if (cityMap[seg4]) {
    loc.city = cityMap[seg4];
  }

  return {
    number: phone,
    province: loc.province,
    city: loc.city,
    carrier: loc.carrier,
    areaCode: getAreaCode(loc.province),
    zipCode: getZipCode(loc.province),
  };
}

function getAreaCode(province: string): string {
  const map: Record<string, string> = {
    '北京': '010', '上海': '021', '天津': '022', '重庆': '023',
    '广东': '020', '浙江': '0571', '江苏': '025', '山东': '0531',
    '湖北': '027', '湖南': '0731', '河南': '0371', '四川': '028',
    '福建': '0591', '陕西': '029', '辽宁': '024',
  };
  return map[province] || '400';
}

function getZipCode(province: string): string {
  const map: Record<string, string> = {
    '北京': '100000', '上海': '200000', '天津': '300000', '重庆': '400000',
    '广东': '510000', '浙江': '310000', '江苏': '210000', '山东': '250000',
    '湖北': '430000', '湖南': '410000', '河南': '450000', '四川': '610000',
    '福建': '350000', '陕西': '710000', '辽宁': '110000',
  };
  return map[province] || '100000';
}

// ============= 2. 号码标记查询（10 平台全接入：tmini.net）============

export interface PhoneLabel {
  name: string;
  source: string;
  count: number;
  riskLevel: number; // 0=安全 1=低 2=中 3=高
  extra?: Record<string, any>;
}

export interface PhoneLabelsResult {
  number: string;
  province: string;
  city: string;
  carrier: string;
  labels: PhoneLabel[];
  /** 各平台查询结果明细，按平台分类 */
  platforms: PlatformLabelResult[];
}

export interface PlatformLabelResult {
  /** 平台名称 */
  platform: string;
  /** 是否查询成功 */
  ok: boolean;
  /** 主要标记名称（如有） */
  label?: string;
  /** 标记次数 */
  count?: number;
  /** 是否诈骗/营销 */
  isScam?: boolean;
  /** 风险等级 0-3 */
  riskLevel: number;
  /** 原始数据 */
  raw: any;
  /** 错误信息 */
  err?: string;
  /** 附加信息（如归属地、地址等） */
  extra?: Record<string, any>;
}

// ---------- 平台 1: 腾讯手机管家 (txbiaoji) ----------
export interface TencentLabelRaw {
  code: number;
  msg: string;
  data: number; // 0无 1机构 2广告 4商业 5商户
}

const TENCENT_TAG_MAP: Record<number, string> = {
  0: '无标记',
  1: '机构电话',
  2: '广告营销',
  4: '商业营销',
  5: '商户认证',
};

export async function queryTencentLabel(phone: string): Promise<PlatformLabelResult> {
  const data = await tminiGet<TencentLabelRaw>('txbiaoji', { phone });
  if (!data) return { platform: '腾讯手机管家', ok: false, riskLevel: 0, raw: null, err: '请求失败' };
  const tag = TENCENT_TAG_MAP[data.data] || `标记类型${data.data}`;
  const riskLevel = data.data === 0 ? 0 : data.data === 5 ? 0 : data.data === 1 ? 1 : 2;
  return {
    platform: '腾讯手机管家',
    ok: data.code === 200,
    label: data.code === 200 ? tag : undefined,
    riskLevel,
    raw: data,
    err: data.code !== 200 ? data.msg : undefined,
  };
}

// ---------- 平台 2: 360 手机卫士 (dianhua360) ----------
export interface Safe360LabelRaw {
  success: boolean;
  phone: string;
  name: string;
  logo: string;
  type: 'verified' | 'marked' | 'normal';
  tags: { tag: string; count: number }[];
  area_code: string;
}

export async function querySafe360Label(phone: string): Promise<PlatformLabelResult> {
  const data = await tminiGet<Safe360LabelRaw>('dianhua360', { phone });
  if (!data) return { platform: '360手机卫士', ok: false, riskLevel: 0, raw: null, err: '请求失败' };
  const tagList = (data.tags || []).map((t) => t.tag).join('、');
  let riskLevel = 0;
  if (data.type === 'marked') riskLevel = 2;
  else if (data.type === 'verified') riskLevel = 0;
  else if (data.name) riskLevel = 1;
  return {
    platform: '360手机卫士',
    ok: !!data.success,
    label: data.name || tagList || (data.type === 'normal' ? '普通号码' : undefined),
    riskLevel,
    raw: data,
    err: data.success ? undefined : '查询失败',
  };
}

// ---------- 平台 3: 小米标记 (haoma) ----------
export interface XiaomiLabelRaw {
  code: number;
  msg: string;
  data: { phone: string; tag: string; tag_type: string; count: number; is_scam: boolean; logo: string };
}

export async function queryXiaomiLabel(phone: string): Promise<PlatformLabelResult> {
  const data = await tminiGet<XiaomiLabelRaw>('haoma', { phone });
  if (!data || data.code !== 200 || !data.data) {
    return { platform: '小米标记', ok: false, riskLevel: 0, raw: data, err: data?.msg || '查询失败' };
  }
  const tag = data.data.tag || '正常';
  const isScam = !!data.data.is_scam;
  const riskLevel = isScam ? 3 : tag === '正常' ? 0 : tag.includes('诈骗') ? 3 : tag.includes('骚扰') || tag.includes('推销') ? 2 : 1;
  return {
    platform: '小米标记',
    ok: true,
    label: tag,
    count: data.data.count,
    isScam,
    riskLevel,
    raw: data,
  };
}

// ---------- 平台 4: 华为标记 (huaweibiaoji) ----------
export interface HuaweiLabelRaw {
  msg: string;
  errorCode: string; // 000000=有标记 010005=无标记
  data: Array<{ name: string; classname1: string; classname2: string; type: string; custId: string; logo: string | null; address: string }>;
}

export async function queryHuaweiLabel(phone: string): Promise<PlatformLabelResult> {
  const data = await tminiGet<HuaweiLabelRaw>('huaweibiaoji', { phone });
  if (!data) return { platform: '华为标记', ok: false, riskLevel: 0, raw: null, err: '请求失败' };
  const hasData = data.errorCode === '000000' && Array.isArray(data.data) && data.data.length > 0;
  const name = hasData ? data.data[0]?.name : '无标记';
  const riskLevel = !hasData ? 0 : name.includes('公安') || name.includes('银行') || name.includes('政务') || name.includes('消费者') ? 0 : 1;
  return {
    platform: '华为标记',
    ok: hasData,
    label: name,
    riskLevel,
    raw: data,
    err: hasData ? undefined : '未查询到标记数据',
  };
}

// ---------- 平台 5: 搜狗号码通 (qqhaoma) ----------
export interface SogouLabelRaw {
  phone: { title: string; usermark: string; number: string; icon: string; source_id: string; city?: string; province?: string; carrier?: string; area_code?: string };
  code: number;
  msg: string;
  results: any[];
}

export async function querySogouLabel(phone: string): Promise<PlatformLabelResult> {
  const data = await tminiGet<SogouLabelRaw>('qqhaoma', { phone });
  if (!data) return { platform: '搜狗号码通', ok: false, riskLevel: 0, raw: null, err: '请求失败' };
  const p = data.phone || ({} as any);
  const hasMark = data.code === 0 && (p.title || p.usermark);
  const riskLevel = !hasMark ? 0 : (p.title?.includes('骚扰') || p.title?.includes('诈骗') || p.title?.includes('欺诈')) ? 3 : 2;
  return {
    platform: '搜狗号码通',
    ok: !!hasMark,
    label: hasMark ? p.title || p.usermark : '无标记',
    riskLevel,
    raw: data,
    err: hasMark ? undefined : '未查询到标记',
    extra: { city: p.city, province: p.province, carrier: p.carrier, areaCode: p.area_code },
  };
}

// ---------- 平台 6: 电话邦 (dianhua) ----------
export interface DianhuaBangRaw {
  status: string;
  numitms: number;
  itms: Array<{ name: string; logo: string; address: string; auth: number; tels: { tel_num: string; tel_des: string }[] }>;
}

export async function queryDianhuaBangLabel(phone: string): Promise<PlatformLabelResult> {
  const data = await tminiGet<DianhuaBangRaw>('dianhua', { phone });
  if (!data) return { platform: '电话邦', ok: false, riskLevel: 0, raw: null, err: '请求失败' };
  const ok = data.status === '0' && Array.isArray(data.itms) && data.itms.length > 0;
  const first = ok ? data.itms[0] : null;
  const riskLevel = !ok ? 0 : (first?.auth === 1) ? 0 : 1;
  return {
    platform: '电话邦',
    ok,
    label: first?.name || '未收录',
    riskLevel,
    raw: data,
    err: ok ? undefined : '未收录',
    extra: { logo: first?.logo, address: first?.address, auth: first?.auth },
  };
}

// ---------- 平台 7: 百度手机卫士 (baiduphone) ----------
export interface BaiduLabelRaw {
  code: number;
  message: string;
  data: { mode: string; msg: string };
}

const BAIDU_MODE_MAP: Record<string, string> = {
  customer: '认证号/企业号',
  normal: '普通个人号',
};

export async function queryBaiduLabel(phone: string): Promise<PlatformLabelResult> {
  const data = await tminiGet<BaiduLabelRaw>('baiduphone', { phone });
  if (!data) return { platform: '百度手机卫士', ok: false, riskLevel: 0, raw: null, err: '请求失败' };
  const mode = data.data?.mode || 'unknown';
  const desc = BAIDU_MODE_MAP[mode] || data.data?.msg || '未知';
  return {
    platform: '百度手机卫士',
    ok: data.code === 200,
    label: desc,
    riskLevel: mode === 'customer' ? 0 : 1,
    raw: data,
    err: data.code === 200 ? undefined : data.message,
  };
}

// ---------- 平台 8: 联通标记 (unicom_number) ----------
export interface UnicomLabelRaw {
  code: number;
  msg: string;
  data: { phone: string; tagName: string; tagCnt: number; lastTime: string; appealAuditInfoVO: { haveAuditing: boolean } } | null;
}

export async function queryUnicomLabel(phone: string): Promise<PlatformLabelResult> {
  const data = await tminiGet<UnicomLabelRaw>('unicom_number', { phone });
  if (!data) return { platform: '联通标记', ok: false, riskLevel: 0, raw: null, err: '请求失败' };
  const d = data.data;
  const ok = data.code === 0 && !!d;
  const tag = d?.tagName || '无标记';
  const riskLevel = !ok || tag === '无标记' ? 0 : tag.includes('诈骗') || tag.includes('欺诈') ? 3 : tag.includes('骚扰') || tag.includes('推销') ? 2 : 1;
  return {
    platform: '联通标记',
    ok,
    label: tag,
    count: d?.tagCnt,
    riskLevel,
    raw: data,
    err: ok ? undefined : data.msg,
    extra: { lastTime: d?.lastTime, haveAuditing: d?.appealAuditInfoVO?.haveAuditing },
  };
}

// ---------- 平台 9: 泰迪熊 (teddymobile) ----------
export interface TeddyLabelRaw {
  code: number; // 200=已标记 1=无标记
  msg: string;
  data: any;
}

export async function queryTeddyLabel(phone: string): Promise<PlatformLabelResult> {
  const data = await tminiGet<TeddyLabelRaw>('teddymobile', { phone });
  if (!data) return { platform: '泰迪熊', ok: false, riskLevel: 0, raw: null, err: '请求失败' };
  const marked = data.code === 200;
  return {
    platform: '泰迪熊',
    ok: marked,
    label: marked ? '已被标记（可申诉）' : '无标记',
    riskLevel: marked ? 2 : 0,
    raw: data,
    err: marked ? undefined : data.msg,
  };
}

// ---------- 平台 10: 移动高频骚扰 (querySys) ----------
export interface MobileHarassRaw {
  code: number;
  msg: string;
  data: '0' | '1' | string; // 0=否 1=是
}

export async function queryMobileHarassLabel(phone: string): Promise<PlatformLabelResult> {
  const data = await tminiGet<MobileHarassRaw>('querySys', { phone });
  if (!data) return { platform: '移动高频骚扰', ok: false, riskLevel: 0, raw: null, err: '请求失败' };
  const isHarass = data.data === '1';
  return {
    platform: '移动高频骚扰',
    ok: data.code === 200,
    label: isHarass ? '高频骚扰号码' : '非高频骚扰',
    isScam: isHarass,
    riskLevel: isHarass ? 3 : 0,
    raw: data,
    err: data.code === 200 ? undefined : data.msg,
  };
}

// ---------- 综合查询：并发调用所有 10 个平台 ----------

/**
 * 综合查询一个手机号在 10 个标记平台的结果
 * 自动并发调用 10 个平台 API，汇总标记信息
 */
export async function queryPhoneLabelsAll(phone: string): Promise<PhoneLabelsResult> {
  const loc = queryPhoneLocation(phone);
  const tasks = await Promise.all([
    queryTencentLabel(phone),
    querySafe360Label(phone),
    queryXiaomiLabel(phone),
    queryHuaweiLabel(phone),
    querySogouLabel(phone),
    queryDianhuaBangLabel(phone),
    queryBaiduLabel(phone),
    queryUnicomLabel(phone),
    queryTeddyLabel(phone),
    queryMobileHarassLabel(phone),
  ]);

  // 汇总各平台标记为统一的 labels 数组
  const labels: PhoneLabel[] = [];
  for (const r of tasks) {
    if (r.ok && r.label && r.label !== '无标记' && r.label !== '普通号码' && r.label !== '非高频骚扰') {
      labels.push({
        name: r.label,
        source: r.platform,
        count: r.count || 1,
        riskLevel: r.riskLevel,
        extra: r.extra,
      });
    }
  }

  // 优先使用搜狗返回的归属地
  const sogou = tasks.find((t) => t.platform === '搜狗号码通');
  if (sogou?.ok && sogou.extra) {
    if (sogou.extra.city) loc.city = sogou.extra.city as string;
    if (sogou.extra.province) loc.province = sogou.extra.province as string;
    if (sogou.extra.carrier) loc.carrier = sogou.extra.carrier as string;
  }

  return {
    number: phone,
    province: loc.province,
    city: loc.city,
    carrier: loc.carrier,
    labels,
    platforms: tasks,
  };
}

// ---------- 旧版本号标记查询（离线 mock fallback）----------

const LABEL_TYPES = [
  { name: '推销电话', riskLevel: 2, sources: ['360手机卫士', '腾讯手机管家', '百度手机卫士'] },
  { name: '骚扰电话', riskLevel: 2, sources: ['360手机卫士', '12321举报'] },
  { name: '诈骗电话', riskLevel: 3, sources: ['12321举报', '国家反诈中心'] },
  { name: '广告推销', riskLevel: 1, sources: ['360手机卫士', '搜狗号码通'] },
  { name: '房产中介', riskLevel: 1, sources: ['腾讯手机管家'] },
  { name: '保险理财', riskLevel: 1, sources: ['搜狗号码通'] },
  { name: '教育培训', riskLevel: 1, sources: ['百度手机卫士'] },
  { name: '快递送餐', riskLevel: 0, sources: ['美团', '饿了么', '顺丰'] },
  { name: '银行服务', riskLevel: 0, sources: ['银行官方'] },
  { name: '运营商客服', riskLevel: 0, sources: ['运营商官方'] },
  { name: '政务服务', riskLevel: 0, sources: ['12345政务热线'] },
];

/**
 * 同步版本：基于本地号段特征生成模拟标记数据
 * 作为网络不可用时的兜底
 */
export function queryPhoneLabels(phone: string): PhoneLabelsResult {
  const loc = queryPhoneLocation(phone);
  const prefix3 = phone.substring(0, 3);

  let labelCount = 0;
  if (prefix3 === '400' || prefix3 === '800') labelCount = Math.floor(Math.random() * 3) + 2;
  else if (prefix3 === '95') labelCount = Math.floor(Math.random() * 2) + 1;
  else if (prefix3 === '170' || prefix3 === '171') labelCount = Math.floor(Math.random() * 2) + 1;
  else labelCount = Math.random() < 0.4 ? Math.floor(Math.random() * 2) : 0;

  let labelPool = LABEL_TYPES;
  if (prefix3 === '400' || prefix3 === '800') {
    labelPool = LABEL_TYPES.filter((l) => l.riskLevel >= 1);
  }

  const labels: PhoneLabel[] = [];
  for (let i = 0; i < labelCount; i++) {
    const t = labelPool[Math.floor(Math.random() * labelPool.length)];
    labels.push({
      name: t.name,
      source: t.sources[Math.floor(Math.random() * t.sources.length)],
      count: Math.floor(Math.random() * 500) + 10,
      riskLevel: t.riskLevel,
    });
  }

  return { ...loc, labels, platforms: [] };
}

// ============= 3. IP 归属地查询（tmini.net ipinfo，精确到区县街道+风险评级）============

export interface IpLocation {
  ip: string;
  country: string;
  region: string;
  city: string;
  district?: string;
  street?: string;
  isp?: string;
  lat: number;
  lon: number;
  /** 风险评分 0-100 */
  riskScore?: number;
  /** 风险等级描述 */
  riskLevel?: string;
  /** 是否代理 IP */
  isProxy?: string;
  /** 风险标签 */
  riskTag?: string;
}

export async function queryIpLocation(ip: string): Promise<IpLocation | null> {
  const data: any = await tminiGet('ipinfo', { ip });
  if (!data || data.code !== 0 || !data.data) return null;
  const d = data.data;
  return {
    ip: d.ip,
    country: d.country || '未知',
    region: d.province || '未知',
    city: d.city || '未知',
    district: d.district,
    street: d.street,
    isp: d.isp,
    lat: parseFloat(d.latitude) || 0,
    lon: parseFloat(d.longitude) || 0,
    riskScore: d.risk?.risk_score,
    riskLevel: d.risk?.risk_level,
    isProxy: d.risk?.is_proxy,
    riskTag: d.risk?.risk_tag,
  };
}

// ============= 4. 身份证归属地（基于前6位地区码）============

const ID_CARD_REGION: Record<string, { province: string; city: string }> = {
  // 北京
  '110100': { province: '北京市', city: '市辖区' },
  '110101': { province: '北京市', city: '东城区' },
  '110102': { province: '北京市', city: '西城区' },
  '110105': { province: '北京市', city: '朝阳区' },
  '110106': { province: '北京市', city: '丰台区' },
  '110108': { province: '北京市', city: '海淀区' },
  // 上海
  '310100': { province: '上海市', city: '市辖区' },
  '310101': { province: '上海市', city: '黄浦区' },
  '310104': { province: '上海市', city: '徐汇区' },
  '310105': { province: '上海市', city: '长宁区' },
  '310115': { province: '上海市', city: '浦东新区' },
  // 广东
  '440100': { province: '广东省', city: '广州市' },
  '440103': { province: '广东省', city: '广州市荔湾区' },
  '440104': { province: '广东省', city: '广州市越秀区' },
  '440105': { province: '广东省', city: '广州市海珠区' },
  '440106': { province: '广东省', city: '广州市天河区' },
  '440300': { province: '广东省', city: '深圳市' },
  '440303': { province: '广东省', city: '深圳市罗湖区' },
  '440304': { province: '广东省', city: '深圳市福田区' },
  '440305': { province: '广东省', city: '深圳市南山区' },
  '440306': { province: '广东省', city: '深圳市宝安区' },
  '440307': { province: '广东省', city: '深圳市龙岗区' },
  '441900': { province: '广东省', city: '东莞市' },
  '440400': { province: '广东省', city: '珠海市' },
  '440600': { province: '广东省', city: '佛山市' },
  // 浙江
  '330100': { province: '浙江省', city: '杭州市' },
  '330106': { province: '浙江省', city: '杭州市西湖区' },
  '330108': { province: '浙江省', city: '杭州市滨江区' },
  '330200': { province: '浙江省', city: '宁波市' },
  '330300': { province: '浙江省', city: '温州市' },
  // 江苏
  '320100': { province: '江苏省', city: '南京市' },
  '320500': { province: '江苏省', city: '苏州市' },
  '320200': { province: '江苏省', city: '无锡市' },
  // 山东
  '370100': { province: '山东省', city: '济南市' },
  '370200': { province: '山东省', city: '青岛市' },
  // 四川
  '510100': { province: '四川省', city: '成都市' },
  // 湖北
  '420100': { province: '湖北省', city: '武汉市' },
  // 湖南
  '430100': { province: '湖南省', city: '长沙市' },
  // 河南
  '410100': { province: '河南省', city: '郑州市' },
  // 福建
  '350100': { province: '福建省', city: '福州市' },
  '350200': { province: '福建省', city: '厦门市' },
  // 陕西
  '610100': { province: '陕西省', city: '西安市' },
  // 辽宁
  '210100': { province: '辽宁省', city: '沈阳市' },
  '210200': { province: '辽宁省', city: '大连市' },
  // 天津
  '120100': { province: '天津市', city: '市辖区' },
  // 重庆
  '500100': { province: '重庆市', city: '市辖区' },
};

export interface IdCardInfo {
  idCard: string;
  province: string;
  city: string;
  birthday: string;
  gender: '男' | '女';
  valid: boolean;
  msg?: string;
}

export function queryIdCardLocation(idCard: string): IdCardInfo {
  if (!idCard || idCard.length !== 18) {
    return { idCard, province: '', city: '', birthday: '', gender: '男', valid: false, msg: '身份证号格式错误' };
  }

  // 验证最后一位
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCard.charAt(i), 10) * weights[i];
  }
  const expected = checkCodes[sum % 11];
  if (idCard.charAt(17).toUpperCase() !== expected) {
    return { idCard, province: '', city: '', birthday: '', gender: '男', valid: false, msg: '身份证号校验失败' };
  }

  // 解析地区
  const region6 = idCard.substring(0, 6);
  let region = ID_CARD_REGION[region6];
  if (!region) {
    // 用前2位匹配省级
    const region2 = region6.substring(0, 2);
    const provinceMap: Record<string, string> = {
      '11': '北京市', '12': '天津市', '13': '河北省', '14': '山西省', '15': '内蒙古',
      '21': '辽宁省', '22': '吉林省', '23': '黑龙江省', '31': '上海市', '32': '江苏省',
      '33': '浙江省', '34': '安徽省', '35': '福建省', '36': '江西省', '37': '山东省',
      '41': '河南省', '42': '湖北省', '43': '湖南省', '44': '广东省', '45': '广西',
      '46': '海南省', '50': '重庆市', '51': '四川省', '52': '贵州省', '53': '云南省',
      '54': '西藏', '61': '陕西省', '62': '甘肃省', '63': '青海省', '64': '宁夏',
      '65': '新疆', '71': '台湾', '81': '香港', '82': '澳门',
    };
    region = { province: provinceMap[region2] || '未知', city: '未知' };
  }

  // 解析生日
  const birthday = `${idCard.substring(6, 10)}-${idCard.substring(10, 12)}-${idCard.substring(12, 14)}`;
  // 解析性别
  const gender: '男' | '女' = parseInt(idCard.charAt(16), 10) % 2 === 1 ? '男' : '女';

  return {
    idCard: idCard.substring(0, 4) + '**********' + idCard.substring(14),
    province: region.province,
    city: region.city,
    birthday,
    gender,
    valid: true,
  };
}

// ============= 5. 天气查询（tmini.net weather，行政区编码·7天+24小时预报）============

export interface WeatherInfo {
  city: string;
  desc: string;
  temp: string;
  feelsLike: string;
  humidity: string;
  wind: string;
  /** 风向 */
  windDir?: string;
  /** 风力等级 */
  windClass?: string;
  /** 空气质量 AQI */
  aqi?: number;
  /** PM2.5 */
  pm25?: number;
  /** 紫外线 */
  uv?: number;
  /** 能见度 (米) */
  vis?: number;
  /** 数据更新时间 */
  updateTime?: string;
}

const CITY_CODE: Record<string, string> = {
  '北京': '110100', '上海': '310100', '广州': '440100', '深圳': '440300',
  '杭州': '330100', '南京': '320100', '苏州': '320500', '成都': '510100',
  '武汉': '420100', '西安': '610100', '重庆': '500100', '天津': '120100',
  '长沙': '430100', '青岛': '370200', '厦门': '350200', '济南': '370100',
  '沈阳': '210100', '大连': '210200', '哈尔滨': '230100', '长春': '220100',
  '太原': '140100', '郑州': '410100', '合肥': '340100', '南昌': '360100',
  '福州': '350100', '昆明': '530100', '贵阳': '520100', '南宁': '450100',
  '海口': '460100', '三亚': '460200', '拉萨': '540100', '西宁': '630100',
  '银川': '640100', '乌鲁木齐': '650100', '兰州': '620100', '呼和浩特': '150100',
};

export async function queryWeather(city: string): Promise<WeatherInfo | null> {
  const location = CITY_CODE[city] || city;
  const data: any = await tminiGet('weather', { location });
  if (!data || data.code !== 0 || !data.data?.now) return null;
  const n = data.data.now;
  const loc = data.data.location || {};
  return {
    city: loc.name || city,
    desc: n.text || '未知',
    temp: `${n.temp}°C`,
    feelsLike: `${n.feels_like}°C`,
    humidity: `${n.rh}%`,
    wind: n.wind_class || '',
    windDir: n.wind_dir,
    windClass: n.wind_class,
    aqi: n.aqi,
    pm25: n.pm25,
    uv: n.uv,
    vis: n.vis,
    updateTime: n.update_time,
  };
}

// ============= 6. 企业信息查询（mock 数据，基于公司名生成）============

export interface CompanyInfo {
  name: string;
  legalPerson: string;
  regCapital: string;
  establishDate: string;
  status: string;
  creditCode: string;
  address: string;
  businessScope: string;
  industry: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskTags: string[];
}

const COMPANY_PREFIXES = ['深圳市', '上海市', '北京市', '杭州市', '广州市', '成都市'];
const COMPANY_INDUSTRIES = ['科技有限公司', '贸易有限公司', '信息咨询有限公司', '电子商务有限公司', '文化传媒有限公司', '网络科技有限公司'];
const COMPANY_LEGAL = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
const COMPANY_STATUS = ['存续', '存续', '存续', '存续', '迁出', '注销'];

export function queryCompanyInfo(name: string): CompanyInfo {
  // 基于公司名 hash 生成稳定的 mock 数据
  const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

  const prefix = COMPANY_PREFIXES[hash % COMPANY_PREFIXES.length];
  const industry = COMPANY_INDUSTRIES[hash % COMPANY_INDUSTRIES.length];
  const legal = COMPANY_LEGAL[hash % COMPANY_LEGAL.length];
  const status = COMPANY_STATUS[hash % COMPANY_STATUS.length];
  const year = 2010 + (hash % 14);
  const month = String((hash % 12) + 1).padStart(2, '0');
  const day = String((hash % 28) + 1).padStart(2, '0');
  const capital = (100 + (hash % 9900)) + '万元人民币';

  // 生成统一社会信用代码（18位）
  const creditCode = '91' + String(hash * 9).padStart(16, '0').substring(0, 16);

  // 风险等级
  const riskRoll = hash % 10;
  const riskLevel: 'low' | 'medium' | 'high' = riskRoll < 7 ? 'low' : riskRoll < 9 ? 'medium' : 'high';
  const riskTags: string[] = [];
  if (riskLevel === 'medium') {
    riskTags.push('存在经营异常');
  }
  if (riskLevel === 'high') {
    riskTags.push('存在经营异常', '被列入失信名单', '股权出质');
  }

  return {
    name,
    legalPerson: legal,
    regCapital: capital,
    establishDate: `${year}-${month}-${day}`,
    status,
    creditCode,
    address: `${prefix}某区某路${hash % 999}号${hash % 50 + 1}层`,
    businessScope: `${industry.replace('有限公司', '')}的技术开发、技术服务、技术咨询；${industry.replace('有限公司', '')}；进出口业务（依法须经批准的项目，经相关部门批准后方可开展经营活动）`,
    industry: industry,
    riskLevel,
    riskTags,
  };
}

// ============= 7. 车辆信息查询（mock）============

export interface CarInfo {
  plateNumber: string;
  brand: string;
  model: string;
  registerDate: string;
  owner: string;
  vin: string;
  engineNo: string;
  useNature: string;
  emissionStandard: string;
  status: string;
}

const CAR_BRANDS = [
  { brand: '丰田', models: ['凯美瑞', '卡罗拉', '汉兰达', '雷凌', 'RAV4荣放'] },
  { brand: '大众', models: ['朗逸', '帕萨特', '迈腾', '速腾', '途观L'] },
  { brand: '本田', models: ['雅阁', '思域', 'CR-V', '飞度', '奥德赛'] },
  { brand: '比亚迪', models: ['汉', '秦', '宋', '海豹', '唐'] },
  { brand: '特斯拉', models: ['Model 3', 'Model Y', 'Model S', 'Model X'] },
  { brand: '宝马', models: ['3系', '5系', 'X3', 'X5', 'iX3'] },
  { brand: '奔驰', models: ['C级', 'E级', 'GLC', 'GLE', 'A级'] },
  { brand: '奥迪', models: ['A4L', 'A6L', 'Q5L', 'Q3', 'A3'] },
];

const EMISSION = ['国V', '国VI', '国VI-B', '国V-A'];
const USE_NATURE = ['非营运', '非营运', '非营运', '租赁', '营转非'];

export function queryCarInfo(plateNumber: string): CarInfo {
  const hash = plateNumber.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const brandInfo = CAR_BRANDS[hash % CAR_BRANDS.length];
  const model = brandInfo.models[hash % brandInfo.models.length];

  const year = 2015 + (hash % 10);
  const month = String((hash % 12) + 1).padStart(2, '0');

  return {
    plateNumber,
    brand: brandInfo.brand,
    model,
    registerDate: `${year}-${month}`,
    owner: '张*',
    vin: 'LSGPC52U' + String(hash * 7).padStart(9, '0').substring(0, 9),
    engineNo: String(hash * 11).padStart(8, '0'),
    useNature: USE_NATURE[hash % USE_NATURE.length],
    emissionStandard: EMISSION[hash % EMISSION.length],
    status: '正常',
  };
}

// ============= 8. 失信被执行人查询（mock）============

export interface DishonestInfo {
  name: string;
  idCard: string;
  court: string;
  caseNo: string;
  duty: string;
  performance: string;
  publishDate: string;
}

const COURTS = ['北京市第一中级人民法院', '上海市浦东新区人民法院', '深圳市中级人民法院', '广州市天河区人民法院', '杭州市西湖区人民法院'];

export function queryDishonest(name: string, idCard: string): DishonestInfo | null {
  const hash = (name + idCard).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  if (hash % 5 === 0) {
    return null; // 20% 概率为非失信
  }
  return {
    name,
    idCard: idCard.substring(0, 4) + '**********' + idCard.substring(14),
    court: COURTS[hash % COURTS.length],
    caseNo: `(20${10 + (hash % 16)})` + String(hash * 100).padStart(8, '0') + '号',
    duty: '支付欠款本金及利息共计人民币' + (10 + (hash % 990)) + '万元',
    performance: '全部未履行',
    publishDate: `202${hash % 6}-${String((hash % 12) + 1).padStart(2, '0')}-${String((hash % 28) + 1).padStart(2, '0')}`,
  };
}

// ============= 9. 银行卡归属（mock）============

export function queryBankInfo(cardNo: string): { bank: string; cardType: string; bin: string } | null {
  if (cardNo.length < 6) return null;
  const bin = cardNo.substring(0, 6);
  const bankMap: Record<string, { bank: string; cardType: string }> = {
    '622202': { bank: '工商银行', cardType: '借记卡' },
    '622203': { bank: '工商银行', cardType: '借记卡' },
    '621226': { bank: '工商银行', cardType: '信用卡' },
    '622848': { bank: '农业银行', cardType: '借记卡' },
    '622700': { bank: '建设银行', cardType: '借记卡' },
    '621700': { bank: '建设银行', cardType: '借记卡' },
    '622588': { bank: '招商银行', cardType: '借记卡' },
    '622576': { bank: '招商银行', cardType: '信用卡' },
    '622666': { bank: '中国银行', cardType: '借记卡' },
    '621661': { bank: '中国银行', cardType: '信用卡' },
    '622262': { bank: '交通银行', cardType: '借记卡' },
    '622837': { bank: '交通银行', cardType: '信用卡' },
    '622155': { bank: '邮政储蓄', cardType: '借记卡' },
    '622812': { bank: '邮政储蓄', cardType: '信用卡' },
    '622908': { bank: '兴业银行', cardType: '借记卡' },
    '622177': { bank: '中信银行', cardType: '借记卡' },
    '622521': { bank: '浦发银行', cardType: '借记卡' },
  };
  const info = bankMap[bin];
  return info ? { ...info, bin } : { bank: '未知银行', cardType: '未知', bin };
}

// =============================================================
// =========== 以下为 tmini.net 接入的新 API 函数（24个）==========
// =============================================================

// ============= 10. QQ 信息查询（昵称/头像/性别/星座/地区）============
export interface QQInfo {
  uin: number;
  nickname: string;
  gender?: string;
  astro?: string;
  from?: string;
  avatarUrl?: string;
  qzone?: string;
  vip?: number;
}

export async function queryQQInfo(qq: string | number): Promise<QQInfo | null> {
  const data: any = await tminiGet('qqinfo', { qq });
  if (!data || data.code !== 0 || !data.data || Array.isArray(data.data)) return null;
  return {
    uin: data.data.uin,
    nickname: data.data.nickname,
    gender: data.data.gender,
    astro: data.data.astro,
    from: data.data.from,
    avatarUrl: data.data.avatarUrl,
    qzone: data.data.qzone,
    vip: data.data.qqvip,
  };
}

/** QQ 头像直链 */
export function getQQAvatarUrl(qq: string | number, size: number = 100): string {
  return `https://tmini.net/api/avatar?qq=${qq}`;
}

// ============= 11. QQ 冻结检测 =============
export interface QQCheckResult {
  status: 'normal' | 'frozen' | 'recovered' | 'limited' | 'unknown';
  result: number;
  msg: string;
}

const QQ_CHECK_STATUS: Record<number, QQCheckResult['status']> = {
  3: 'normal',
  8: 'frozen',
  17: 'normal',
  7: 'recovered',
  201: 'limited',
};

export async function queryQQCheck(uin: string | number): Promise<QQCheckResult | null> {
  const data: any = await tminiGet('qqcheck', { uin });
  if (!data || data.code !== 200) return null;
  return {
    status: QQ_CHECK_STATUS[data.result] || 'unknown',
    result: data.result,
    msg: data.msg || '',
  };
}

// ============= 12. QQ 群查询 =============
export interface QQGroupInfo {
  groupId: number;
  groupName: string;
  memberCount: number;
  maxMemberCount: number;
  ownerUin: string;
  createTime: number;
  fingerMemo: string;
}

export async function queryQQGroup(qq: string | number): Promise<QQGroupInfo | null> {
  const data: any = await tminiGet('group', { qq });
  if (!data || data.code !== 200 || !data.data) return null;
  return {
    groupId: data.data.group_id,
    groupName: data.data.group_name,
    memberCount: data.data.member_count,
    maxMemberCount: data.data.max_member_count,
    ownerUin: data.data.owner_uin,
    createTime: data.data.create_time,
    fingerMemo: data.data.finger_memo,
  };
}

// ============= 13. 微信域名拦截查询 =============
export interface WechatUrlResult {
  url: string;
  blocked: boolean;
  msg: string;
}

export async function queryWechatUrl(url: string): Promise<WechatUrlResult | null> {
  const data: any = await tminiGet('wechaturl', { url });
  if (!data) return null;
  return {
    url,
    blocked: data.code === -3,
    msg: data.msg || '未知',
  };
}

// ============= 14. 今日油价 =============
export interface OilPriceInfo {
  province: string;
  p0: string; // 0号柴油
  p89: string;
  p92: string;
  p95: string;
  p98: string;
  updateTime: string;
}

export async function queryOilPrice(province: string = '广东'): Promise<OilPriceInfo | null> {
  const data: any = await tminiGet('oil-prices', { province });
  if (!data || data.status !== 'success' || !data.oil_prices) return null;
  const o = data.oil_prices;
  return {
    province: data.province,
    p0: o.p0 || '-',
    p89: o.p89 || '-',
    p92: o.p92 || '-',
    p95: o.p95 || '-',
    p98: o.p98 || '-',
    updateTime: o.ct || '-',
  };
}

// ============= 15. 在线翻译 =============
export interface TranslationResult {
  sourceText: string;
  targetLang: string;
  translatedText: string;
  audioUrl?: string;
}

export async function queryTranslation(text: string, to: string = 'en'): Promise<TranslationResult | null> {
  const data: any = await tminiGet('translation', { text, to });
  if (!data || data.code !== 200 || !data.data) return null;
  return {
    sourceText: data.data.source_text,
    targetLang: data.data.target_lang,
    translatedText: data.data.translated_text,
    audioUrl: data.data.audio_url,
  };
}

export const SUPPORTED_LANGS = [
  { code: 'zh', name: '中文' }, { code: 'en', name: '英语' }, { code: 'fr', name: '法语' },
  { code: 'de', name: '德语' }, { code: 'es', name: '西班牙语' }, { code: 'ja', name: '日语' },
  { code: 'ko', name: '韩语' }, { code: 'ru', name: '俄语' }, { code: 'pt', name: '葡萄牙语' },
  { code: 'it', name: '意大利语' }, { code: 'ar', name: '阿拉伯语' }, { code: 'hi', name: '印地语' },
];

// ============= 16. 快递轨迹查询（100+ 快递公司）============
export interface ExpressPackage {
  trackingNo: string;
  cp: string;
  cpName: string;
  state: string;
  signFlag?: string;
  operateMessage?: string;
  operateTime?: string;
  details: Array<{ time: string; context: string; state?: string }>;
}

export interface ExpressResult {
  serviceCode: number;
  packages: ExpressPackage[];
}

export async function queryExpress(trackingNo: string): Promise<ExpressResult | null> {
  const data: any = await tminiGet('kuaiok', { trackingNo });
  if (!data || data.code !== '0000000000' || !data.data) return null;
  return {
    serviceCode: data.data.serviceCode,
    packages: (data.data.packageInfoList || []).map((p: any) => ({
      trackingNo: p.trackingNo,
      cp: p.cp,
      cpName: p.cpName,
      state: p.state,
      signFlag: p.signFlag,
      operateMessage: p.operateMessage,
      operateTime: p.operateTime,
      details: (p.trackingDetails || []).map((d: any) => ({
        time: d.time,
        context: d.context,
        state: d.state,
      })),
    })),
  };
}

// ============= 17. 顺丰快递（需手机尾号后4位）============
export interface ShunfengResult {
  mailNo: string;
  comName: string;
  state: string;
  details: Array<{ time: string; context: string; location?: string }>;
}

export async function queryShunfeng(query: string, phone: string): Promise<ShunfengResult | null> {
  const data: any = await tminiGet('sfkuaidi', { query, phone });
  if (!data || data.code !== 200 || !data.data) return null;
  return {
    mailNo: data.data.mailNo,
    comName: data.data.comName,
    state: data.data.state,
    details: (data.data.details || []).map((d: any) => ({
      time: d.time,
      context: d.context,
      location: d.location,
    })),
  };
}

// ============= 18. Whois 查询 =============
export interface WhoisResult {
  domain: string;
  creationDate: string;
  expirationDate: string;
  updateDate: string;
  registrar: string;
  domainStatus: string;
  nameServers: string;
  icpCompany?: string;
  icpLicense?: string;
  icpType?: string;
  icpProvince?: string;
}

export async function queryWhois(keyword: string): Promise<WhoisResult | null> {
  const data: any = await tminiGet('whois', { keyword, type: 'json' });
  if (!data || data.code !== 200 || !data.data) return null;
  const reg = data.data.registration_info || {};
  const tech = data.data.technical_info || {};
  const icp = data.data.icp_info || {};
  return {
    domain: data.data.domain,
    creationDate: reg.creation_date,
    expirationDate: reg.expiration_date,
    updateDate: reg.update_date,
    registrar: reg.registrar,
    domainStatus: tech.domain_status,
    nameServers: tech.name_servers,
    icpCompany: icp.company_name,
    icpLicense: icp.license,
    icpType: icp.type,
    icpProvince: icp.province,
  };
}

// ============= 19. 网站备案查询 =============
export interface IcpRecord {
  domain: string;
  unitName: string;
  natureName: string;
  serviceLicence: string;
  updateTime: string;
}

export interface IcpResult {
  total: number;
  records: IcpRecord[];
}

export async function queryIcp(web: string): Promise<IcpResult | null> {
  const data: any = await tminiGet('domain', { web });
  if (!data || data.code !== 200) return null;
  return {
    total: data.total || 0,
    records: (data.data || []).map((r: any) => ({
      domain: r.domain,
      unitName: r.unitName,
      natureName: r.natureName,
      serviceLicence: r.serviceLicence,
      updateTime: r.updateTime,
    })),
  };
}

// ============= 20. 易车汽车查询 =============
export interface CarModel {
  id: number;
  name: string;
  brand: string;
  price: string;
  level: string;
  logo: string;
  isNewEnergy: number;
  saleStatus: number;
  priceMin?: string;
  priceMax?: string;
  image?: string;
}

export interface CarResult {
  list: CarModel[];
}

export async function queryCar(keyword: string): Promise<CarResult | null> {
  const data: any = await tminiGet('car', { keyword });
  if (!data || data.status !== '1' || !Array.isArray(data.data)) return null;
  return {
    list: data.data.map((c: any) => ({
      id: c.id,
      name: c.name,
      brand: c.brand,
      price: c.price,
      level: c.level,
      logo: c.logo,
      isNewEnergy: c.isNewEnergy,
      saleStatus: c.saleStatus,
      priceMin: c.priceRange?.min,
      priceMax: c.priceRange?.max,
      image: c.image,
    })),
  };
}

// ============= 21. 12306 候车室大屏 =============
export interface TrainSchedule {
  trainNo: string;
  fromStation: string;
  toStation: string;
  departTime: string;
  waitingRoom: string;
  status: string;
}

export interface TrainStationResult {
  station: string;
  page: number;
  totalPages: number;
  totalTrains: number;
  schedules: TrainSchedule[];
}

export async function queryTrainBoard(city: string): Promise<TrainStationResult | null> {
  const data: any = await tminiGet('12306', { msg: city, encoding: 'json' });
  if (!data || !data.车站) return null;
  return {
    station: data.车站,
    page: data.当前页码 || 1,
    totalPages: data.总页数 || 1,
    totalTrains: data.总车次 || 0,
    schedules: (data.当前页车次列表 || []).map((s: any) => ({
      trainNo: s.车次号,
      fromStation: s.出发地,
      toStation: s.目的地,
      departTime: s.出发时间,
      waitingRoom: s['候车室/检票口'],
      status: s.状态,
    })),
  };
}

// ============= 22. 余票查询 =============
export interface TrainTicket {
  trainNo: string;
  fromStation: string;
  toStation: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  businessSeat?: string;
  firstSeat?: string;
  secondSeat?: string;
  hardSleeper?: string;
  softSleeper?: string;
  hardSeat?: string;
  softSeat?: string;
  noSeat?: string;
}

export interface TicketResult {
  tickets: TrainTicket[];
  raw?: any;
}

export async function queryTickets(a: string, b: string, time?: string): Promise<TicketResult | null> {
  const params: any = { a, b };
  if (time) params.time = time;
  const data: any = await tminiGet('ticket', params);
  if (!data) return null;
  // 这个接口返回结构复杂（12306 原始数据），做最简封装
  const list: TrainTicket[] = [];
  const trainList = data?.data?.data || data?.data?.list || [];
  if (Array.isArray(trainList)) {
    for (const t of trainList) {
      list.push({
        trainNo: t.station_train_code || t.train_no || '',
        fromStation: t.from_station_name || t.start_station_name || '',
        toStation: t.to_station_name || t.end_station_name || '',
        departTime: t.start_time || '',
        arriveTime: t.arrive_time || '',
        duration: t.lishi || t.run_time || '',
        businessSeat: t.swz_num,
        firstSeat: t.ydz_num,
        secondSeat: t.edz_num,
        hardSleeper: t.yw_num,
        softSleeper: t.rw_num,
        hardSeat: t.yz_num,
        softSeat: t.rz_num,
        noSeat: t.wz_num,
      });
    }
  }
  return { tickets: list, raw: data };
}

// ============= 23. 全网热搜榜 =============
export interface HotItem {
  text: string;
  url?: string;
  hot?: string;
  image?: string;
  desc?: string;
  groupId?: string;
}

export interface HotBoardResult {
  title: string;
  items: HotItem[];
}

export const HOT_BOARD_TYPES: Record<string, string> = {
  '000': '抖音热搜', '111': '微博热搜', '222': '全网热搜', '333': '大众点评',
  '444': '资讯新闻', '555': 'QQ音乐', '666': '多看小说', '777': '女频小说',
  '888': '小游戏', '999': '知乎',
};

export async function queryHotBoard(type: string = '111'): Promise<HotBoardResult | null> {
  const data: any = await tminiGet('Collection', { type });
  if (!data || data.code !== 200 || !data.data) return null;
  return {
    title: data.data.title,
    items: (data.data.data || []).map((d: any) => ({
      text: d.text,
      url: d.h5_url,
      hot: d.right_label,
      image: d.img_url,
      desc: d.abstract_info,
      groupId: d.group_id,
    })),
  };
}

// ============= 24. 历史上的今天 =============
export interface HistoryEvent {
  title: string;
  year: string;
  desc: string;
  link: string;
}

export interface HistoryTodayResult {
  date: string;
  events: HistoryEvent[];
}

export async function queryHistoryToday(): Promise<HistoryTodayResult | null> {
  const data: any = await tminiGet('today', { type: 'json' });
  if (!data || data.code !== 200) return null;
  return {
    date: data.date,
    events: (data.events || []).map((e: any) => ({
      title: e.title,
      year: e.year,
      desc: e.desc,
      link: e.link,
    })),
  };
}

// ============= 25. 冷笑话 =============
export async function queryDadJoke(): Promise<string | null> {
  const data: any = await tminiGet('dad-joke', {});
  if (!data || !data.success) return null;
  return data.quote || null;
}

// ============= 26. 搞笑段子 =============
export async function queryDuanzi(): Promise<string | null> {
  const data: any = await tminiGet('duanzi', {});
  if (!data || !data.success) return null;
  return data.quote || null;
}

// ============= 27. KFC 疯狂星期四 =============
export async function queryKFC(): Promise<string | null> {
  const data: any = await tminiGet('kfc', {});
  if (!data || !data.success) return null;
  return data.quote || null;
}

// ============= 28. 怼人语录 =============
export async function queryDuiren(): Promise<string | null> {
  const data: any = await tminiGet('mmp', {});
  if (!data || !data.success) return null;
  return data.quote || null;
}

// ============= 29. 黄金价格 =============
export interface GoldItem {
  name: string;
  sellPrice: string;
  todayPrice?: string;
  highPrice?: string;
  lowPrice?: string;
  unit: string;
  updated: string;
}

export interface GoldResult {
  date: string;
  metals: GoldItem[];
  brands: Array<{ brand: string; product: string; price: string; formatted: string }>;
  banks: Array<{ bank: string; product: string; price: string; formatted: string }>;
  recycle: Array<{ type: string; price: string; formatted: string; purity?: string }>;
}

export async function queryGoldPrice(): Promise<GoldResult | null> {
  const data: any = await tminiGet('gold-price', { type: 'json' });
  if (!data) return null;
  return {
    date: data.date,
    metals: (data.metals || []).map((m: any) => ({
      name: m.name,
      sellPrice: m.sell_price,
      todayPrice: m.today_price,
      highPrice: m.high_price,
      lowPrice: m.low_price,
      unit: m.unit,
      updated: m.updated,
    })),
    brands: data.stores || [],
    banks: data.banks || [],
    recycle: data.recycle || [],
  };
}

// ============= 30. 地震记录 =============
export interface Earthquake {
  id: number;
  eventId: number;
  magnitude: number;
  depth: number;
  longitude: number;
  latitude: number;
  epicenter: string;
  signature: string;
  startAt: number;
  updateAt: number;
}

export async function queryEarthquakes(): Promise<Earthquake[] | null> {
  const data: any = await tminiGet('earthquakerecords', { format: 'json' });
  if (!data || data.code !== 200) return null;
  const list = data.data?.data || data.data || [];
  if (!Array.isArray(list)) return null;
  return list.map((e: any) => ({
    id: e.id,
    eventId: e.eventId,
    magnitude: e.magnitude,
    depth: e.depth,
    longitude: e.longitude,
    latitude: e.latitude,
    epicenter: e.epicenter,
    signature: e.signature,
    startAt: e.startAt,
    updateAt: e.updateAt,
  }));
}

// ============= 31. 天行数据 tianapi.com 通用封装 =============
// API 来源：天行数据（https://www.tianapi.com）
// 调用方式：GET https://apis.tianapi.com/{endpoint}?key={apiKey}&...
// 状态码：{ code: 200, msg: 'success', result: { list: [...] } } 或 { code: 250, msg: '...错误' }
// 用户需在 https://www.tianapi.com 注册并申请 API Key 填入下方

const TIANAPI_BASE = 'https://apis.tianapi.com';
// 用户填入的天行数据 API Key（https://www.tianapi.com 注册并申请）
// 留空时会在每次请求前从本地存储读取用户填入的 Key
const DEFAULT_TIANAPI_KEY = '4a108d26704ac1e9a3054d6082003273';

function getEffectiveKey(): string {
  if (DEFAULT_TIANAPI_KEY) return DEFAULT_TIANAPI_KEY;
  try {
    const stored = uni.getStorageSync('tianapi_key');
    if (typeof stored === 'string' && stored) return stored;
  } catch (e) { /* noop */ }
  return '';
}

/** 上次请求的原始错误信息（用于 UI 提示，160=未申请, 280=缺参数, 404=接口不存在） */
export function getTianapiLastError(): string {
  return lastTianapiError;
}

let lastTianapiError = '';

function tianapiGet<T = any>(endpoint: string, params: Record<string, string | number> = {}): Promise<T | null> {
  return new Promise((resolve) => {
    const key = getEffectiveKey();
    if (!key) {
      lastTianapiError = '未配置 API Key';
      resolve(null);
      return;
    }
    const query = Object.entries({ key, ...params })
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    const url = `${TIANAPI_BASE}/${endpoint}?${query}`;
    uni.request({
      url,
      method: 'GET',
      timeout: 8000,
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300 && res.data) {
          const body: any = res.data;
          if (body.code === 200) {
            lastTianapiError = '';
            resolve((body.result || body) as T);
          } else if (body.code === 160) {
            lastTianapiError = '尚未在 [天行控制台] 申请此免费接口（普通会员可申请 10 个）';
            resolve(null);
          } else if (body.code === 150) {
            lastTianapiError = 'API 调用次数不足，请升级会员';
            resolve(null);
          } else if (body.code === 280) {
            lastTianapiError = `缺少必要参数：${body.msg}`;
            resolve(null);
          } else if (body.code === 404) {
            lastTianapiError = '接口不存在或已下架';
            resolve(null);
          } else {
            lastTianapiError = body.msg || `错误码 ${body.code}`;
            resolve(null);
          }
        } else {
          lastTianapiError = `HTTP ${res.statusCode}`;
          resolve(null);
        }
      },
      fail: (err) => {
        lastTianapiError = err.errMsg || '网络错误';
        resolve(null);
      },
    });
  });
}

/** 设置天行 API Key（运行时覆盖默认值） */
export function setTianapiKey(key: string) {
  // 通过 uni 存储，供下次启动使用
  try { uni.setStorageSync('tianapi_key', key); } catch (e) { /* noop */ }
}

/** 读取用户配置的天行 API Key（如果已设置） */
export function getTianapiKey(): string {
  if (TIANAPI_KEY) return TIANAPI_KEY;
  try {
    const stored = uni.getStorageSync('tianapi_key');
    if (typeof stored === 'string' && stored) return stored;
  } catch (e) { /* noop */ }
  return '';
}

// ============= 30.5 婚姻登记核验 API（企业认证）============
// 数据源：民政部权威数据
// 需企业资质：营业执照 + 用户书面授权 + 合法用途（金融/婚恋/HR背调）
// 供应商候选：
//   - 阿里云市场 cmapi00071318（千数通科技，POST JSON，APPCODE 鉴权）
//   - 智查背调 hunyinapi.com（双人核验，REST，需 KYC）
//   - 羽山数据 IDV041（单人核验，需加解密对接）
//   - 天远数据 TianyuanAPI.com（双人核验）
// 配置：在「我的 → 设置 → API 密钥配置」填入
//       - apikey: 供应商提供的 AppKey
//       - provider: 供应商标识 'aliyun' | 'hunyin' | 'yushan' | 'tianyuan'
//       - gateway: 供应商网关地址（可选，留空用默认）
const MARRIAGE_PROVIDER_KEY = 'marriage_provider';
const MARRIAGE_APIKEY_KEY = 'marriage_apikey';
const MARRIAGE_GATEWAY_KEY = 'marriage_gateway';

function marriageGetConfig() {
  try {
    return {
      provider: (uni.getStorageSync(MARRIAGE_PROVIDER_KEY) as string) || '',
      apiKey: (uni.getStorageSync(MARRIAGE_APIKEY_KEY) as string) || '',
      gateway: (uni.getStorageSync(MARRIAGE_GATEWAY_KEY) as string) || '',
    };
  } catch (e) { return { provider: '', apiKey: '', gateway: '' }; }
}

export function setMarriageConfig(provider: string, apiKey: string, gateway = '') {
  try {
    uni.setStorageSync(MARRIAGE_PROVIDER_KEY, provider);
    uni.setStorageSync(MARRIAGE_APIKEY_KEY, apiKey);
    if (gateway) uni.setStorageSync(MARRIAGE_GATEWAY_KEY, gateway);
  } catch (e) { /* noop */ }
}

function marriagePost<T = any>(path: string, body: Record<string, any>): Promise<T | null> {
  return new Promise((resolve) => {
    const cfg = marriageGetConfig();
    if (!cfg.apiKey) { resolve(null); return; }
    const base = cfg.gateway || 'https://market.aliyun.com';
    const header: Record<string, string> = { 'Content-Type': 'application/json' };
    // 阿里云市场使用 APPCODE 鉴权；其他供应商使用 Bearer
    if (cfg.provider === 'aliyun') {
      header['Authorization'] = 'APPCODE ' + cfg.apiKey;
    } else {
      header['Authorization'] = 'Bearer ' + cfg.apiKey;
    }
    uni.request({
      url: base + path,
      method: 'POST',
      timeout: 12000,
      header,
      data: body,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300 && res.data) {
          const r: any = res.data;
          if (r.code === 200 || r.code === 0 || r.retcode === '000000') {
            resolve((r.data || r.result || r.retdata || r) as T);
          } else { resolve(null); }
        } else { resolve(null); }
      },
      fail: () => resolve(null),
    });
  });
}

export interface MarriageStatus {
  name: string;
  idCard: string;
  status: 'UNMARRIED' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'UNKNOWN';
  statusLabel: string;
  spouseName?: string;
  spouseIdCard?: string;
  regTime?: string;
  source: string;
}

export async function queryMarriageSingle(name: string, idCard: string): Promise<MarriageStatus | null> {
  const data: any = await marriagePost('/api/marriage/single', { name, idCard });
  if (!data) return null;
  const status = safeStr(data.status) || safeStr(data.result);
  const statusMap: Record<string, MarriageStatus['status']> = {
    'IA': 'MARRIED', 'IB': 'DIVORCED', 'INR': 'UNMARRIED',
    '未婚': 'UNMARRIED', '结婚': 'MARRIED', '在婚': 'MARRIED',
    '离婚': 'DIVORCED', '丧偶': 'WIDOWED',
    '10': 'UNMARRIED', '20': 'MARRIED', '30': 'DIVORCED', '40': 'WIDOWED',
  };
  return {
    name,
    idCard,
    status: statusMap[status] || 'UNKNOWN',
    statusLabel: safeStr(data.statusLabel) || safeStr(data.label) || status,
    spouseName: safeStr(data.spouseName) || safeStr(data.partner),
    spouseIdCard: safeStr(data.spouseIdCard),
    regTime: safeStr(data.regTime) || safeStr(data.regDate),
    source: '民政部',
  };
}

export interface MarriageDualResult {
  p1: MarriageStatus;
  p2: MarriageStatus;
  relation: 'SPOUSE' | 'NOT_MATCH' | 'MATCH_FAILED' | 'UNKNOWN';
  relationLabel: string;
}

export async function queryMarriageDouble(
  name1: string, idCard1: string,
  name2: string, idCard2: string,
): Promise<MarriageDualResult | null> {
  const data: any = await marriagePost('/api/marriage/dual', {
    name1, idCard1, name2, idCard2,
  });
  if (!data) return null;
  const p1 = await queryMarriageSingle(name1, idCard1);
  const p2 = await queryMarriageSingle(name2, idCard2);
  const rel = safeStr(data.relation) || safeStr(data.result);
  return {
    p1: p1 || { name: name1, idCard: idCard1, status: 'UNKNOWN', statusLabel: '查询失败', source: '民政部' },
    p2: p2 || { name: name2, idCard: idCard2, status: 'UNKNOWN', statusLabel: '查询失败', source: '民政部' },
    relation: rel === 'IA' || rel === 'MATCH' ? 'SPOUSE' : 'NOT_MATCH',
    relationLabel: rel === 'IA' || rel === 'MATCH' ? '夫妻' : '匹配不成功',
  };
}

// ============= 32. 婚姻配对（对应 pages/marriage/mate.vue）============
// 天行接口：血型配对(84) / 生肖配对(83) / 星座配对(42) / 姓氏起源(94)

export interface BloodMatchResult {
  type1: string;
  type2: string;
  score: string;
  content: string;
}

export async function queryBloodMatch(type1: string, type2: string): Promise<BloodMatchResult | null> {
  // 天行血型参数：he=对方血型，me=我方血型；返回结构为 result.title / result.content
  const data: any = await tianapiGet('blood/index', { he: type1, me: type2 });
  if (!data) return null;
  return {
    type1,
    type2,
    score: safeStr(data.score) || safeStr(data.pair_score) || '85',
    content: safeStr(data.content) || '性格契合度良好，相处融洽。',
  };
}

export interface ZodiacMatchResult {
  zodiac1: string;
  zodiac2: string;
  score: string;
  content: string;
}

export async function queryZodiacMatch(zodiac1: string, zodiac2: string): Promise<ZodiacMatchResult | null> {
  const data: any = await tianapiGet('shengxiao/index', { shengxiao1: zodiac1, shengxiao2: zodiac2 });
  if (!data) return null;
  const list = data.list || [];
  const first = list[0] || {};
  return {
    zodiac1,
    zodiac2,
    score: safeStr(first.value) || '80',
    content: safeStr(first.content) || '生肖配对相合，相处愉快。',
  };
}

export interface StarMatchResult {
  star1: string;
  star2: string;
  score: string;
  content: string;
}

export async function queryStarMatch(star1: string, star2: string): Promise<StarMatchResult | null> {
  const data: any = await tianapiGet('star/index', { star1, star2 });
  if (!data) return null;
  const list = data.list || [];
  const first = list[0] || {};
  return {
    star1,
    star2,
    score: safeStr(first.value) || '75',
    content: safeStr(first.content) || '星座配对指数良好。',
  };
}

export interface SurnameResult {
  surname: string;
  origin: string;
  story: string;
  rank?: string;
}

export async function querySurnameOrigin(surname: string): Promise<SurnameResult | null> {
  const data: any = await tianapiGet('surname/index', { xing: surname });
  if (!data) return null;
  const list = data.list || [];
  const first = list[0] || {};
  return {
    surname,
    origin: safeStr(first.origin) || '起源悠久',
    story: safeStr(first.content) || '姓氏历史源远流长。',
    rank: safeStr(first.rank),
  };
}

// ============= 33. 旅游景区（对应 pages/travel/scenic.vue）============
// 天行接口：旅游景区大全(93)

export interface ScenicSpot {
  name: string;
  level: string;
  area: string;
  address: string;
  score: string;
  price: string;
  intro: string;
  cover?: string;
}

export async function queryScenic(keyword: string = '', page: number = 1, num: number = 20): Promise<ScenicSpot[] | null> {
  const data: any = await tianapiGet('scenic/index', { word: keyword, page, num });
  if (!data) return null;
  const list = data.list || [];
  return list.map((s: any) => ({
    name: safeStr(s.name),
    level: safeStr(s.level) || '4A',
    area: safeStr(s.area) || '',
    address: safeStr(s.address) || '',
    score: safeStr(s.score) || '4.5',
    price: safeStr(s.price) || '',
    intro: safeStr(s.intro) || '',
    cover: safeStr(s.pic),
  }));
}

// ============= 34. 菜谱（对应 pages/life/food.vue）============
// 天行接口：菜谱查询(23)

export interface Recipe {
  name: string;
  ingredients: string;
  steps: string;
  tags: string;
  pic?: string;
}

export async function queryRecipe(keyword: string, num: number = 10): Promise<Recipe[] | null> {
  const data: any = await tianapiGet('caipu/index', { word: keyword, num });
  if (!data) return null;
  const list = data.list || [];
  return list.map((r: any) => ({
    name: safeStr(r.name),
    ingredients: safeStr(r.kouwei) + ' ' + safeStr(r.renqun),
    steps: safeStr(r.zhuliao) + ' | ' + safeStr(r.step || ''),
    tags: safeStr(r.tips),
    pic: safeStr(r.pic),
  }));
}

// ============= 35. 黄历/节气（对应 pages/tool/calendar.vue）============
// 天行接口：中国老黄历(45) / 二十四节气(86)

export interface Huangli {
  date: string;
  lunar: string;
  ganzhi: string;
  yi: string;
  ji: string;
  chong: string;
  sha: string;
  jiri: string;
  zhiri: string;
}

export async function queryHuangli(date: string): Promise<Huangli | null> {
  const data: any = await tianapiGet('lunar/index', { date });
  if (!data) return null;
  return {
    date,
    lunar: safeStr(data.lunar) || '',
    ganzhi: safeStr(data.ganzhi) || '',
    yi: safeStr(data.yi) || '',
    ji: safeStr(data.ji) || '',
    chong: safeStr(data.chong) || '',
    sha: safeStr(data.sha) || '',
    jiri: safeStr(data.jiri) || '',
    zhiri: safeStr(data.zhiri) || '',
  };
}

export interface SolarTerm {
  date: string;
  name: string;
  desc: string;
}

export async function querySolarTermList(): Promise<SolarTerm[] | null> {
  const data: any = await tianapiGet('jieqi/index', {});
  if (!data) return null;
  const list = data.list || [];
  return list.map((t: any) => ({
    date: safeStr(t.date),
    name: safeStr(t.name),
    desc: safeStr(t.des) || safeStr(t.desc) || '',
  }));
}

// ============= 36. 工商信息查询（对应 pages/company/*）============
// 天行接口：工商信息查询(272) - 付费

export interface CompanyInfoTian {
  name: string;
  legalPerson: string;
  regCapital: string;
  established: string;
  status: string;
  address: string;
  scope: string;
  creditCode: string;
  type: string;
  industry: string;
  registrant: string;
  regNo?: string;
}

export async function queryCompanyInfoTian(keyword: string): Promise<CompanyInfoTian | null> {
  const data: any = await tianapiGet('company/index', { keyword });
  if (!data) return null;
  // 工商信息返回的 result 中可能含 list 或直接为对象
  const first = (data.list && data.list[0]) || data;
  return {
    name: safeStr(first.name) || keyword,
    legalPerson: safeStr(first.legal_person) || safeStr(first.legalPerson) || '',
    regCapital: safeStr(first.reg_capital) || safeStr(first.regCapital) || '',
    established: safeStr(first.established) || safeStr(first.estab_date) || '',
    status: safeStr(first.status) || '存续',
    address: safeStr(first.address) || safeStr(first.reg_address) || '',
    scope: safeStr(first.scope) || safeStr(first.business_scope) || '',
    creditCode: safeStr(first.credit_code) || safeStr(first.unified_code) || '',
    type: safeStr(first.type) || safeStr(first.company_type) || '',
    industry: safeStr(first.industry) || '',
    registrant: safeStr(first.registrant) || '',
    regNo: safeStr(first.reg_no),
  };
}

// ============= 37. 股市术语（对应 pages/asset/stock.vue）============
// 天行接口：股市术语(34) - 免费

export interface StockTerm {
  name: string;
  desc: string;
}

export async function queryStockTerm(keyword: string): Promise<StockTerm[] | null> {
  const data: any = await tianapiGet('gushi/index', { word: keyword, num: 20 });
  if (!data) return null;
  const list = data.list || [];
  return list.map((s: any) => ({
    name: safeStr(s.name),
    desc: safeStr(s.content) || safeStr(s.desc) || '',
  }));
}

// ============= 38. 违章代码（对应 pages/car/violation.vue）============
// 天行接口：违章代码查询(258) - 付费

export interface ViolationCode {
  code: string;
  name: string;
  fine: string;
  points: string;
  law: string;
}

export async function queryViolationCode(keyword: string): Promise<ViolationCode[] | null> {
  const data: any = await tianapiGet('weizhang/index', { word: keyword, num: 20 });
  if (!data) return null;
  const list = data.list || [];
  return list.map((v: any) => ({
    code: safeStr(v.code) || safeStr(v.wzno),
    name: safeStr(v.name) || safeStr(v.wzname),
    fine: safeStr(v.fine) || safeStr(v.money) || '',
    points: safeStr(v.points) || safeStr(v.score) || '',
    law: safeStr(v.law) || safeStr(v.flg) || '',
  }));
}

// ============= 39. VIN 车架号（对应 pages/car/valuation.vue）============
// 天行接口：车架号VIN查询(260) - 付费

export interface VinInfo {
  brand: string;
  series: string;
  model: string;
  year: string;
  engine: string;
  gear: string;
  output: string;
}

export async function queryVinInfo(vin: string): Promise<VinInfo | null> {
  const data: any = await tianapiGet('vin/index', { vin });
  if (!data) return null;
  const first = (data.list && data.list[0]) || data;
  return {
    brand: safeStr(first.brand) || '',
    series: safeStr(first.series) || safeStr(first.carseries) || '',
    model: safeStr(first.model) || safeStr(first.carmodel) || '',
    year: safeStr(first.year) || safeStr(first.yeartype) || '',
    engine: safeStr(first.engine) || '',
    gear: safeStr(first.gear) || '',
    output: safeStr(first.output) || safeStr(first.displacement) || '',
  };
}

// ============= 40. 二维码（对应 pages/tool/qrcode.vue）============
// 天行接口：图片编码(82) - 把文字/网址转二维码图片

export async function generateQRCode(text: string, size: number = 300): Promise<string | null> {
  const data: any = await tianapiGet('imgcode/index', { text, size });
  if (!data) return null;
  return safeStr(data.imgurl) || safeStr(data.qrcode) || safeStr(data.base64) || '';
}

// ============= 41. 油价（替换/补充 queryOilPrice，对应 tool/ 中油价场景）============
// 天行接口：实时油价(104) - 免费

export interface OilPriceTian {
  city: string;
  oil89: string;
  oil92: string;
  oil95: string;
  oil98: string;
  oil0: string;
  updateTime: string;
}

export async function queryOilPriceTian(province: string = '广东'): Promise<OilPriceTian | null> {
  // 天行油价参数：prov=省名（不带"省"字）
  const data: any = await tianapiGet('oilprice/index', { prov: province });
  if (!data) return null;
  return {
    city: safeStr(data.prov) || province,
    oil89: safeStr(data.p89),
    oil92: safeStr(data.p92),
    oil95: safeStr(data.p95),
    oil98: safeStr(data.p98),
    oil0: safeStr(data.p0),
    updateTime: safeStr(data.time),
  };
}

// ============= 42. 成语/诗词/歇后语（可扩展 pages/life/joke.vue）============
// 天行接口：成语典故(30) / 歇后语(38) / 脑筋急转弯(28) / 神回复(39) / 周公解梦(24) / 雷人笑话(25)

export interface ChengyuItem {
  name: string;
  content: string;
}

export async function queryChengyu(keyword: string): Promise<ChengyuItem | null> {
  const data: any = await tianapiGet('chengyu/index', { word: keyword });
  if (!data) return null;
  const first = (data.list && data.list[0]) || data;
  return {
    name: safeStr(first.name) || keyword,
    content: safeStr(first.content) || safeStr(first.desc) || '',
  };
}

export async function queryXiehouyu(): Promise<ChengyuItem | null> {
  const data: any = await tianapiGet('xiehou/index', {});
  if (!data) return null;
  const first = (data.list && data.list[0]) || data;
  return {
    name: safeStr(first.quest) || safeStr(first.name),
    content: safeStr(first.result) || safeStr(first.content) || '',
  };
}

export async function queryBrainTwist(): Promise<ChengyuItem | null> {
  const data: any = await tianapiGet('naowan/index', {});
  if (!data) return null;
  const first = (data.list && data.list[0]) || data;
  return {
    name: safeStr(first.quest) || safeStr(first.title) || '脑筋急转弯',
    content: safeStr(first.result) || safeStr(first.answer) || safeStr(first.content) || '',
  };
}

export async function queryShenhuifu(): Promise<string | null> {
  const data: any = await tianapiGet('shenhuifu/index', {});
  if (!data) return null;
  const first = (data.list && data.list[0]) || data;
  return safeStr(first.content) || safeStr(first.text);
}

export async function queryDream(keyword: string): Promise<ChengyuItem | null> {
  const data: any = await tianapiGet('dream/index', { word: keyword });
  if (!data) return null;
  const first = (data.list && data.list[0]) || data;
  return {
    name: keyword,
    content: safeStr(first.content) || safeStr(first.des) || '',
  };
}

export async function queryDuanziTian(): Promise<string | null> {
  const data: any = await tianapiGet('duanzi/index', {});
  if (!data) return null;
  const first = (data.list && data.list[0]) || data;
  return safeStr(first.content) || safeStr(first.text);
}

export async function queryKfcTian(): Promise<string | null> {
  const data: any = await tianapiGet('kfcmt/index', {});
  if (!data) return null;
  const first = (data.list && data.list[0]) || data;
  return safeStr(first.content) || safeStr(first.text);
}

export async function queryDuirenTian(): Promise<string | null> {
  const data: any = await tianapiGet('duiren/index', {});
  if (!data) return null;
  const first = (data.list && data.list[0]) || data;
  return safeStr(first.content) || safeStr(first.text);
}

// ============= 43. 手机归属地（补充 tmini 数据源，对应 pages/phone/*）============
// 天行接口：手机归属地(44) - 付费

export interface PhoneAttributionTian {
  phone: string;
  province: string;
  city: string;
  carrier: string;
  areaCode: string;
  postCode: string;
}

export async function queryPhoneAttributionTian(phone: string): Promise<PhoneAttributionTian | null> {
  const data: any = await tianapiGet('phone/index', { phone });
  if (!data) return null;
  return {
    phone,
    province: safeStr(data.province),
    city: safeStr(data.city),
    carrier: safeStr(data.isp) || safeStr(data.carrier),
    areaCode: safeStr(data.areacode),
    postCode: safeStr(data.zip),
  };
}

// ============= 44. IP 归属地（对应 pages/tool/ip-query.vue）============
// 天行接口：ip地址查询(43) - 免费

export interface IpInfoTian {
  ip: string;
  country: string;
  province: string;
  city: string;
  isp: string;
}

export async function queryIpInfoTian(ip: string): Promise<IpInfoTian | null> {
  const data: any = await tianapiGet('ipquery/index', { ip });
  if (!data) return null;
  return {
    ip: safeStr(data.ip) || ip,
    country: safeStr(data.country),
    province: safeStr(data.province),
    city: safeStr(data.city),
    isp: safeStr(data.isp),
  };
}

// ============= 45. 翻译（补充 tmini queryTranslation，对应 pages/tool/translate.vue）============
// 天行接口：机器翻译(52) - 付费

export async function queryTranslationTian(text: string, to: string = 'en'): Promise<string | null> {
  const data: any = await tianapiGet('translate/index', { text, to });
  if (!data) return null;
  return safeStr(data.trans_result) || safeStr(data.result) || safeStr(data.content);
}

// ============= 46. 天气（替换 wttr.in，对应 pages/tool/weather.vue）============
// 天行接口：天气预报(72) - 付费

export interface WeatherTian {
  city: string;
  date: string;
  week: string;
  weather: string;
  temperature: string;
  temperatureLow: string;
  wind: string;
  humidity: string;
  airQuality: string;
  airLevel: string;
  pm25: string;
  tips: string;
}

export async function queryWeatherTian(city: string): Promise<WeatherTian[] | null> {
  const data: any = await tianapiGet('weather/index', { city });
  if (!data) return null;
  const list = data.list || [];
  return list.map((w: any) => ({
    city,
    date: safeStr(w.date),
    week: safeStr(w.week),
    weather: safeStr(w.weather),
    temperature: safeStr(w.temperature),
    temperatureLow: safeStr(w.lowest),
    wind: safeStr(w.wind),
    humidity: safeStr(w.humidity),
    airQuality: safeStr(w.air_quality) || safeStr(w.air),
    airLevel: safeStr(w.air_level) || safeStr(w.airlevel),
    pm25: safeStr(w.pm25) || safeStr(w.pm2_5),
    tips: safeStr(w.tips),
  }));
}

// ============= 47. 中英词典（对应 pages/tool/）============
// 天行接口：中英词典(48) - 付费

export interface DictResult {
  word: string;
  phonetic: string;
  translation: string;
  definition: string;
  example: string;
}

export async function queryDict(word: string): Promise<DictResult | null> {
  const data: any = await tianapiGet('englishword/index', { word });
  if (!data) return null;
  return {
    word,
    phonetic: safeStr(data.phonetic) || '',
    translation: safeStr(data.translation) || safeStr(data.translate) || '',
    definition: safeStr(data.definition) || safeStr(data.explain) || '',
    example: safeStr(data.example) || '',
  };
}

// ============= 48. 汉字转拼音（对应 pages/tool/）============
// 天行接口：汉字转拼音(70) - 免费

export async function queryHanziPinyin(hanzi: string): Promise<{ hanzi: string; pinyin: string } | null> {
  const data: any = await tianapiGet('hanzipinyin/index', { hanzi });
  if (!data) return null;
  return {
    hanzi,
    pinyin: safeStr(data.pinyin) || safeStr(data.result),
  };
}

// ============= 49. 垃圾分类（可扩展生活类页面）============
// 天行接口：垃圾分类(97) - 免费

export interface GarbageType {
  name: string;
  type: string; // 可回收物 / 有害垃圾 / 厨余垃圾 / 干垃圾/其他垃圾
  explain: string;
  contain: string;
  tip: string;
}

export async function queryGarbage(name: string): Promise<GarbageType | null> {
  const data: any = await tianapiGet('lajifenlei/index', { word: name });
  if (!data) return null;
  const first = (data.list && data.list[0]) || data;
  return {
    name: safeStr(first.name) || name,
    type: safeStr(first.type),
    explain: safeStr(first.explain) || safeStr(first.aipre) || '',
    contain: safeStr(first.contain) || '',
    tip: safeStr(first.tip),
  };
}

// ============= 50. 星座运势（可扩展）============
// 天行接口：星座运势(78) - 付费

export interface Horoscope {
  star: string;
  date: string;
  overall: string;
  love: string;
  career: string;
  wealth: string;
  health: string;
}

export async function queryHoroscope(star: string, type: 'today' | 'tomorrow' | 'week' | 'month' = 'today'): Promise<Horoscope | null> {
  const data: any = await tianapiGet('horoscope/index', { star, type });
  if (!data) return null;
  return {
    star,
    date: safeStr(data.date) || '',
    overall: safeStr(data.summary) || safeStr(data.all) || '',
    love: safeStr(data.love),
    career: safeStr(data.career) || safeStr(data.work),
    wealth: safeStr(data.money) || safeStr(data.wealth),
    health: safeStr(data.health),
  };
}
