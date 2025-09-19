import Page from '@/components/layout/page/page';
import CircleLoader from '@/components/ui/circle-loader/circle-loader';
import dynamic from 'next/dynamic';

const RestClientHeader = dynamic(
  () => import('@/components/layout/rest-client/rest-client'),
  {
    loading: () => <CircleLoader />,
  }
);

export default async function RestClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Page>
      <div>
        <RestClientHeader />
        {children}
      </div>
    </Page>
  );
}
