import Page from '@/components/layout/page/page';
import { mockHeaders } from '@/constants/mockPostman';
import { ConfigRequest } from '@/types/postman.type';
import CodePanel from '@/components/layout/code-panel/code-panel';

const config: ConfigRequest = {
  method: 'OPTIONS',
  url: 'https://api.example.com/users',
  language: 'objective-c',
  headers: mockHeaders,
};

export default function RestClientPage() {
  return (
    <Page>
      <div>RestClient</div>
      <CodePanel config={config} />
    </Page>
  );
}
