'use client';

import styles from './request-form.module.scss';
import { Method } from '@/types/postman.type';
import { METHOD_OPTIONS } from '@/constants/rest-client';
import { FieldInput } from '@/components/ui/field-input/field-input';
import Button from '@/components/ui/button/button';

import { useTranslations } from 'next-intl';
import { useApiRequest } from '@/hooks/use-api-request';
import { useState } from 'react';

export default function RequestForm() {
  const t = useTranslations('RestClient');
  const { method, url, setMethod, onSendRequest } = useApiRequest();

  const [currentUrl, setCurrentUrl] = useState(url);
  const isUrlEmpty = !currentUrl.trim();

  return (
    <div className={styles.wrapper}>
      <select
        name="method"
        className={styles.selector}
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
        className={styles.url}
        placeholder="https://api.example.com/resource"
        value={currentUrl}
        onChange={(e) => setCurrentUrl(e.target.value)}
      />
      <Button
        className={styles.sendBtn}
        disabled={isUrlEmpty}
        onClick={() => onSendRequest(currentUrl)}
      >
        {t('send')}
      </Button>
    </div>
  );
}
