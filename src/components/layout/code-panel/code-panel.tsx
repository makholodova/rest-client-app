'use client';

import style from './code-panel.module.scss';
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { toast } from 'react-toastify';
import { useTranslations } from 'use-intl';
import Image from 'next/image';

type PanelProps = {
  initText: string;
  isReadOnly?: boolean;
  title?: string;
  language?: 'json' | 'text';
};

export default function CodePanel({
  initText,
  isReadOnly,
  title,
  language = 'json',
}: PanelProps) {
  const [code, setCode] = useState<string>(initText);

  const t = useTranslations('codePanel');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
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
          value={code}
          onChange={(value) => setCode(value as string)}
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
