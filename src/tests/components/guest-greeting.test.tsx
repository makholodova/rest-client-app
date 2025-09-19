import React from 'react';
import { render, screen } from '@testing-library/react';
import GuestGreeting from '@/components/ui/guest-greeting/guest-greeting';
import { ROUTES } from '@/constants/routes';

jest.mock('./guest-greeting.module.scss', () => ({
  wrapper: 'wrapper',
  title: 'title',
  text: 'text',
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key.toUpperCase(),
}));

jest.mock('@/components/ui/app-link/app-link', () => {
  return ({ href, children }: any) => (
    <a href={href} data-testid="app-link">
      {children}
    </a>
  );
});

describe('GuestGreeting', () => {
  it('renders title and text', () => {
    render(<GuestGreeting />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'TITLE!'
    );
    expect(screen.getByText(/TEXT/)).toBeInTheDocument();
  });

  it('renders sign-in and sign-up links', () => {
    render(<GuestGreeting />);
    const links = screen.getAllByTestId('app-link');
    expect(links[0]).toHaveAttribute('href', ROUTES.SIGN_IN);
    expect(links[0]).toHaveTextContent('SIGN-IN');
    expect(links[1]).toHaveAttribute('href', ROUTES.SIGN_UP);
    expect(links[1]).toHaveTextContent('SIGN-UP');
  });
});
