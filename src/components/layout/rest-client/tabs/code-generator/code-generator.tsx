'use client';
import styles from './code-generator.module.scss';
import CodePanel from '@/components/ui/code-panel/code-panel';
import { useCodeGenerator } from '@/hooks/use-code-generator';

export default function CodeGenerator() {
  const {
    code,
    setCode,
    language,
    value,
    supportedLanguages,
    handleLanguageChange,
  } = useCodeGenerator();

  return (
    <div className={styles.wrapper}>
      <div>
        <select
          className={styles.selector}
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
      </div>

      <CodePanel
        text={code}
        setText={setCode}
        title="code"
        language={language}
      />
    </div>
  );
}
