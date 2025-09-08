'use client';

import Page from '@/components/layout/page/page';
import dynamic from 'next/dynamic';
import CircleLoader from '@/components/ui/circle-loader/circle-loader';

const History = dynamic(() => import('@/components/layout/history/history'), {
  loading: () => <CircleLoader />,
  ssr: false,
});

export default function HistoryPage() {
  return (
    <Page>
      <History />
    </Page>
  );
}
