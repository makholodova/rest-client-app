import CodePanel from '@/components/ui/code-panel/code-panel';
import styles from './response-viewer.module.scss';
import { fetchApi } from '@/utils/rest-client-api';

type ResponseViewerProps = {
  data?: string[];
  headers: { [key: string]: string } | null;
};

export default async function ResponseViewer({
  data,
  headers,
}: ResponseViewerProps) {
  const { content, status } = await fetchApi(data ? data : [], headers);

  return (
    <div className={styles.wrapper}>
      {content && (
        <CodePanel text={content} title={`body | ${status}`} isReadOnly />
      )}
    </div>
  );
}
