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
  const [isRead, setIsRead] = useState(false);
  const [code, setCode] = useState<string>('');
  const [lineCount, setLineCount] = useState(1);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines);
  }, [code]);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
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
        setCode(result.code);
      }
    } catch (error) {
      console.error('Error generating code:', error);
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
        <div ref={lineNumbersRef} className={style.lineNumbers}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className={style.lineNumber}>
              {i + 1}
            </div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          className={style.textarea}
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
