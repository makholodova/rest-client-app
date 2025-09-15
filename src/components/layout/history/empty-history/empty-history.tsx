import styles from './empty-history.module.scss';
import ButtonLink from '@/components/ui/button-link/button-link';
import { ROUTES } from '@/constants/routes';
import { useTranslations } from 'next-intl';

export default function EmptyHistory() {
  const t = useTranslations('History');

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{t('noRequests')}</h3>
      <p className={styles.text}>{t('empty')}</p>
      <ButtonLink href={ROUTES.REST_CLIENT}>{t('restLink')}</ButtonLink>
    </div>
  );
}
