'use client';

import { useTranslations } from 'next-intl';
import { useHeaders } from '@/hooks/useHeaders';
import styles from './headers.module.scss';
import { FieldInput } from '@/components/ui/field-input/field-input';
import Button from '@/components/ui/button/button';

export default function Headers() {
  const t = useTranslations('Headers');
  const { headers, addHeader, updateHeader, removeHeader, toggleHeader } =
    useHeaders();

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
            onChange={() => toggleHeader(i)}
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
