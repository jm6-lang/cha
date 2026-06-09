import type { NumberLabel, QueryHistory } from './shucha';

const CARRIERS = ['中国移动', '中国联通', '中国电信'];
const PROVINCES = ['北京', '上海', '广东', '江苏', '浙江'];
const LABEL_NAMES = ['骚扰电话', '广告推销', '快递外卖', '诈骗电话', '房产中介'];
const SOURCES = ['腾讯手机管家', '360手机卫士', '百度手机卫士'];

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function generateLabel(number: string): NumberLabel {
  const seed = hashCode(number);
  const labelCount = seed % 5;
  const labels = Array.from({ length: labelCount }).map((_, i) => ({
    name: LABEL_NAMES[(seed + i) % LABEL_NAMES.length],
    source: SOURCES[(seed + i) % SOURCES.length],
    count: ((seed + i) % 200) + 1,
    riskLevel: ((seed + i) % 3) + 1
  }));
  return {
    number,
    province: PROVINCES[seed % PROVINCES.length],
    city: PROVINCES[seed % PROVINCES.length] + '市',
    carrier: CARRIERS[seed % CARRIERS.length],
    labels
  };
}

const MOCK_HISTORY: QueryHistory[] = [
  { id: 1, number: '13800138000', province: '北京', city: '北京市', carrier: '中国移动', labelCount: 3, createTime: '2026-06-09 10:00:00' },
  { id: 2, number: '02112345678', province: '上海', city: '上海市', carrier: '中国电信', labelCount: 1, createTime: '2026-06-09 09:30:00' },
  { id: 3, number: '4001234567', province: '广东', city: '深圳市', carrier: '中国联通', labelCount: 0, createTime: '2026-06-08 18:22:00' }
];

export async function handleMock(url: string, _data: any) {
  await new Promise((r) => setTimeout(r, 300));
  if (url.includes('/query/number-label')) {
    const query = url.split('?')[1] || '';
    const number = new URLSearchParams(query).get('number') || '';
    return { code: 0, message: 'ok', data: generateLabel(number) };
  }
  if (url.includes('/query/history')) {
    return { code: 0, message: 'ok', data: MOCK_HISTORY };
  }
  return { code: 404, message: 'mock not found', data: null };
}
