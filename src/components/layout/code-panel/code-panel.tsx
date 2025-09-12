'use client';

import style from './code-panel.module.scss';
import Editor from '@monaco-editor/react';
import { toast } from 'react-toastify';
import { useTranslations } from 'use-intl';
import Image from 'next/image';

type PanelProps = {
  text: string;
  setText?: (str: string) => void;
  isReadOnly?: boolean;
  title?: string;
  language?: 'json' | 'text' | string;
};

export default function CodePanel({
  text,
  setText,
  isReadOnly,
  title,
  language = 'json',
}: PanelProps) {
  const t = useTranslations('codePanel');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('copySucces'));
    } catch (err) {
      toast.error(`${t('copyError')}: ${err}`);
    }
  };

  return (
    <section className={`${style.panel} ${isReadOnly ? '' : style.active}`}>
      <header className={style.header}>
        <h3 className={style.title}>{title}</h3>
        <button onClick={copyToClipboard}>
          <Image src="/сopy.svg" alt="copy" width={24} height={24} />
        </button>
      </header>

      <div className={style.editor}>
        <Editor
          height="300px"
          language={language}
          value={text}
          onChange={(value) => {
            if (setText) {
              setText(value as string);
            }
          }}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            readOnly: isReadOnly,
          }}
        />
      </div>
    </section>
  );
}
