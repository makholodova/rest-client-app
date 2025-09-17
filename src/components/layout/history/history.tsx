'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import HistoryRequestsList from '@/components/layout/history/history-request-list/history-request-list';
import styles from './history.module.scss';
import { useHistory } from '@/hooks/use-history';
import CircleLoader from '@/components/ui/circle-loader/circle-loader';
import { toast } from 'react-toastify';

export default function History() {
  const t = useTranslations('History');
  const { history, loading, error, loadHistory } = useHistory();

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{t('title')}</h2>
      {loading ? (
        <CircleLoader />
      ) : error ? (
        toast.error(error)
      ) : (
        <HistoryRequestsList requests={history} />
      )}
    </section>
  );
}
