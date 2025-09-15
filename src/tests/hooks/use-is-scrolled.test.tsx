import { renderHook, act } from '@testing-library/react';
import { useIsScrolled } from '@/hooks/use-is-scrolled';

describe('useIsScrolled', () => {
  beforeEach(() => {
    window.scrollY = 0;
    jest.clearAllMocks();
  });

  it('should return false initially', () => {
    const { result } = renderHook(() => useIsScrolled());
    expect(result.current).toBe(false);
  });

  it('should return true when scrollY > 60', () => {
    const { result } = renderHook(() => useIsScrolled());

    act(() => {
      window.scrollY = 65;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(true);
  });

  it('should return  false when scrollY <= 60', () => {
    const { result } = renderHook(() => useIsScrolled());

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe(true);

    act(() => {
      window.scrollY = 0;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe(false);
  });
});
