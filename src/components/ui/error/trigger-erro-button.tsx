'use client';
import styles from './trigger-erro-button.module.scss';

import { useState } from 'react';

export default function TriggerErrorButton() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('Server error');
  }

  return (
    <button className={styles.button} onClick={() => setShouldError(true)}>
      test error page
    </button>
  );
}
