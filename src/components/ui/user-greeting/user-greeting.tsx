'use client';
import { useTranslations } from 'next-intl';
import styles from './user-greeting.module.scss';
import { ROUTES } from '@/constants/routes';
import ButtonLink from '@/components/ui/button-link/button-link';

type UserGreetingProp = {
  name?: string | null;
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
        <ButtonLink
          scaleOnHover={true}
          variant={'secondary'}
          href={ROUTES.REST_CLIENT}
        >
          {t('restClient')}
        </ButtonLink>
        <ButtonLink
          scaleOnHover={true}
          variant={'secondary'}
          href={ROUTES.HISTORY}
        >
          {t('history')}
        </ButtonLink>
        <ButtonLink
          scaleOnHover={true}
          variant={'secondary'}
          href={ROUTES.VARIABLES}
        >
          {t('variables')}
        </ButtonLink>
      </div>
    </section>
  );
}
