import styles from './history-request-list.module.scss';
import HistoryRequestItem from '@/components/layout/history/history-request-item/history-request-item';
import EmptyHistory from '@/components/layout/history/empty-history/empty-history';
import { HistoryRequest } from '@/types/history.type';

type HistoryRequestsListProps = {
  requests: HistoryRequest[];
};
export default function HistoryRequestsList({
  requests,
}: HistoryRequestsListProps) {
  const sortedRequests = [...(requests || [])].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return (
    <div>
      {!requests?.length ? (
        <EmptyHistory />
      ) : (
        <ul className={styles.list}>
          {sortedRequests.map((request) => (
            <HistoryRequestItem key={request.id} request={request} />
          ))}
        </ul>
      )}
    </div>
  );
}
