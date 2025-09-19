import React from 'react';
import { act, render, screen } from '@testing-library/react';
import HistoryPage from '@/app/[locale]/history/page';

jest.mock('@/components/layout/page/page', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page">{children}</div>
  ),
}));

jest.mock('@/components/layout/history/history', () => ({
  __esModule: true,
  default: () => <div data-testid="history">HistoryComp</div>,
}));

jest.mock('@/app/layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/ui/circle-loader/circle-loader', () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>,
}));

describe('HistoryPage', () => {
  it('renders Page and History', async () => {
    await act(async () => {
      render(<HistoryPage />);
    });
    expect(screen.getByTestId('page')).toBeInTheDocument();
    expect(screen.getByTestId('history')).toHaveTextContent('HistoryComp');
  });
});
