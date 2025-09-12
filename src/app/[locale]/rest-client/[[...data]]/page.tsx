import dynamic from 'next/dynamic';
import CircleLoader from '@/components/ui/circle-loader/circle-loader';
import ResponseViewer from '@/components/layout/rest-client/response-viewer/response-viewer';

const RestClient = dynamic(
  () => import('@/components/layout/rest-client/rest-client'),
  { loading: () => <CircleLoader /> }
);

export default async function RestClientPage({
  params,
}: {
  params: Promise<{ data?: string[] }>;
}) {
  const { data } = await params;

  return (
    <>
      <RestClient />
      <ResponseViewer data={data} />
    </>
  );
}
