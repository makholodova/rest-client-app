import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('./not-found.module.scss', () => ({
  wrapper: 'wrapper',
  title: 'title',
  text: 'text',
}));

const tMock = jest.fn((key: string) => key.toUpperCase());
jest.mock('next-intl/server', () => ({
  getTranslations: () => Promise.resolve(tMock),
}));

jest.mock('@/components/layout/page/page', () => ({
  __esModule: true,
  default: ({
    children,
    centered,
  }: {
    children: React.ReactNode;
    centered?: boolean;
  }) => (
    <div data-testid="page" data-centered={centered}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/button-link/button-link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a data-testid="btn" href={href}>
      {children}
    </a>
  ),
}));

describe(' ', () => {
  it('renders the title, description, and button with translations', async () => {
    const { default: NotFound } = await import('@/app/[locale]/not-found');
    const ui = await NotFound();

    render(ui);

    expect(tMock).toHaveBeenCalledWith('title');
    expect(tMock).toHaveBeenCalledWith('description');
    expect(tMock).toHaveBeenCalledWith('button');

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'TITLE'
    );
    expect(screen.getByText('DESCRIPTION')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveTextContent('BUTTON');
  });
});
