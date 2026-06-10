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
