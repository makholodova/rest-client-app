import { render, screen } from '@testing-library/react';
import HistoryRequestsList from '@/components/layout/history/history-request-list/history-request-list';

jest.mock(
  '@/components/layout/history/empty-history/empty-history',
  () => () => <div data-testid="empty-history">Empty</div>
);
jest.mock(
  '@/components/layout/history/history-request-item/history-request-item',
  () => (props: any) => <li data-testid="history-item">{props.request.id}</li>
);

describe('HistoryRequestsList', () => {
  it('renders EmptyHistory when undefined', () => {
    render(<HistoryRequestsList requests={undefined as any} />);
    expect(screen.getByTestId('empty-history')).toBeInTheDocument();
  });
  it('renders EmptyHistory if requests are empty', () => {
    render(<HistoryRequestsList requests={[]} />);
    expect(screen.getByTestId('empty-history')).toBeInTheDocument();
  });

  it('renders and sorts the elements if requests are not empty', () => {
    const requests = [
      { id: 'old', timestamp: '2025-09-15T10:00:00Z' },
      { id: 'new', timestamp: '2025-09-16T12:00:00Z' },
      { id: 'middle', timestamp: '2025-09-16T08:00:00Z' },
    ] as any;

    render(<HistoryRequestsList requests={requests} />);

    const items = screen
      .getAllByTestId('history-item')
      .map((el) => el.textContent);
    expect(items).toEqual(['new', 'middle', 'old']);
  });
});
