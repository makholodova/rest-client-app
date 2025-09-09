'use client';

import style from './code-panel.module.scss';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/button/button';
import { toast } from 'react-toastify';
import { ConfigRequest } from '@/types/postman.type';
import { useTranslations } from 'use-intl';
import CircleLoader from '@/components/ui/circle-loader/circle-loader';

type CodePanelProps = {
  config: ConfigRequest;
};

export default function CodePanel({ config }: CodePanelProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [code, setCode] = useState<string>('');
  const [lineNumbers, setLineNumbers] = useState<string>('1\n');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaNumbersRef = useRef<HTMLTextAreaElement>(null);

  const t = useTranslations('codePanel');

  useEffect(() => {
    const lines = code.split('\n').map((_, index) => `${++index}`);
    setLineNumbers(lines.join('\n') ?? '1\n');
  }, [code]);

  const handleScroll = () => {
    if (textareaRef.current && textareaNumbersRef.current) {
      textareaNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(t('copySucces'));
    } catch (err) {
      toast.error(`${t('copyError')}: ${err}`);
    }
  };

  const generateCode = async () => {
    setIsLoading(false);

    try {
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(t('genSucces'));
        setCode(result.code);
      }
    } catch (error) {
      toast.error(`${t('genError')}: ${error}`);
    } finally {
      setIsLoading(true);
    }
  };

  const startEdit = () => {
    setIsEdit((prev) => !prev);

    if (!isEdit) {
      textareaRef.current?.focus();
    }
  };

  return (
    <section className={style.panel}>
      <header className={style.header}>
        <h2>{config.language}</h2>
        <Button onClick={generateCode}>{t('generate')}</Button>

        <div className={style.tools}>
          <Button onClick={copyToClipboard}>{t('copy')}</Button>
          <Button
            onClick={startEdit}
            variant={isEdit ? 'primary' : 'secondary'}
          >
            {isEdit ? t('edit') : t('read')}
          </Button>
        </div>
      </header>

      <div className={`${style.editor} ${isEdit ? style.active : ''}`}>
        {isLoading ? (
          <>
            <textarea
              ref={textareaNumbersRef}
              className={style.linearea}
              value={lineNumbers}
              readOnly
            />

            <textarea
              ref={textareaRef}
              className={style.codearea}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={handleScroll}
              spellCheck={false}
              wrap="off"
              placeholder={t('codearea')}
              readOnly={!isEdit}
            />
          </>
        ) : (
          <CircleLoader />
        )}
      </div>
    </section>
  );
}
