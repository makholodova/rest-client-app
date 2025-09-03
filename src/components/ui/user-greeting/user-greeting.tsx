'use client';
import { useTranslations } from 'next-intl';
import styles from './user-greeting.module.scss';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

type UserGreetingProp = {
  name?: string;
};

export default function UserGreeting({ name }: UserGreetingProp) {
  const t = useTranslations('UserGreeting');

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>
        {t('title')}
        {name ? `, ${name}` : ''}!
      </h2>
      <p className={styles.text}>{t('text')}.</p>
      <div className={styles.links}>
        <Link className={styles.link} href={ROUTES.REST_CLIENT}>
          {t('restClient')}
        </Link>{' '}
        <Link className={styles.link} href={ROUTES.HISTORY}>
          {t('history')}
        </Link>
        <Link className={styles.link} href={ROUTES.VARIABLES}>
          {t('variables')}
        </Link>
      </div>
    </section>
  );
}
