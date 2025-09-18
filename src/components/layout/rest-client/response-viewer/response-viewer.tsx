'use client';

import { useEffect, useState, useRef } from 'react';
import { decodeBase64 } from '@/utils/base64-encoding';
import CodePanel from '@/components/ui/code-panel/code-panel';
import styles from './response-viewer.module.scss';

export default function ResponseViewer({ data }: { data?: string[] }) {
  const [responseText, setResponseText] = useState<string>('');
  const [status, setStatus] = useState<number>(0);
  const hasSentHistory = useRef(false);

  useEffect(() => {
    const getBody = async () => {
      try {
        const method = data?.[0] || 'GET';
        const encodedUrl = data?.[1] as string;

        if (!encodedUrl) {
          setResponseText('Enter url..');
          setStatus(404);
          return;
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
        setResponseText(text);
        setStatus(response.status);

        if (!hasSentHistory.current) {
          hasSentHistory.current = true;
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
        }
      } catch {
        setResponseText('Error response');
        setStatus(500);
      }
    };
    getBody();
  }, [data]);

  return (
    <div className={styles.wrapper}>
      {responseText && (
        <CodePanel text={responseText} title={`body | ${status}`} isReadOnly />
      )}
    </div>
  );
}
