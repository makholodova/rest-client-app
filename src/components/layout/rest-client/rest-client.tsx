import { Tabs } from '@/components/ui/tabs/tabs';
import { getTranslations } from 'next-intl/server';

import RequestForm from './request-form/request-form';
import Headers from './tabs/headers/headers';
import BodyEditor from './tabs/body-editor/body-editor';
import CodeGenerator from './tabs/code-generator/code-generator';

export default async function RestClient() {
  const t = await getTranslations('RestClient');

  const tabs = [
    { label: t('headers'), content: <Headers /> },
    { label: t('body'), content: <BodyEditor /> },
    { label: t('code'), content: <CodeGenerator /> },
  ];

  return (
    <>
      <RequestForm />
      <Tabs tabs={tabs} />
    </>
  );
}
