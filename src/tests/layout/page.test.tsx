import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '@/components/layout/page/page';

jest.mock('./page.module.scss', () => ({
  main: 'main',
  centered: 'centered',
}));

const useAuthTokenGuardMock = jest.fn();
jest.mock('@/hooks/useAuthTokenGuard', () => ({
  useAuthTokenGuard: () => useAuthTokenGuardMock(),
}));

describe('Page', () => {
  it('calls useAuthTokenGuard and renders children', () => {
    render(
      <Page>
        <span>child</span>
      </Page>
    );

    expect(useAuthTokenGuardMock).toHaveBeenCalled();
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('adds the centered class when centered=true', () => {
    const { container } = render(<Page centered>child</Page>);
    expect(container.querySelector('main')).toHaveClass('main', 'centered');
  });
});
