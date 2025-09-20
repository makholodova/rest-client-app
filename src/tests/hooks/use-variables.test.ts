import { renderHook, act, waitFor } from '@testing-library/react';
import { useVariables } from '@/hooks/use-variables';

beforeEach(() => {
  localStorage.clear();
});

describe('useVariables', () => {
  it('initializes from localStorage (empty by default)', () => {
    const { result } = renderHook(() => useVariables());
    expect(result.current.variables).toEqual({});
    expect(result.current.has).toBe(false);
  });

  it('adds a variable and persists it', () => {
    const { result } = renderHook(() => useVariables());

    act(() => {
      const ok = result.current.add(' token ', '123');
      expect(ok).toBe(true);
    });

    expect(result.current.variables).toEqual({ token: '123' });
    expect(localStorage.getItem('variables')).toContain('"token":"123"');
    expect(result.current.has).toBe(true);
    expect(result.current.get('token')).toBe('123');
  });

  it('does not add if key is empty after trim', () => {
    const { result } = renderHook(() => useVariables());
    act(() => {
      const ok = result.current.add('   ', 'value');
      expect(ok).toBe(false);
    });
    expect(result.current.variables).toEqual({});
  });

  it('removes a variable', async () => {
    const { result } = renderHook(() => useVariables());

    act(() => {
      result.current.add('foo', 'bar');
    });
    expect(result.current.variables.foo).toBe('bar');

    act(() => {
      result.current.remove('foo');
    });

    await waitFor(() => {
      expect(result.current.variables).toEqual({});
    });

    expect(localStorage.getItem('variables')).toBe('{}');
  });

  it('remove returns false if key not found', () => {
    const { result } = renderHook(() => useVariables());
    act(() => {
      const removed = result.current.remove('nope');
      expect(removed).toBe(false);
    });
  });

  it('clears all variables', () => {
    const { result } = renderHook(() => useVariables());
    act(() => {
      result.current.add('foo', 'bar');
    });
    expect(result.current.variables).toEqual({ foo: 'bar' });

    act(() => {
      result.current.clear();
    });

    expect(result.current.variables).toEqual({});
    expect(localStorage.getItem('variables')).toBeNull();
    expect(result.current.has).toBe(false);
  });
});
