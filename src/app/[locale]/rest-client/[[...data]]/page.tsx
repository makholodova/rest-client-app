import CircleLoader from '@/components/ui/circle-loader/circle-loader';
import dynamic from 'next/dynamic';

import { Method } from '@testing-library/dom';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

type RestClientPageProps = {
  params: Promise<{ data?: string[] }>;
  searchParams: Promise<{ [key: string]: string }>;
};

const ResponseViewer = dynamic(
  () =>
    import('@/components/layout/rest-client/response-viewer/response-viewer'),
  {
    loading: () => <CircleLoader />,
  }
);

export default async function RestClientPage({
  params,
  searchParams,
}: RestClientPageProps) {
  const { data } = await params;
  const headers = await searchParams;

  if (!(data?.[0] as Method)) {
    redirect(`${ROUTES.REST_CLIENT}/GET`);
  }

  return <ResponseViewer {...{ data, headers }} />;
}
