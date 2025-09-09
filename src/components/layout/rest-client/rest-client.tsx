'use client';

import styles from './rest-client.module.scss';
import { useState } from 'react';
import { Method } from '@/types/postman.type';
import { METHOD_OPTIONS } from '@/constants/rest-client';
import { FieldInput } from '@/components/ui/field-input/field-input';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/button/button';
import { Tabs } from '@/components/ui/tabs/tabs';

import Headers from '@/components/layout/rest-client/tabs/headers/headers';
import ResponseViewer from '@/components/layout/rest-client/response-viewer/response-viewer';
import BodyEditor from '@/components/layout/rest-client/tabs/body-editor/body-editor';
import CodeGenerator from '@/components/layout/rest-client/tabs/code-generator/code-generator';

export default function RestClient() {
  const t = useTranslations('RestClient');

  const tabs = [
    { label: t('headers'), content: <Headers /> },
    { label: t('body'), content: <BodyEditor /> },
    { label: t('code'), content: <CodeGenerator /> },
  ];

  const [method, setMethod] = useState<Method>('GET');
  const [url, setUrl] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: отправка запроса
  };

  return (
    <div className={styles.wrapper}>
      <h2>RestClient</h2>
      <form className={styles.content} onSubmit={onSubmit}>
        <select
          className={styles.method}
          value={method}
          onChange={(e) => setMethod(e.target.value as Method)}
        >
          {METHOD_OPTIONS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>

        <FieldInput
          placeholder="https://api.example.com/resource"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button type={'submit'}>{t('send')}</Button>
      </form>
      <Tabs tabs={tabs} />
      <ResponseViewer />
    </div>
  );
}
