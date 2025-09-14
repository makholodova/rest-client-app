import styles from './rest-client.module.scss';
import { Tabs } from '@/components/ui/tabs/tabs';
import Headers from '@/components/layout/rest-client/tabs/headers/headers';
import BodyEditor from '@/components/layout/rest-client/tabs/body-editor/body-editor';
import CodeGenerator from '@/components/layout/rest-client/tabs/code-generator/code-generator';
import { getTranslations } from 'next-intl/server';
import ResponseViewer from './response-viewer/response-viewer';

export default async function RestClient({
  data,
}: {
  data: string[] | undefined;
}) {
  const t = await getTranslations('RestClient');

  const tabs = [
    { label: t('headers'), content: <Headers /> },
    { label: t('body'), content: <BodyEditor /> },
    { label: t('code'), content: <CodeGenerator /> },
  ];

  return (
    <div className={styles.wrapper}>
      <Tabs tabs={tabs} />
      <ResponseViewer data={data} />
    </div>
  );
}
