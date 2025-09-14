import { useRestClientStore } from '@/store/restClient.store';

export function useHeaders() {
  const headers = useRestClientStore((s) => s.headers);
  const addHeader = useRestClientStore((s) => s.addHeader);
  const updateHeader = useRestClientStore((s) => s.updateHeader);
  const removeHeader = useRestClientStore((s) => s.removeHeader);
  const toggleHeader = useRestClientStore((s) => s.toggleHeader);
  return { headers, addHeader, updateHeader, removeHeader, toggleHeader };
}
