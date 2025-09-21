import { create } from 'zustand';
import { HeaderRequest } from '@/types/postman.type';

type RestClientState = {
  body: string;
  headers: HeaderRequest[];
};

type RestClientActions = {
  setBody: (v: string) => void;
  setHeaders: (
    next: HeaderRequest[] | ((prev: HeaderRequest[]) => HeaderRequest[])
  ) => void;

  initHeaders: (v: Record<string, string>) => void;
  addHeader: () => void;
  updateHeader: <K extends keyof HeaderRequest>(
    index: number,
    field: K,
    value: HeaderRequest[K]
  ) => void;
  removeHeader: (index: number) => void;
  toggleHeader: (index: number) => void;
};

const initial: RestClientState = {
  body: '',
  headers: [],
};

export const useRestClientStore = create<RestClientState & RestClientActions>()(
  (set) => ({
    ...initial,
    setBody: (body) => set({ body }),
    setHeaders: (next) =>
      set((s) => ({
        headers: typeof next === 'function' ? next(s.headers) : next,
      })),

    initHeaders: (headersRecord) =>
      set(() => ({
        headers: Object.entries(headersRecord).map(([key, value]) => ({
          key,
          value,
          description: '',
          disabled: false,
        })),
      })),

    addHeader: () =>
      set((s) => ({
        headers: [
          ...s.headers,
          {
            key: '',
            value: '',
            description: '',
            disabled: false,
          } as HeaderRequest,
        ],
      })),

    updateHeader: (index, field, value) =>
      set((s) => {
        const headers = [...s.headers];
        headers[index] = { ...headers[index], [field]: value } as HeaderRequest;
        return { headers };
      }),

    removeHeader: (index) =>
      set((s) => ({ headers: s.headers.filter((_, i) => i !== index) })),

    toggleHeader: (index) =>
      set((s) => {
        const headers = [...s.headers];
        headers[index] = {
          ...headers[index],
          disabled: !headers[index]?.disabled,
        } as HeaderRequest;
        return { headers };
      }),
  })
);
