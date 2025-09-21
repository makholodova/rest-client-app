import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/layout/error-boundary/error-boundary';

jest.mock('./error-boundary.module.scss', () => ({
  wrapper: 'wrapper',
  title: 'title',
  text: 'text',
}));

jest.mock('@/components/ui/button/button', () => {
  const ButtonMock = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props} />
  );

  (ButtonMock as { displayName?: string }).displayName = 'ButtonMock';
  return ButtonMock;
});

jest.mock('@/components/layout/page/page', () => {
  const PageMock = (props: { children?: React.ReactNode }) => (
    <div data-testid="page">{props.children}</div>
  );

  (PageMock as { displayName?: string }).displayName = 'PageMock';
  return PageMock;
});

function Thrower({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Kaboom');
  return <div data-testid="content">OK</div>;
}


describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary locale="ru">
        <div data-testid="content">OK</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('content')).toHaveTextContent('OK');
  });

  it('shows fallback on ru', () => {
    render(
      <ErrorBoundary locale="ru">
        <Thrower shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Ошибка')).toBeInTheDocument();
    expect(screen.getByText('Попробовать снова')).toBeInTheDocument();
    expect(screen.getByText('Kaboom')).toBeInTheDocument();
  });

  it('shows fallback in en', () => {
    render(
      <ErrorBoundary locale="en">
        <Thrower shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });
});
