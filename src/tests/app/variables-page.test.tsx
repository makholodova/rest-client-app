import React from 'react';
import { render, screen } from '@testing-library/react';
import VariablesPage from '@/app/[locale]/variables/page';

jest.mock('next/dynamic', () => () => (props: any) => (
  <div data-testid="variables" {...props} />
));

jest.mock('@/components/layout/page/page', () => (props: any) => (
  <div data-testid="page">{props.children}</div>
));

jest.mock('@/components/ui/circle-loader/circle-loader', () => () => (
  <div data-testid="loader">Loading...</div>
));

describe('VariablesPage', () => {
  it('renders Page and Variables', () => {
    render(<VariablesPage />);
    expect(screen.getByTestId('page')).toBeInTheDocument();
    expect(screen.getByTestId('variables')).toBeInTheDocument();
  });
});
