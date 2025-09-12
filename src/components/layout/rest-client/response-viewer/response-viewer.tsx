import { decodeBase64 } from '@/utils/base64-encoding';
import CodePanel from '../../code-panel/code-panel';
import styles from './response-viewer.module.scss';

export default async function ResponseViewer({ data }: { data?: string[] }) {
  const getBody = async () => {
    const method = data?.[0] || 'GET';
    const encodedUrl = data?.[1] as string;

    if (!encodedUrl) {
      return 'Enter url..';
    }

    const decode = decodeBase64(encodedUrl);
    console.log(decode);

    const response = await fetch(decode, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return 'error!';
    }

    return await response.text();
  };

  const formattedText: string = await getBody();

  return (
    <div className={styles.wrapper}>
      {formattedText && (
        <CodePanel initText={formattedText} title="body" isReadOnly />
      )}
    </div>
  );
}
