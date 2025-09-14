import dynamic from 'next/dynamic';
import CircleLoader from '@/components/ui/circle-loader/circle-loader';

type RestClientProps = {
  data: string[] | undefined;
};

const RestClient = dynamic<RestClientProps>(
  () => import('@/components/layout/rest-client/rest-client'),
  { loading: () => <CircleLoader /> }
);

type RestClientPageProps = {
  params: Promise<{ data?: string[] }>;
};

export default async function RestClientPage({ params }: RestClientPageProps) {
  const { data } = await params;

  return <RestClient data={data} />;
}
