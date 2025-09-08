'use client';

import Page from '@/components/layout/page/page';
import dynamic from 'next/dynamic';
import CircleLoader from '@/components/ui/circle-loader/circle-loader';

const RestClient = dynamic(
  () => import('@/components/layout/rest-client/rest-client'),
  { loading: () => <CircleLoader />, ssr: false }
);

export default function RestClientPage() {
  return (
    <Page>
      <RestClient />
    </Page>
  );
}
