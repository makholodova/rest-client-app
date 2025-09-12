import Page from '@/components/layout/page/page';
import RequestForm from '@/components/layout/rest-client/request-form/request-form';

export default function RestClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Page>
      <RequestForm />
      {children}
    </Page>
  );
}
