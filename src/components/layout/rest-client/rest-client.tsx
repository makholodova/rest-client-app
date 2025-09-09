'use client';

import styles from './rest-client.module.scss';
import { useState } from 'react';
import { Method } from '@/types/postman.type';
import { METHOD_OPTIONS } from '@/constants/rest-client';
import { FieldInput } from '@/components/ui/field-input/field-input';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/button/button';

export default function RestClient() {
  const [method, setMethod] = useState<Method>('GET');
  const [url, setUrl] = useState('');
  const t = useTranslations('RestClient');

  return (
    <div className={styles.wrapper}>
      <h2>RestClient</h2>
      <div>
        <form>
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

          <Button>{t('send')}</Button>
        </form>
      </div>
    </div>
  );
}
