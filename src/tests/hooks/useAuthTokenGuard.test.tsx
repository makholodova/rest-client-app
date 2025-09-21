import { renderHook, act } from '@testing-library/react';
import { useAuthTokenGuard } from '@/hooks/useAuthTokenGuard';
import { useRouter } from 'next/navigation';
import { logout } from '@/firebase';
import { ROUTES } from '@/constants/routes';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/firebase', () => ({
  logout: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock('@/context/authUserContext', () => ({
  useAuth: jest.fn(),
}));

describe('useAuthTokenGuard', () => {
  const push = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls checkTokenValidity on mount', async () => {
    require('@/context/authUserContext').useAuth.mockReturnValue({
      authUser: { uid: '123' },
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ hasValidToken: true }),
    });
    renderHook(() => useAuthTokenGuard());
    await act(async () => {});
    expect(global.fetch).toHaveBeenCalledWith('/api/check-token', {
      method: 'GET',
      credentials: 'include',
    });
  });

  it('redirects to home if authUser is null', () => {
    require('@/context/authUserContext').useAuth.mockReturnValue({
      authUser: null,
    });
    renderHook(() => useAuthTokenGuard());
    expect(push).toHaveBeenCalledWith(ROUTES.HOME);
  });

  it('calls logout and redirects if token is invalid', async () => {
    require('@/context/authUserContext').useAuth.mockReturnValue({
      authUser: { uid: '123' },
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ hasValidToken: false }),
    });
    const { result } = renderHook(() => useAuthTokenGuard());
    await act(async () => {
      await result.current.checkTokenValidity();
    });
    expect(logout).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith(ROUTES.HOME);
  });

  it('shows error and redirects if fetch fails', async () => {
    require('@/context/authUserContext').useAuth.mockReturnValue({
      authUser: { uid: '123' },
    });
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useAuthTokenGuard());
    await act(async () => {
      await result.current.checkTokenValidity();
    });
    expect(logout).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith(ROUTES.HOME);
    expect(require('react-toastify').toast.error).toHaveBeenCalled();
  });

  it('does nothing if skipAuthGuard is true', async () => {
    require('@/context/authUserContext').useAuth.mockReturnValue({
      authUser: null,
    });
    renderHook(() => useAuthTokenGuard({ skipAuthGuard: true }));
    expect(push).not.toHaveBeenCalled();
    expect(logout).not.toHaveBeenCalled();
  });

  it('dont call checkTokenValidity when skipAuthGuard is true', async () => {
    require('@/context/authUserContext').useAuth.mockReturnValue({
      authUser: { uid: '123' },
    });
    const { result } = renderHook(() =>
      useAuthTokenGuard({ skipAuthGuard: true })
    );
    await act(async () => {
      await result.current.checkTokenValidity();
    });
    expect(logout).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });
});
