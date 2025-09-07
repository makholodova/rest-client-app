'use client';

import styles from './header.module.scss';
import Logo from '@/components/ui/logo/logo';
import { ROUTES } from '@/constants/routes';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/language-switcher/language-switcher';
import { useIsScrolled } from '@/hooks/useIsScrolled';
import ButtonLink from '@/components/ui/button-link/button-link';
import Button from '@/components/ui/button/button';
import { logout, auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Header() {
  const isScrolled = useIsScrolled();
  const t = useTranslations('Header');
  const [user] = useAuthState(auth);

  return (
    <header className={`${styles.header} ${isScrolled && styles.sticky}`}>
      <div className={`${styles.headerWrapper} container`}>
        <Logo />
        <div className={styles.nav}>
          <LanguageSwitcher />
          {!user ? (
            <ButtonLink
              className={styles.navLink}
              variant={'secondary'}
              href={ROUTES.SIGN_IN}
            >
              {t('sign-in')}
            </ButtonLink>
          ) : null}
          {!user ? (
            <ButtonLink className={styles.navLink} href={ROUTES.SIGN_UP}>
              {t('sign-up')}
            </ButtonLink>
          ) : null}
          {user ? (
            <Button className={styles.navLink} onClick={logout}>
              {t('sign-out')}
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
