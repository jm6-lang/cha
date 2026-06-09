import type { Result } from './shucha';

const BASE_URL = '/api';

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  mock?: boolean;
}

export function request<T = any>(options: RequestOptions): Promise<Result<T>> {
  if (options.mock) {
    return import('./mock').then((m) => m.handleMock(options.url, options.data));
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: { 'Content-Type': 'application/json', ...options.header },
      success: (res) => {
        const body = res.data as Result<T>;
        if (body.code === 0) {
          resolve(body);
        } else {
          uni.showToast({ title: body.message || '请求失败', icon: 'none' });
          reject(body);
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络错误', icon: 'none' });
        reject(err);
      }
    });
  });
}
