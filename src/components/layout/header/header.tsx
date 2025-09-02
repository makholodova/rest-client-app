import styles from './header.module.scss';
import Logo from '@/components/ui/logo/logo';
import Link from 'next/link';
import {ROUTES} from "@/routes";
import {useTranslations} from "next-intl";

export default function Header() {
    const t = useTranslations('Header');

  return (
    <header className={styles.header}>
      <Logo />
        <div className={styles.nav}>
            <Link className={`${styles.navLink} ${styles.signIn}`} href={ROUTES.SIGN_IN}>{t('sign-in')}</Link>
            <Link className={`${styles.navLink} ${styles.signUp}`} href={ROUTES.SIGN_UP}>{t('sign-up')}</Link>
        </div>
    </header>
  );
}
