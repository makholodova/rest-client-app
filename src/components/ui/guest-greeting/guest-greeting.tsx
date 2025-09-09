'use client';
import { ROUTES } from '@/constants/routes';
import styles from './guest-greeting.module.scss';
import { useTranslations } from 'next-intl';
import AppLink from '@/components/ui/app-link/app-link';

export default function GuestGreeting() {
  const t = useTranslations('GuestGreeting');
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{t('title')}!</h2>
      <p className={styles.text}>
        {t('text')}
        {' — '}
        <AppLink href={ROUTES.SIGN_IN}>{t('sign-in')}</AppLink> {t('or')}{' '}
        <AppLink href={ROUTES.SIGN_UP}>{t('sign-up')}</AppLink>
      </p>
    </section>
  );
}
