import React from 'react';
import History from '@/components/layout/history/history';
import { render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const loadHistoryMock = jest.fn<Promise<void>, []>();

type HistoryItem = { id: number };
type UseHistoryShape = {
  history: HistoryItem[];
  loading: boolean;
  authLoading: boolean;
  error: string;
  userId?: string | null;
  loadHistory: jest.Mock<Promise<void>, []>;
};

const useHistoryMock: UseHistoryShape = {
  history: [],
  loading: false,
  authLoading: false,
  error: '',
  userId: undefined,
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
      default: ({
                  requests,
                  loading,
                  authLoading,
                }: {
        requests: any[];
        loading: boolean;
        authLoading: boolean;
      }) => (
          <div data-testid="history-list">
            {`items:${requests?.length ?? 0};loading:${loading};auth:${authLoading}`}
          </div>
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
    useHistoryMock.authLoading = false;
    useHistoryMock.error = '';
    useHistoryMock.userId = undefined;
    loadHistoryMock.mockResolvedValue(undefined);
  });

  it('renders the header ', () => {
    render(<History />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('title');
  });

  it('does not call loadHistory without a userId', async () => {
    render(<History />);
    await waitFor(() => {
      expect(loadHistoryMock).toHaveBeenCalledTimes(0);
    });
  });

  it('calls loadHistory when userId appears', async () => {
    useHistoryMock.userId = 'u1';
    render(<History />);
    await waitFor(() => {
      expect(loadHistoryMock).toHaveBeenCalledTimes(1);
    });
  });
  it('shows the loader when authLoading=true', () => {
    useHistoryMock.authLoading = true;
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
