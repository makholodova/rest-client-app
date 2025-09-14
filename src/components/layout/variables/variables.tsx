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
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import { ROUTES } from '@/constants/routes';
import { toast } from 'react-toastify';

export default function Variables() {
  const [variables, setVariables] = useState<Variables>({});
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const t = useTranslations('Variables');
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    setVariables(loadVariables());
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) router.push(ROUTES.HOME);
    if (error) toast.error(t('useEffectErrorMessage'));
  }, [user, loading, router, error, t]);

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
        <div className={styles.addVar}>
          <FieldInput
            type="text"
            placeholder={t('placeholder')}
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
          <Button type="button" variant="removeButton" onClick={handleAdd}>
            <Image src="/plus.svg" alt="+" width={24} height={24} />
          </Button>
        </div>
        {hasVariables ? (
          <ul className={styles.list}>
            {Object.entries(variables).map(([key, value]) => (
              <li key={key} className={styles.listItem}>
                <span className={styles.varKey}>{key}</span>
                <span className={styles.varValue}>{value}</span>
                <Button
                  variant="removeButton"
                  onClick={() => handleDelete(key)}
                >
                  <Image src="/close.svg" alt="Close" width={24} height={24} />
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
        {hasVariables ? null : <h3>{t('noVariables')}</h3>}
        {hasVariables ? (
          <div className={styles.clear}>
            <Button
              variant="secondary"
              onClick={handleClear}
              disabled={!Object.keys(variables).length}
            >
              {t('clearBtn')}
            </Button>{' '}
          </div>
        ) : null}
      </div>
    </Page>
  );
}
