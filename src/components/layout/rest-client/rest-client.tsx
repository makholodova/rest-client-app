'use client';

import styles from './rest-client.module.scss';
import { useTranslations } from 'next-intl';
import { Tabs } from '@/components/ui/tabs/tabs';
import Headers from '@/components/layout/rest-client/tabs/headers/headers';
import ResponseViewer from '@/components/layout/rest-client/response-viewer/response-viewer';
import BodyEditor from '@/components/layout/rest-client/tabs/body-editor/body-editor';
import CodeGenerator from '@/components/layout/rest-client/tabs/code-generator/code-generator';

export default function RestClient() {
  const t = useTranslations('RestClient');

  const tabs = [
    { label: t('headers'), content: <Headers /> },
    { label: t('body'), content: <BodyEditor /> },
    { label: t('code'), content: <CodeGenerator /> },
  ];

  return (
    <div className={styles.wrapper}>
      {/* <RequestForm /> */}
      <Tabs tabs={tabs} />
      <ResponseViewer />
    </div>
  );
}
