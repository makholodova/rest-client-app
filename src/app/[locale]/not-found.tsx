import { getTranslations } from 'next-intl/server';
import ButtonLink from '@/components/ui/button-link/button-link';
import { ROUTES } from '@/constants/routes';
import styles from './not-found.module.scss';
import Page from '@/components/layout/page/page';

export default async function NotFound() {
  const t = await getTranslations('404');

  return (
    <Page centered>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={styles.text}>{t('description')}</p>
        <ButtonLink href={ROUTES.HOME}>{t('button')}</ButtonLink>
      </div>
    </Page>
  );
}
