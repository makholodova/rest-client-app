import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/firebase';
import { ROUTES } from '@/constants/routes';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

interface UseAuthTokenGuardOptions {
  redirectTo?: string;
  intervalMs?: number;
}

export function useAuthTokenGuard(options?: UseAuthTokenGuardOptions) {
  const router = useRouter();
  const { redirectTo = ROUTES.HOME, intervalMs = 20000 } = options || {};
  const t = useTranslations('ErrorsWarnings');

  useEffect(() => {
    let active = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/check-token');
        const data = await res.json();
        if (!data.hasToken && active) {
          await logout();
          router.push(redirectTo);
        }
      } catch {
        if (active) {
          toast.error(t('noAuthToken'));
          await logout();
          router.push(redirectTo);
        }
      }
    }, intervalMs);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [router, redirectTo, intervalMs, t]);
}
