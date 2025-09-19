import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/firebase';
import { ROUTES } from '@/constants/routes';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/authUserContext';

interface UseAuthTokenGuardOptions {
  redirectTo?: string;
  skipAuthGuard?: boolean;
}

export function useAuthTokenGuard(options?: UseAuthTokenGuardOptions) {
  const router = useRouter();
  const authUser = useAuth().authUser;
  const t = useTranslations('ErrorsWarnings');
  const isTokenCheckingRef = useRef(false);

  const redirectTo = options?.redirectTo || ROUTES.HOME;
  const skipAuthGuard = options?.skipAuthGuard || false;

  const checkTokenValidity = useCallback(async () => {
    if (isTokenCheckingRef.current || skipAuthGuard) return;
    isTokenCheckingRef.current = true;
    try {
      const res = await fetch('/api/check-token', {
        method: 'GET',
      });
      if (!res.ok) toast.error(t('tokenCheckFailed'));
      const data = await res.json();
      if (!data.hasValidToken) {
        await logout();
        router.push(redirectTo);
        if (authUser) toast.error(t('sessionExpired'));
      }
    } catch (error) {
      toast.error(t(`tokenValidationError:`) + ` ${error}`);
      await logout();
      router.push(redirectTo);
      if (authUser) {
        toast.error(t('noAuthToken'));
      }
    } finally {
      isTokenCheckingRef.current = false;
    }
  }, [router, redirectTo, t, authUser, skipAuthGuard]);

  useEffect(() => {
    if (authUser === null && !isTokenCheckingRef.current && !skipAuthGuard) {
      router.push(redirectTo);
    }
  }, [authUser, router, redirectTo, skipAuthGuard]);

  useEffect(() => {
    if (skipAuthGuard) return;
    window.addEventListener('focus', checkTokenValidity);
    return () => window.removeEventListener('focus', checkTokenValidity);
  }, [checkTokenValidity, skipAuthGuard]);

  useEffect(() => {
    if (skipAuthGuard) return;
    const handleRouteChange = () => {
      setTimeout(() => {
        checkTokenValidity();
      }, 100);
    };
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [checkTokenValidity, skipAuthGuard]);

  useEffect(() => {
    if (!skipAuthGuard) {
      checkTokenValidity();
    }
  }, [checkTokenValidity, skipAuthGuard]);

  return {
    checkTokenValidity,
  };
}
