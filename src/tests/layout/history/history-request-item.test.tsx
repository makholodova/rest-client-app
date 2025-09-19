import { render, screen } from '@testing-library/react';
import HistoryRequestItem from '@/components/layout/history/history-request-item/history-request-item';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('next/image', () => (props: any) => (
  <img {...props} alt={props.alt} />
));

jest.mock('next/link', () => {
  const React = require('react');
  return ({ href, children }: any) => (
    <a href={typeof href === 'string' ? href : '/client?history=test'}>
      {children}
    </a>
  );
});

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
    render(<HistoryRequestItem request={baseRequest as any} />);

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

    render(<HistoryRequestItem request={request as any} />);
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('NETWORK')).toBeInTheDocument();
  });
});
