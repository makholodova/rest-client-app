import React from 'react';
import { render, screen } from '@testing-library/react';
import UserGreeting from '@/components/ui/user-greeting/user-greeting';
import { ROUTES } from '@/constants/routes';

jest.mock('./user-greeting.module.scss', () => ({
  wrapper: 'wrapper',
  title: 'title',
  text: 'text',
  links: 'links',
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key.toUpperCase(),
}));

jest.mock('@/components/ui/button-link/button-link', () => {
  return ({ href, children }: any) => (
    <a href={href} data-testid="btn-link">
      {children}
    </a>
  );
});

describe('UserGreeting', () => {
  it('renders a title without a name', () => {
    render(<UserGreeting />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'TITLE!'
    );
    expect(screen.getByText('TEXT.')).toBeInTheDocument();
  });

  it('renders a title with the name', () => {
    render(<UserGreeting name="Alice" />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'TITLE, Alice!'
    );
  });

  it('renders links to restClient, history, and variables', () => {
    render(<UserGreeting />);
    const links = screen.getAllByTestId('btn-link');
    expect(links[0]).toHaveAttribute('href', ROUTES.REST_CLIENT);
    expect(links[0]).toHaveTextContent('RESTCLIENT');
    expect(links[1]).toHaveAttribute('href', ROUTES.HISTORY);
    expect(links[1]).toHaveTextContent('HISTORY');
    expect(links[2]).toHaveAttribute('href', ROUTES.VARIABLES);
    expect(links[2]).toHaveTextContent('VARIABLES');
  });
});
