import Link from 'next/link';
import styles from './history-request-item.module.scss';
import { HistoryRequest } from '@/types/history.type';

function bytes(n: number) {
  if (n < 1024) return `${n} B`;
  const kb = n / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}
function shortDate(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

type HistoryRequestItemProps = {
  request: HistoryRequest;
};

export default function HistoryRequestItem({
  request,
}: HistoryRequestItemProps) {
  const ok =
    request.status !== null && request.status >= 200 && request.status < 400;
  return (
    <li className={styles.item}>
      <Link
        href={{ pathname: '/client', query: { history: request.id } }}
        className={styles.row}
        title={request.url}
      >
        <div className={styles.left}>
          <span className={styles.method} data-method={request.method}>
            {request.method}
          </span>
          <span className={styles.url}>{request.url}</span>
        </div>

        <div className={styles.meta}>
          <span className={ok ? styles.statusOk : styles.statusErr}>
            {request.status ?? '—'}
          </span>
          <span className={styles.kv}>{request.latency_ms} ms</span>
          <span className={styles.kv}>{bytes(request.req_size_bytes)}</span>
          <span className={styles.kv}>{bytes(request.res_size_bytes)}</span>
          <time className={styles.time} dateTime={request.timestamp}>
            {shortDate(request.timestamp)}
          </time>
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
