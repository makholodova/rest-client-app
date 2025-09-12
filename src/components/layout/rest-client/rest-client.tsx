import styles from './rest-client.module.scss';
import { Tabs } from '@/components/ui/tabs/tabs';
import Headers from '@/components/layout/rest-client/tabs/headers/headers';
import BodyEditor from '@/components/layout/rest-client/tabs/body-editor/body-editor';
import CodeGenerator from '@/components/layout/rest-client/tabs/code-generator/code-generator';
import { getTranslations } from 'next-intl/server';

export default async function RestClient() {
  const t = await getTranslations('RestClient');

  const tabs = [
    { label: t('headers'), content: <Headers /> },
    { label: t('body'), content: <BodyEditor /> },
    { label: t('code'), content: <CodeGenerator /> },
  ];

  return (
    <div className={styles.wrapper}>
      <Tabs tabs={tabs} />
    </div>
  );
}
