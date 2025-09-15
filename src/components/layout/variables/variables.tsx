'use client';

import { useState } from 'react';
import styles from './variables.module.scss';
import Page from '@/components/layout/page/page';
import Button from '@/components/ui/button/button';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FieldInput } from '@/components/ui/field-input/field-input';

import { useVariables } from '@/hooks/use-variables';

export default function Variables() {
  const { entries, has, add, remove, clear } = useVariables();
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const t = useTranslations('Variables');

  const handleAdd = () => {
    if (add(key, value)) {
      setKey('');
      setValue('');
    }
  };

  return (
    <Page>
      <section className={styles.wrapper}>
        <h2 className={styles.title}>{t('title')}</h2>
        <div className={styles.addVar}>
          <FieldInput
            type="text"
            placeholder={t('key')}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className={styles.input}
          />
          <FieldInput
            type="text"
            placeholder={t('value')}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={styles.input}
          />
          <Button
            disabled={!key.trim() || !value.trim()}
            type="button"
            variant="removeButton"
            onClick={handleAdd}
          >
            <Image src="/plus.svg" alt="+" width={24} height={24} />
          </Button>
        </div>

        {has ? (
          <>
            <ul className={styles.list}>
              {entries.map(([key, value]) => (
                <li key={key} className={styles.listItem}>
                  <span className={styles.varKey}>{key}</span>
                  <span className={styles.varValue}>{value}</span>
                  <Button variant="removeButton" onClick={() => remove(key)}>
                    <Image
                      src="/close.svg"
                      alt="Close"
                      width={24}
                      height={24}
                    />
                  </Button>
                </li>
              ))}
            </ul>
            <div className={styles.clear}>
              <Button variant="secondary" onClick={clear} disabled={!has}>
                {t('clearBtn')}
              </Button>{' '}
            </div>
          </>
        ) : (
          <h3 className={styles.noVariables}>{t('noVariables')}</h3>
        )}
      </section>
    </Page>
  );
}
