import dynamic from 'next/dynamic';
import CircleLoader from '@/components/ui/circle-loader/circle-loader';

const RestClient = dynamic(
  () => import('@/components/layout/rest-client/rest-client'),
  { loading: () => <CircleLoader /> }
);

export default function RestClientPage() {
  return <RestClient />;
}
