'use client';
import { useState } from 'react';
import styles from './body-editor.module.scss';
import CodePanel from '@/components/ui/code-panel/code-panel';

export default function BodyEditor() {
  const [body, setBody] = useState('enter body');

  return (
    <div className={styles.wrapper}>
      <CodePanel text={body} setText={setBody} title="body" />
    </div>
  );
}
