'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styles from './headers.module.scss';
import { FieldInput } from '@/components/ui/field-input/field-input';
import Button from '@/components/ui/button/button';
import { HeaderRequest } from '@/types/postman.type';

export default function Headers() {
  const t = useTranslations('Headers');
  const [headers, setHeaders] = useState<HeaderRequest[]>([]);

  const addHeader = () => {
    setHeaders([
      ...headers,
      { key: '', value: '', description: '', disabled: false },
    ]);
  };

  const updateHeader = (
    index: number,
    field: 'key' | 'value' | 'disabled' | 'description',
    newValue: string | boolean
  ) => {
    setHeaders((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: newValue,
      } as HeaderRequest;
      return updated;
    });
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  /*const enabledHeaders = useMemo(
    () =>
      headers.filter((header) => !header.disabled && header.key.trim() !== ''),
    [headers]
  );*/

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <span className={styles.col} />
        <span className={styles.col}>{t('key')}</span>
        <span className={styles.col}>{t('value')}</span>
        <span className={styles.col}>{t('description')}</span>
        <span className={styles.col} />
      </div>

      {headers.map((header, i) => (
        <div key={i} className={styles.row}>
          <input
            type="checkbox"
            checked={!header.disabled}
            onChange={(e) => updateHeader(i, 'disabled', !e.target.checked)}
            className={styles.checkbox}
          />
          <FieldInput
            variant={'small'}
            type="text"
            placeholder={t('key')}
            value={header.key}
            onChange={(e) => updateHeader(i, 'key', e.target.value)}
          />
          <FieldInput
            variant={'small'}
            type="text"
            placeholder={t('value')}
            value={header.value}
            onChange={(e) => updateHeader(i, 'value', e.target.value)}
          />
          <FieldInput
            variant="small"
            type="text"
            placeholder={t('description')}
            value={header.description ?? ''}
            onChange={(e) => updateHeader(i, 'description', e.target.value)}
          />
          <Button
            className={styles.removeButton}
            variant={'ghost'}
            onClick={() => removeHeader(i)}
          >
            ✕
          </Button>
        </div>
      ))}

      <Button
        variant={'ghost'}
        type="button"
        onClick={addHeader}
        className={styles.addButton}
      >
        + {t('addButton')}
      </Button>
    </div>
  );
}
