'use client';

import styles from './header.module.scss';
import Logo from '@/components/ui/logo/logo';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/language-switcher/language-switcher';
import { useIsScrolled } from '@/hooks/useIsScrolled';
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
            <>
              <Link
                className={`${styles.navLink} ${styles.signIn}`}
                href={ROUTES.SIGN_IN}
              >
                {t('sign-in')}
              </Link>
              <Link
                className={`${styles.navLink} ${styles.signUp}`}
                href={ROUTES.SIGN_UP}
              >
                {t('sign-up')}
              </Link>
            </>
          ) : (
            <button className={styles.signOut} onClick={logout}>
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
