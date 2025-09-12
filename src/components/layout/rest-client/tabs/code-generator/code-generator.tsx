'use client';
/*import { useTranslations } from 'next-intl';*/
import styles from './code-generator.module.scss';
import CodePanel from '@/components/layout/code-panel/code-panel';
import { useCodeGenerator } from '@/hooks/use-code-generator';

export default function CodeGenerator() {
  /* const t = useTranslations('RestClient');*/
  const {
    code,
    setCode,
    language,
    value,
    supportedLanguages,
    handleLanguageChange,
  } = useCodeGenerator();
  const hasUrl = false; //временно

  return (
    <div className={styles.wrapper}>
      <select
        className={styles.selector}
        disabled={hasUrl}
        value={value}
        onChange={handleLanguageChange}
      >
        {supportedLanguages.map((language) =>
          language.variants.map((item) => (
            <option
              key={language.key + item.key}
              value={language.key + '|' + item.key}
            >
              {language.label + ' | ' + item.key}
            </option>
          ))
        )}
      </select>

      <CodePanel
        text={code}
        setText={setCode}
        title="code"
        language={language}
      />
    </div>
  );
}
