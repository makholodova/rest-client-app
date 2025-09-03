'use client';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import styles from './guest-greeting.module.scss';
import { useTranslations } from 'next-intl';

export default function GuestGreeting() {
  const t = useTranslations('GuestGreeting');
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{t('title')}!</h2>
      <p className={styles.text}>
        {t('text')}
        {' — '}
        <Link className={styles.link} href={ROUTES.SIGN_IN}>
          {t('sign-in')}
        </Link>{' '}
        {t('or')}{' '}
        <Link className={styles.link} href={ROUTES.SIGN_UP}>
          {t('sign-up')}
        </Link>
      </p>
    </div>
  );
}
