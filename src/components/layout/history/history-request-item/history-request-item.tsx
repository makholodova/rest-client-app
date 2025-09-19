import { useTranslations } from 'next-intl';

import Link from 'next/link';
import styles from './history-request-item.module.scss';
import { HistoryRequest } from '@/types/history.type';
import Image from 'next/image';
import { useApiRequest } from '@/hooks/use-api-request';
import { bytes, shortDate } from '@/utils/helpers';

type HistoryRequestItemProps = {
  request: HistoryRequest;
};

export default function HistoryRequestItem({
  request,
}: HistoryRequestItemProps) {
  const t = useTranslations('History');
  const { redirectToRequestPage } = useApiRequest();

  const push = (history: HistoryRequest) => {
    redirectToRequestPage(
      history.method,
      history.url,
      history.body ?? '',
      history.headers
    );
  };

  const ok =
    request.status !== null && request.status >= 200 && request.status < 400;
  return (
    <li className={styles.item} onClick={() => push(request)}>
      <Link
        href={{ pathname: '/client', query: { history: request.id } }}
        className={styles.link}
      >
        <div className={styles.main}>
          <time className={styles.time} dateTime={request.timestamp}>
            {shortDate(request.timestamp)}
          </time>
          <span className={styles.method} data-method={request.method}>
            {request.method}
          </span>
          <span className={ok ? styles.statusOk : styles.statusErr}>
            {request.status ?? '—'}
          </span>
          <span title={request.url} className={styles.url}>
            {request.url}
          </span>
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem} title={t('latency')}>
            {' '}
            <Image src="/time.svg" alt={t('timeAlt')} width={12} height={12} />
            {request.latency_ms} ms
          </span>
          <span className={styles.metaItem} title={t('reqSize')}>
            ↑ {bytes(request.req_size_bytes)}
          </span>
          <span className={styles.metaItem} title={t('resSize')}>
            ↓ {bytes(request.res_size_bytes)}
          </span>
          {request.error ? (
            <span
              className={styles.errBadge}
              title={request.error.message || request.error.type}
            >
              {request.error.type}
            </span>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
