'use client';
import styles from './body-editor.module.scss';
import CodePanel from '@/components/ui/code-panel/code-panel';
import { useApiRequest } from '@/hooks/use-api-request';
import { useRestClientStore } from '@/store/restClient.store';

export default function BodyEditor() {
  const { hasBody } = useApiRequest();

  const body = useRestClientStore((state) => state.body);
  const setBody = useRestClientStore((state) => state.setBody);

  return (
    <div className={styles.wrapper}>
      <CodePanel
        text={body}
        setText={setBody}
        title="body"
        isReadOnly={hasBody}
      />
    </div>
  );
}
