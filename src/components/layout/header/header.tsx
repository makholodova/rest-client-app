'use client';

import styles from './header.module.scss';
import Logo from '@/components/ui/logo/logo';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/language-switcher/language-switcher';
import { useIsScrolled } from '@/hooks/useIsScrolled';

export default function Header() {
  const isScrolled = useIsScrolled();
  const t = useTranslations('Header');

  return (
    <header className={`${styles.header} ${isScrolled && styles.sticky}`}>
      <div className={`${styles.headerWrapper} container`}>
        <Logo />
        <div className={styles.nav}>
          <LanguageSwitcher />
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
        </div>
      </div>
    </header>
  );
}
