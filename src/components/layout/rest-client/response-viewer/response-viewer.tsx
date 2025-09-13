import { decodeBase64 } from '@/utils/base64-encoding';
import CodePanel from '../../code-panel/code-panel';
import styles from './response-viewer.module.scss';

export default async function ResponseViewer({ data }: { data?: string[] }) {
  const getBody = async (): Promise<[string, number]> => {
    try {
      const method = data?.[0] || 'GET';
      const encodedUrl = data?.[1] as string;

      if (!encodedUrl) {
        return ['Enter url..', 404];
      }

      const decode = decodeBase64(encodedUrl);

      const response = await fetch(decode, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return ['{error}', 500];
      }

      return [await response.text(), response.status];
    } catch {
      return ['{error}', 500];
    }
  };

  const [formattedText, status] = await getBody();

  return (
    <div className={styles.wrapper}>
      {formattedText && (
        <CodePanel text={formattedText} title={`body | ${status}`} isReadOnly />
      )}
    </div>
  );
}
