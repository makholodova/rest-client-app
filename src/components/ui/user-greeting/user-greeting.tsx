'use client';
import { useTranslations } from 'next-intl';
import styles from './user-greeting.module.scss';

type UserGreetingProp = {
  name?: string;
};

export default function UserGreeting({ name }: UserGreetingProp) {
  const t = useTranslations('UserGreeting');

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>
        {t('title')}
        {name ? `, ${name}` : ''}!
      </h2>
      <p className={styles.text}>{t('text')}.</p>
    </div>
  );
}
