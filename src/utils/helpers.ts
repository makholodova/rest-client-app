import { HeaderRequest } from '@/types/postman.type';

export function parseJSON<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const getEnabledHeaders = (headers: HeaderRequest[]) =>
  (headers ?? []).filter((h) => !h.disabled && h.key.trim() !== '');
