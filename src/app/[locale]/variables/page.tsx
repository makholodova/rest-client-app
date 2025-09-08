'use client';

import Page from '@/components/layout/page/page';
import dynamic from 'next/dynamic';
import CircleLoader from '@/components/ui/circle-loader/circle-loader';

const Variables = dynamic(
  () => import('@/components/layout/variables/variables'),
  { loading: () => <CircleLoader />, ssr: false }
);

export default function VariablesPage() {
  return (
    <Page>
      <Variables />
    </Page>
  );
}
