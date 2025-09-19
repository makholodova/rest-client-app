import React from 'react';
import History from '@/components/layout/history/history';
import { render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const loadHistoryMock = jest.fn<Promise<void>, []>();

type HistoryItem = { id: number };
const useHistoryMock: {
  history: HistoryItem[];
  loading: boolean;
  error: string;
  loadHistory: jest.Mock<Promise<void>, []>;
} = {
  history: [],
  loading: false,
  error: '',
  loadHistory: loadHistoryMock,
};

jest.mock('@/hooks/use-history', () => ({
  useHistory: () => useHistoryMock,
}));

jest.mock('./history.module.scss', () => ({
  section: 'section',
  title: 'title',
}));

jest.mock('@/components/ui/circle-loader/circle-loader', () => ({
  __esModule: true,
  default: () => <div data-testid="circle-loader">loading...</div>,
}));

jest.mock(
  '@/components/layout/history/history-request-list/history-request-list',
  () => ({
    __esModule: true,
    default: ({ requests }: { requests: any[] }) => (
      <div data-testid="history-list">{`items:${requests?.length ?? 0}`}</div>
    ),
  })
);

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

describe('History component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHistoryMock.history = [];
    useHistoryMock.loading = false;
    useHistoryMock.error = '';
    loadHistoryMock.mockResolvedValue(undefined);
  });

  it('renders the header and calls loadHistory on mount', async () => {
    render(<History />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'title'
    );

    await waitFor(() => {
      expect(loadHistoryMock).toHaveBeenCalledTimes(1);
    });
  });

  it('shows the loader when loading=true', () => {
    useHistoryMock.loading = true;
    render(<History />);

    expect(screen.getByTestId('circle-loader')).toBeInTheDocument();
    expect(screen.queryByTestId('history-list')).not.toBeInTheDocument();
  });

  it('calls toast.error if error is present', () => {
    useHistoryMock.error = 'Something went wrong';
    render(<History />);

    expect(toast.error).toHaveBeenCalledWith('Something went wrong');
    expect(screen.queryByTestId('history-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('circle-loader')).not.toBeInTheDocument();
  });

  it('renders the list on successful loading (no errors and no loading)', () => {
    useHistoryMock.history = [{ id: 1 }, { id: 2 }, { id: 3 }];
    render(<History />);

    const list = screen.getByTestId('history-list');
    expect(list).toBeInTheDocument();
    expect(list).toHaveTextContent('items:3');
  });
});
