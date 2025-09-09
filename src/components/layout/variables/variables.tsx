'use client';

import { useEffect, useState } from 'react';
import styles from './variables.module.scss';
import Page from '@/components/layout/page/page';
import Button from '@/components/ui/button/button';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FieldInput } from '@/components/ui/field-input/field-input';
import {
  loadVariables,
  saveVariables,
  clearVariables,
  type Variables,
} from '@/utils/variables';

export default function Variables() {
  const [variables, setVariables] = useState<Variables>({});
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const t = useTranslations('Variables');

  useEffect(() => {
    setVariables(loadVariables());
  }, []);

  const handleAdd = () => {
    const trimmedKey = key.trim();
    if (!trimmedKey) return;
    const updated = { ...variables, [key]: value };
    setVariables(updated);
    saveVariables(updated);
    setKey('');
    setValue('');
  };

  const handleDelete = (delKey: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [delKey]: something, ...rest } = variables;
    setVariables(rest);
    saveVariables(rest);
  };
  const handleClear = () => {
    clearVariables();
    setVariables({});
  };

  const hasVariables = Object.keys(variables).length > 0;

  return (
    <Page>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>{t('title')}</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <FieldInput
                  type="text"
                  placeholder={t('placeholder')}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className={styles.input}
                />
              </th>
              <th>
                {' '}
                <FieldInput
                  type="text"
                  placeholder={t('value')}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className={styles.input}
                />
              </th>
              <th className={styles.invisible}>
                {' '}
                <Button
                  type="button"
                  variant="removeButton"
                  onClick={handleAdd}
                >
                  <Image src="/plus.svg" alt="+" width={24} height={24} />
                </Button>
              </th>
            </tr>
          </thead>
          {hasVariables ? (
            <tbody>
              {Object.entries(variables).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                  <td className={styles.invisible}>
                    <Button
                      variant="removeButton"
                      onClick={() => handleDelete(key)}
                    >
                      <Image
                        src="/close.svg"
                        alt="Close"
                        width={24}
                        height={24}
                      />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>
        {hasVariables ? null : <h3>{t('noVariables')}</h3>}
        {hasVariables ? (
          <Button
            variant="secondary"
            onClick={handleClear}
            disabled={!Object.keys(variables).length}
          >
            {t('clearBtn')}
          </Button>
        ) : null}
      </div>
    </Page>
  );
}
