'use client';

import styles from './request-form.module.scss';
import { Method } from '@/types/postman.type';
import { METHOD_OPTIONS } from '@/constants/rest-client';
import { FieldInput } from '@/components/ui/field-input/field-input';
import Button from '@/components/ui/button/button';

import { useTranslations } from 'next-intl';
import { useApiRequest } from '@/hooks/use-api-request';
import { useMemo, useState } from 'react';
import { useRestClientStore } from '@/store/restClient.store';
import { getEnabledHeaders } from '@/utils/helpers';


export default function RequestForm() {
  const t = useTranslations('RestClient');
  const { method, handleMethodChange, onSendRequest } = useApiRequest();

  const [url, setUrl] = useState('');
  const isUrlEmpty = !url.trim();
  const headers = useRestClientStore((s) => s.headers);
  const enabledHeaders = useMemo(() => getEnabledHeaders(headers), [headers]);

  return (
    <div className={styles.wrapper}>
      <select
        name="method"
        className={styles.selector}
        value={method}
        onChange={(e) => handleMethodChange(e.target.value as Method)}
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
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button
        className={styles.sendBtn}
        disabled={isUrlEmpty}
        onClick={() => onSendRequest(url)}
      >
        {t('send')}
      </Button>
    </div>
  );
}
