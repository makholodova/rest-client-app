import { fireEvent, render, screen } from '@testing-library/react';
import HistoryRequestItem from '@/components/layout/history/history-request-item/history-request-item';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('next/image', () => {
  const NextImageMock = (
    props: React.ImgHTMLAttributes<HTMLImageElement> & { alt?: string }
  ) => <img {...props} alt={props.alt} />;

  (NextImageMock as { displayName?: string }).displayName = 'NextImageMock';
  return NextImageMock;
});

jest.mock('next/link', () => {
  const LinkMock = ({
    href,
    children,
  }: {
    href: string | { pathname: string; query?: Record<string, string> };
    children?: React.ReactNode;
  }) => (
    <a
      href={typeof href === 'string' ? href : '/client?history=test'}
      data-testid="mock-link"
    >
      {children}
    </a>
  );
  (LinkMock as { displayName?: string }).displayName = 'LinkMock';
  return LinkMock;
});

const redirectToRequestPageMock = jest.fn();
jest.mock('@/hooks/use-api-request', () => ({
  useApiRequest: () => ({
    redirectToRequestPage: redirectToRequestPageMock,
  }),
}));

const baseRequest = {
  id: 'req-1',
  method: 'GET',
  status: 200,
  url: 'https://api.example.com/users',
  timestamp: new Date().toISOString(),
  latency_ms: 123,
  req_size_bytes: 456,
  res_size_bytes: 789,
  error: null,
};

describe('HistoryRequestItem', () => {
  it('renders data for a successful request', () => {
    render(<HistoryRequestItem request={baseRequest} />);

    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText(String(baseRequest.status))).toBeInTheDocument();
    expect(screen.getByText(baseRequest.url)).toBeInTheDocument();
    expect(screen.getByText(/ms/)).toBeInTheDocument();
    expect(screen.getByText(/↑/)).toBeInTheDocument();
    expect(screen.getByText(/↓/)).toBeInTheDocument();
  });

  it('shows "—" and error badge when status=null', () => {
    const request = {
      ...baseRequest,
      status: null,
      error: { type: 'NETWORK' },
    };

    render(<HistoryRequestItem request={request} />);
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('NETWORK')).toBeInTheDocument();
  });

  it('on click calls redirectToRequestPage with the correct arguments', () => {
    render(<HistoryRequestItem request={baseRequest} />);

    const li =
      screen.queryByRole('listitem', { hidden: true }) ??
      screen.getByText(baseRequest.url).closest('li');

    expect(li).not.toBeNull();

    if (li) {
      fireEvent.click(li);
    }

    expect(redirectToRequestPageMock).toHaveBeenCalledTimes(1);
  });
});
