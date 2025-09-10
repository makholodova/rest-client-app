/*import { useTranslations } from 'next-intl';*/
import styles from './code-generator.module.scss';
import { ProgrammingLanguage } from '@/types/postman.type';
import { LANGUAGE_OPTIONS } from '@/constants/rest-client';
import { useState } from 'react';

export default function CodeGenerator() {
  /* const t = useTranslations('RestClient');*/
  const [language, setLanguage] = useState<ProgrammingLanguage>('javascript');

  const hasUrl = false; //временно

  return (
    <div className={styles.wrapper}>
      <select
        className={styles.selector}
        disabled={!hasUrl}
        value={language}
        onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
      >
        {LANGUAGE_OPTIONS.map((language) => (
          <option key={language.key} value={language.key}>
            {language.label}
          </option>
        ))}
      </select>
    </div>
  );
}
