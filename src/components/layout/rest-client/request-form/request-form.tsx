'use client';

import styles from './request-form.module.scss';
import { Method } from '@/types/postman.type';
import { METHOD_OPTIONS } from '@/constants/rest-client';
import { FieldInput } from '@/components/ui/field-input/field-input';
import Button from '@/components/ui/button/button';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMethod } from '../../../../hooks/use-method';

export default function RequestForm() {
  const t = useTranslations('RestClient');
  const { method, handleMethodChange, onSendRequest } = useMethod();

  const [url, setUrl] = useState('');
  const isUrlEmpty = !url.trim();

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
