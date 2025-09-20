import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '@/components/layout/error-boundary/error-boundary';

jest.mock('./error-boundary.module.scss', () => ({
  wrapper: 'wrapper',
  title: 'title',
  text: 'text',
}));

jest.mock('@/components/ui/button/button', () => (props: any) => (
  <button {...props} />
));
jest.mock('@/components/layout/page/page', () => (props: any) => (
  <div data-testid="page" {...props} />
));

function Thrower({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Kaboom');
  return <div data-testid="content">OK</div>;
}

let consoleErrorSpy: jest.SpyInstance;
beforeAll(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  consoleErrorSpy.mockRestore();
});

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
