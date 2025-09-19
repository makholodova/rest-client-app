'use client';
import styles from './body-editor.module.scss';
import CodePanel from '@/components/ui/code-panel/code-panel';
import { useApiRequest } from '@/hooks/use-api-request';
import { useRestClientStore } from '@/store/restClient.store';
import { useState } from 'react';

export default function BodyEditor() {
  const [language, setLanguage] = useState('json');
  const { hasBody } = useApiRequest();

  const body = useRestClientStore((state) => state.body);
  const setBody = useRestClientStore((state) => state.setBody);

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <div>
        <select
          className={styles.selector}
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="json">json</option>
          <option value="text">text</option>
        </select>
      </div>

      <CodePanel
        text={body}
        setText={setBody}
        title="request body"
        language={language}
        isReadOnly={hasBody}
      />
    </div>
  );
}
