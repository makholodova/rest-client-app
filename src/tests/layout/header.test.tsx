import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/layout/header/header';
import { logout } from '@/firebase';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/hooks/use-is-scrolled', () => ({
  useIsScrolled: jest.fn(),
}));

jest.mock('@/firebase', () => ({
  auth: {},
  logout: jest.fn(),
}));
jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

jest.mock('@/components/ui/language-switcher/language-switcher', () => () => (
  <div data-testid="language-switcher" />
));
jest.mock('@/components/ui/button/button', () => (props: any) => (
  <button data-testid="button" onClick={props.onClick}>
    {props.children}
  </button>
));
jest.mock('@/components/ui/button-link/button-link', () => (props: any) => (
  <a data-testid="button-link" href={props.href}>
    {props.children}
  </a>
));

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('guest: displays Logo, sign-in and sign-up, no sticky', () => {
    const { useAuthState } = require('react-firebase-hooks/auth');
    const { useIsScrolled } = require('@/hooks/use-is-scrolled');

    useAuthState.mockReturnValue([null]);
    useIsScrolled.mockReturnValue(false);

    const { container } = render(<Header />);

    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();

    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.getByText('sign-in')).toBeInTheDocument();
    expect(screen.getByText('sign-up')).toBeInTheDocument();

    const headerEl = container.querySelector('header')!;
    expect(headerEl.className).toMatch(/header/);
    expect(headerEl.className).not.toMatch(/sticky/);
  });

  it('authorized: shows sign-out and calls logout on click', () => {
    const { useAuthState } = require('react-firebase-hooks/auth');
    const { useIsScrolled } = require('@/hooks/use-is-scrolled');

    useAuthState.mockReturnValue([{ uid: 'u1' }]);
    useIsScrolled.mockReturnValue(false);

    render(<Header />);

    const signOutBtn = screen.getByText('sign-out');
    fireEvent.click(signOutBtn);
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('adds sticky class when useIsScrolled === true', () => {
    const { useAuthState } = require('react-firebase-hooks/auth');
    const { useIsScrolled } = require('@/hooks/use-is-scrolled');

    useAuthState.mockReturnValue([null]);
    useIsScrolled.mockReturnValue(true);

    const { container } = render(<Header />);
    const headerEl = container.querySelector('header')!;
    expect(headerEl.className).toMatch(/sticky/);
  });
});
