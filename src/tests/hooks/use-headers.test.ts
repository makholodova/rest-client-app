import { renderHook } from '@testing-library/react';
import { useHeaders } from '@/hooks/use-headers';

const mockStore = {
  headers: [{ key: 'Content-Type', value: 'application/json', enabled: true }],
  addHeader: jest.fn(),
  updateHeader: jest.fn(),
  removeHeader: jest.fn(),
  toggleHeader: jest.fn(),
};

jest.mock('@/store/restClient.store', () => ({
  useRestClientStore: (sel) => sel(mockStore),
}));

describe('useHeaders', () => {
  it('returns headers from the store', () => {
    const { result } = renderHook(() => useHeaders());
    expect(result.current.headers).toEqual(mockStore.headers);
  });

  it('forwards addHeader', () => {
    const { result } = renderHook(() => useHeaders());
    result.current.addHeader({ key: 'X-Test', value: '1', enabled: true });
    expect(mockStore.addHeader).toHaveBeenCalledWith({
      key: 'X-Test',
      value: '1',
      enabled: true,
    });
  });

  it('forwards updateHeader', () => {
    const { result } = renderHook(() => useHeaders());
    result.current.updateHeader(0, {
      key: 'X-Test',
      value: '2',
      enabled: false,
    });
    expect(mockStore.updateHeader).toHaveBeenCalledWith(0, {
      key: 'X-Test',
      value: '2',
      enabled: false,
    });
  });

  it('forwards removeHeader', () => {
    const { result } = renderHook(() => useHeaders());
    result.current.removeHeader(0);
    expect(mockStore.removeHeader).toHaveBeenCalledWith(0);
  });

  it('forwards toggleHeader', () => {
    const { result } = renderHook(() => useHeaders());
    result.current.toggleHeader(1);
    expect(mockStore.toggleHeader).toHaveBeenCalledWith(1);
  });
});
