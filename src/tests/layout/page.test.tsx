import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '@/components/layout/page/page';

jest.mock('./page.module.scss', () => ({
  main: 'main',
  centered: 'centered',
}));

const useAuthTokenGuardMock = jest.fn();
jest.mock('@/hooks/useAuthTokenGuard', () => ({
  useAuthTokenGuard: (options?: { skipAuthGuard?: boolean }) =>
    useAuthTokenGuardMock(options),
}));

describe('Page', () => {
  beforeEach(() => {
    useAuthTokenGuardMock.mockClear();
  });

  it('calls useAuthTokenGuard and renders children by default', () => {
    render(
      <Page>
        <span>child</span>
      </Page>
    );

    expect(useAuthTokenGuardMock).toHaveBeenCalledWith({
      skipAuthGuard: false,
    });
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('calls useAuthTokenGuard with skipAuthGuard=true when skipAuthGuard prop is true', () => {
    render(
      <Page skipAuthGuard={true}>
        <span>child</span>
      </Page>
    );

    expect(useAuthTokenGuardMock).toHaveBeenCalledWith({ skipAuthGuard: true });
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('adds the centered class when centered=true', () => {
    const { container } = render(<Page centered>child</Page>);
    expect(container.querySelector('main')).toHaveClass('main', 'centered');
  });
});
