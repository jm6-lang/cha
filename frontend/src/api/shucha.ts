import { request } from './request';

export interface NumberLabel {
  number: string;
  province?: string;
  city?: string;
  carrier?: string;
  labels: Array<{
    name: string;
    source: string;
    count: number;
    riskLevel: number;
  }>;
}

export interface QueryHistory {
  id: number;
  number: string;
  province?: string;
  city?: string;
  carrier?: string;
  labelCount: number;
  createTime: string;
}

export interface Result<T> {
  code: number;
  message: string;
  data: T;
}

export const shuchaApi = {
  queryNumber(number: string, mock = false) {
    return request<NumberLabel>({
      url: `/query/number-label?number=${encodeURIComponent(number)}`,
      mock
    });
  },
  listHistory(limit = 20, mock = false) {
    return request<QueryHistory[]>({
      url: `/query/history?limit=${limit}`,
      mock
    });
  }
};
