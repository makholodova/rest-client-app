import { useTranslations } from 'next-intl';
import { HistoryRequest } from '@/types/history.type';
import HistoryRequestsList from '@/components/layout/history/history-request-list/history-request-list';
import styles from './history.module.scss';

export default function History() {
  const t = useTranslations('History');

  // Моки — замень реальными данными
  const mockRequests: HistoryRequest[] = [
    {
      id: '1',
      method: 'GET',
      url: 'https://api.example.com/resource/1',
      status: 200,
      latency_ms: 114,
      timestamp: new Date().toISOString(),
      req_size_bytes: 312,
      res_size_bytes: 8192,
      error: null,
    },
    {
      id: '2',
      method: 'POST',
      url: 'https://api.example.com/resource',
      status: 201,
      latency_ms: 240,
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      req_size_bytes: 1024,
      res_size_bytes: 2048,
      error: null,
    },
    {
      id: '3',
      method: 'GET',
      url: 'https://api.example.com/slow',
      status: 504,
      latency_ms: 2200,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      req_size_bytes: 120,
      res_size_bytes: 0,
      error: { type: 'timeout', message: 'Gateway Timeout' },
    },
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{t('title')}</h2>
      <HistoryRequestsList requests={mockRequests} />
    </section>
  );
}
