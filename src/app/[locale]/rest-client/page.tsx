'use client';

import Page from '@/components/layout/page/page';
import { mockHeaders } from '@/constants/mockPostman';
import { ConfigRequest } from '@/types/postman.type';
import { useState } from 'react';
import Button from '@/components/ui/button/button';
import CodePanel from '@/components/layout/code-panel/code-panel';

const config: ConfigRequest = {
  method: 'OPTIONS',
  url: 'https://api.example.com/users',
  language: 'objective-c',
  headers: mockHeaders,
};

export default function RestClientPage() {
  const [code, setCode] = useState<string>('');

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
    <Page>
      <div>RestClient</div>
      <Button onClick={generateCode}>generator</Button>
      <CodePanel code={code.split('\n')} />
    </Page>
  );
}
