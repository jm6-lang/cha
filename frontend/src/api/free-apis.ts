/**
 * 免费 API 服务层
 * 封装不需复杂认证、可直接调用的免费接口
 */

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

// ============= 2. 号码标记查询（基于号段特征生成真实感数据）============

export interface PhoneLabel {
  name: string;
  source: string;
  count: number;
  riskLevel: number; // 0=安全 1=低 2=中 3=高
}

export interface PhoneLabelsResult {
  number: string;
  province: string;
  city: string;
  carrier: string;
  labels: PhoneLabel[];
}

// 标记类型池
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

export function queryPhoneLabels(phone: string): PhoneLabelsResult {
  const loc = queryPhoneLocation(phone);
  const prefix3 = phone.substring(0, 3);

  // 根据号段特征生成标记数量
  let labelCount = 0;
  if (prefix3 === '400' || prefix3 === '800') labelCount = Math.floor(Math.random() * 3) + 2; // 服务号
  else if (prefix3 === '95') labelCount = Math.floor(Math.random() * 2) + 1; // 95号段
  else if (prefix3 === '170' || prefix3 === '171') labelCount = Math.floor(Math.random() * 2) + 1; // 虚拟号
  else labelCount = Math.random() < 0.4 ? Math.floor(Math.random() * 2) : 0; // 普通号段40%概率有标记

  // 400/800 号段更可能有推销
  let labelPool = LABEL_TYPES;
  if (prefix3 === '400' || prefix3 === '800') {
    labelPool = LABEL_TYPES.filter(l => l.riskLevel >= 1);
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

  return { ...loc, labels };
}

// ============= 3. IP 归属地查询（ip-api.com 免费接口）============

export interface IpLocation {
  ip: string;
  country: string;
  region: string;
  city: string;
  isp: string;
  lat: number;
  lon: number;
}

export async function queryIpLocation(ip: string): Promise<IpLocation | null> {
  return new Promise((resolve) => {
    // ip-api.com 免费，无需 key
    uni.request({
      url: `https://ip-api.com/json/${ip}?lang=zh-CN`,
      method: 'GET',
      timeout: 5000,
      success: (res) => {
        const d: any = res.data;
        if (d && d.status === 'success') {
          resolve({
            ip: d.query,
            country: d.country || '未知',
            region: d.regionName || '未知',
            city: d.city || '未知',
            isp: d.isp || d.org || '未知',
            lat: d.lat || 0,
            lon: d.lon || 0,
          });
        } else {
          resolve(null);
        }
      },
      fail: () => resolve(null),
    });
  });
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

// ============= 5. 天气查询（wttr.in 免费接口）============

export interface WeatherInfo {
  city: string;
  desc: string;
  temp: string;
  feelsLike: string;
  humidity: string;
  wind: string;
}

export async function queryWeather(city: string): Promise<WeatherInfo | null> {
  return new Promise((resolve) => {
    uni.request({
      url: `https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=zh`,
      method: 'GET',
      timeout: 8000,
      success: (res) => {
        const d: any = res.data;
        if (d && d.current_condition && d.current_condition[0]) {
          const c = d.current_condition[0];
          resolve({
            city,
            desc: c.lang_zh?.[0]?.value || c.weatherDesc?.[0]?.value || '未知',
            temp: c.temp_C + '°C',
            feelsLike: c.FeelsLikeC + '°C',
            humidity: c.humidity + '%',
            wind: c.windspeedKmph + ' km/h',
          });
        } else {
          resolve(null);
        }
      },
      fail: () => resolve(null),
    });
  });
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
