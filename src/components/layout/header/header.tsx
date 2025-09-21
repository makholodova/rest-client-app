'use client';

import styles from './header.module.scss';
import Logo from '@/components/ui/logo/logo';
import { ROUTES } from '@/constants/routes';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/language-switcher/language-switcher';
import { useIsScrolled } from '@/hooks/use-is-scrolled';
import ButtonLink from '@/components/ui/button-link/button-link';
import Button from '@/components/ui/button/button';
import { logout, auth } from '@/firebase';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

export default function Header() {
  const isScrolled = useIsScrolled();
  const t = useTranslations('Header');
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogOut = async () => {
    logout();
    router.push(ROUTES.HOME);
  };

  if (isLoading) {
    <header className={clsx(styles.header, { [styles.sticky]: isScrolled })}>
      <div className={`${styles.headerWrapper} container`}>
        <Logo />
        <div className={styles.nav}>
          <LanguageSwitcher />
        </div>
      </div>
    </header>;
  }

  return (
    <header className={clsx(styles.header, { [styles.sticky]: isScrolled })}>
      <div className={`${styles.headerWrapper} container`}>
        <Logo />
        <div className={styles.nav}>
          <LanguageSwitcher />

          {user ? (
            <>
              <ButtonLink className={styles.navLink} href={ROUTES.HOME}>
                {t('main')}
              </ButtonLink>
              <Button
                variant={'secondary'}
                className={styles.navLink}
                onClick={handleLogOut}
              >
                {t('sign-out')}
              </Button>
            </>
          ) : (
            <>
              <ButtonLink
                className={styles.navLink}
                variant={'secondary'}
                href={ROUTES.SIGN_IN}
              >
                {t('sign-in')}
              </ButtonLink>
              <ButtonLink className={styles.navLink} href={ROUTES.SIGN_UP}>
                {t('sign-up')}
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
