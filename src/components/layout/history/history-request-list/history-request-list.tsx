import styles from './history-request-list.module.scss';
import HistoryRequestItem from '@/components/layout/history/history-request-item/history-request-item';
import EmptyHistory from '@/components/layout/history/empty-history/empty-history';
import { HistoryRequest } from '@/types/history.type';
import CircleLoader from '@/components/ui/circle-loader/circle-loader';

type HistoryRequestsListProps = {
  requests: HistoryRequest[];
  loading: boolean;
  authLoading: boolean;
};
export default function HistoryRequestsList({
  requests,
  loading,
  authLoading,
}: HistoryRequestsListProps) {
  if (loading || authLoading) {
    return <CircleLoader />;
  }
  if (!requests.length) {
    return <EmptyHistory />;
  }
  const sortedRequests = [...requests].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return (
    <div>
      <ul className={styles.list}>
        {sortedRequests.map((request) => (
          <HistoryRequestItem key={request.id} request={request} />
        ))}
      </ul>
    </div>
  );
}
