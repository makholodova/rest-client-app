import styles from './rest-client.module.scss';

import { mockHeaders } from '@/constants/mockPostman';
import { ConfigRequest } from '@/types/postman.type';
import CodePanel from '@/components/layout/code-panel/code-panel';

const config: ConfigRequest = {
  method: 'OPTIONS',
  url: 'https://api.example.com/users',
  language: 'rust',
  headers: mockHeaders,
};

export default function RestClient() {
  return (
    <div className={styles.wrapper}>
      <h2>RestClient</h2>
      <CodePanel config={config} />
    </div>
  );
}
