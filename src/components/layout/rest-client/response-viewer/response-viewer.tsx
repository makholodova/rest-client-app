import { decodeBase64 } from '@/utils/base64-encoding';
import CodePanel from '@/components/ui/code-panel/code-panel';
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

      const startedAt = Date.now();

      const response = await fetch(decode, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const endedAt = Date.now();

      const latency = endedAt - startedAt;

      const text = await response.text();

      try {
        await fetch('/api/history/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method,
            url: decode,
            headers: { 'Content-Type': 'application/json' },
            body: null,
            status: response.status,
            latency_ms: latency,
            req_size_bytes: 0,
            res_size_bytes: new TextEncoder().encode(text).length,
            error: response.ok
              ? null
              : { type: 'http', message: String(response.status) },
            timestamp: new Date().toISOString(),
          }),
        });
      } catch {}

      return [text, response.status];
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
