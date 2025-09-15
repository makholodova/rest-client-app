import { Method } from '@/types/postman.type';

export type HistoryRequest = {
  id: string;
  method: Method;
  url: string;
  status: number | null;
  latency_ms: number;
  timestamp: string;
  req_size_bytes: number;
  res_size_bytes: number;
  error?: { type: string; message?: string } | null;
};
