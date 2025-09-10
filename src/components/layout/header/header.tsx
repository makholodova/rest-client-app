'use client';

import styles from './header.module.scss';
import Logo from '@/components/ui/logo/logo';
import { ROUTES } from '@/constants/routes';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/language-switcher/language-switcher';
import { useIsScrolled } from '@/hooks/useIsScrolled';
import ButtonLink from '@/components/ui/button-link/button-link';
import Button from '@/components/ui/button/button';
import { logout } from '../../../firebase';
import { useAuth } from '@/context/authUserContext';

export default function Header() {
  const isScrolled = useIsScrolled();
  const t = useTranslations('Header');
  const { authUser } = useAuth();

  return (
    <header className={`${styles.header} ${isScrolled && styles.sticky}`}>
      <div className={`${styles.headerWrapper} container`}>
        <Logo />
        <div className={styles.nav}>
          <LanguageSwitcher />

          {authUser ? (
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
