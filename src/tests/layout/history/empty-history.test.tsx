import { render, screen } from '@testing-library/react';
import EmptyHistory from '@/components/layout/history/empty-history/empty-history';
import { ROUTES } from '@/constants/routes';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock('@/components/ui/button-link/button-link', () => {
  const ButtonLinkMock = ({
    href,
    children,
  }: {
    href: string;
    children?: React.ReactNode;
  }) => (
    <a data-testid="button-link" href={href}>
      {children}
    </a>
  );
  (ButtonLinkMock as { displayName?: string }).displayName = 'ButtonLinkMock';
  return ButtonLinkMock;
});

describe('EmptyHistory', () => {
  it('renders noRequests, empty and link', () => {
    render(<EmptyHistory />);
    expect(screen.getByText('noRequests')).toBeInTheDocument();

    expect(screen.getByText('empty')).toBeInTheDocument();

    const link = screen.getByTestId('button-link');
    expect(link).toHaveAttribute('href', ROUTES.REST_CLIENT);
    expect(link).toHaveTextContent('restLink');
  });
});
