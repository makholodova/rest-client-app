import React from 'react';
import { render, screen } from '@testing-library/react';
import VariablesPage from '@/app/[locale]/variables/page';

jest.mock('next/dynamic', () => {
  const DynamicMock = (props: { [key: string]: unknown }) => (
    <div data-testid="variables" {...props} />
  );
  (DynamicMock as { displayName?: string }).displayName = 'DynamicMock';
  return () => DynamicMock;
});

jest.mock('@/components/layout/page/page', () => {
  const PageMock = (props: { children?: React.ReactNode }) => (
    <div data-testid="page">{props.children}</div>
  );
  (PageMock as { displayName?: string }).displayName = 'PageMock';
  return PageMock;
});

jest.mock('@/components/ui/circle-loader/circle-loader', () => {
  const LoaderMock = () => <div data-testid="loader">Loading...</div>;
  (LoaderMock as { displayName?: string }).displayName = 'LoaderMock';
  return LoaderMock;
});

describe('VariablesPage', () => {
  it('renders Page and Variables', () => {
    render(<VariablesPage />);
    expect(screen.getByTestId('page')).toBeInTheDocument();
    expect(screen.getByTestId('variables')).toBeInTheDocument();
  });
});
