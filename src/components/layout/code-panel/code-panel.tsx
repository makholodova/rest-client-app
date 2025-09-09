'use client';

import style from './code-panel.module.scss';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/button/button';
import { toast } from 'react-toastify';
import { ConfigRequest } from '@/types/postman.type';

type CodePanelProps = {
  config: ConfigRequest;
};

export default function CodePanel({ config }: CodePanelProps) {
  const [isRead, setIsRead] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [lineNumbers, setLineNumbers] = useState<string>('1\n');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaNumbersRef = useRef<HTMLTextAreaElement>(null);

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
      toast.success('Текст скопирован в буфер обмена');
    } catch (err) {
      toast.error(`Ошибка копирования: ${err}`);
    }
  };

  const generateCode = async () => {
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
        toast.success('Код успешно сгенерирован!');
        setCode(result.code);
      }
    } catch (error) {
      toast.error(`Error generating code: ${error}`);
    }
  };

  return (
    <section className={style.panel}>
      <header className={style.header}>
        <h2>{config.language}</h2>
        <Button onClick={generateCode}>generate code</Button>

        <div className={style.tools}>
          <Button onClick={copyToClipboard}>copy</Button>
          <Button onClick={() => setIsRead((prev) => !prev)}>
            {isRead ? 'edit' : 'read'}
          </Button>
        </div>
      </header>

      <div className={style.editor}>
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
          placeholder="Введите код..."
          readOnly={isRead}
        />
      </div>
    </section>
  );
}
