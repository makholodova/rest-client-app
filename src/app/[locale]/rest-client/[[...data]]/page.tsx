import dynamic from 'next/dynamic';
import CircleLoader from '@/components/ui/circle-loader/circle-loader';

type RestClientProps = {
  data: string[] | undefined;
  headers: { [key: string]: string };
};

const RestClient = dynamic<RestClientProps>(
  () => import('@/components/layout/rest-client/rest-client'),
  { loading: () => <CircleLoader /> }
);

type RestClientPageProps = {
  params: Promise<{ data?: string[] }>;
  searchParams: Promise<{ [key: string]: string }>;
};

export default async function RestClientPage({
  params,
  searchParams,
}: RestClientPageProps) {
  const { data } = await params;
  const search = await searchParams;

  return <RestClient data={data} headers={search} />;
}
