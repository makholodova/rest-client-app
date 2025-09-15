'use client';

import styles from './header.module.scss';
import Logo from '@/components/ui/logo/logo';
import { ROUTES } from '@/constants/routes';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/language-switcher/language-switcher';
import { useIsScrolled } from '@/hooks/use-is-scrolled';
import ButtonLink from '@/components/ui/button-link/button-link';
import Button from '@/components/ui/button/button';
import { logout, auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import clsx from 'clsx';

export default function Header() {
  const isScrolled = useIsScrolled();
  const t = useTranslations('Header');
  const [user] = useAuthState(auth);

  return (
    <header className={clsx(styles.header, { [styles.sticky]: isScrolled })}>
      <div className={`${styles.headerWrapper} container`}>
        <Logo />
        <div className={styles.nav}>
          <LanguageSwitcher />

          {user ? (
            <Button
              variant={'secondary'}
              className={styles.navLink}
              onClick={logout}
            >
              {t('sign-out')}
            </Button>
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
