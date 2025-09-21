import { render, screen, fireEvent, act } from '@testing-library/react';
import Header from '@/components/layout/header/header';
import { logout, auth } from '@/firebase';
import { User } from 'firebase/auth';

jest.mock('@/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
  },
  logout: jest.fn(),
}));

const mockedAuth = auth as jest.Mocked<typeof auth>;
const mockedLogout = logout as jest.MockedFunction<typeof logout>;

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/hooks/use-is-scrolled', () => ({
  useIsScrolled: jest.fn(),
}));

jest.mock('@/components/ui/language-switcher/language-switcher', () => () => (
  <div data-testid="language-switcher" />
));

jest.mock(
  '@/components/ui/button/button',
  () => (props: { onClick: () => void; children: React.ReactNode }) => (
    <button data-testid="button" onClick={props.onClick}>
      {props.children}
    </button>
  )
);

jest.mock(
  '@/components/ui/button-link/button-link',
  () => (props: { href: string; children: React.ReactNode }) => (
    <a data-testid="button-link" href={props.href}>
      {props.children}
    </a>
  )
);

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe('Header', () => {
  const mockUnsubscribe = jest.fn();
  let authStateCallback: (user: User | null) => void = () => {};

  beforeEach(() => {
    jest.clearAllMocks();

    mockedAuth.onAuthStateChanged.mockImplementation(
      (
        nextOrObserver:
          | ((user: User | null) => void)
          | { next: (user: User | null) => void },
        error?: (error: Error) => void,
        completed?: () => void
      ) => {
        if (typeof nextOrObserver === 'function') {
          authStateCallback = nextOrObserver;
        } else if (
          nextOrObserver &&
          typeof nextOrObserver.next === 'function'
        ) {
          authStateCallback = nextOrObserver.next;
        }
        return mockUnsubscribe;
      }
    );
  });

  it('guest: displays Logo, sign-in and sign-up, no sticky', async () => {
    const { useIsScrolled } = require('@/hooks/use-is-scrolled');
    (useIsScrolled as jest.Mock).mockReturnValue(false);

    const { container } = render(<Header />);

    await act(async () => {
      authStateCallback(null);
    });

    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.getByText('sign-in')).toBeInTheDocument();
    expect(screen.getByText('sign-up')).toBeInTheDocument();

    const headerEl = container.querySelector('header')!;
    expect(headerEl.className).toMatch(/header/);
    expect(headerEl.className).not.toMatch(/sticky/);
  });

  it('authorized: shows sign-out and calls logout on click', async () => {
    const { useIsScrolled } = require('@/hooks/use-is-scrolled');
    (useIsScrolled as jest.Mock).mockReturnValue(false);

    render(<Header />);

    const mockUser = { uid: 'u1', email: 'test@example.com' } as User;

    await act(async () => {
      authStateCallback(mockUser);
    });

    const signOutBtn = screen.getByText('sign-out');
    fireEvent.click(signOutBtn);

    expect(mockedLogout).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('adds sticky class when useIsScrolled === true', async () => {
    const { useIsScrolled } = require('@/hooks/use-is-scrolled');
    (useIsScrolled as jest.Mock).mockReturnValue(true);

    const { container } = render(<Header />);

    await act(async () => {
      authStateCallback(null);
    });

    const headerEl = container.querySelector('header')!;
    expect(headerEl.className).toMatch(/sticky/);
  });

  it('calls unsubscribe on component unmount', async () => {
    const { useIsScrolled } = require('@/hooks/use-is-scrolled');
    (useIsScrolled as jest.Mock).mockReturnValue(false);

    mockedAuth.onAuthStateChanged.mockImplementation(() => mockUnsubscribe);

    const { unmount } = render(<Header />);

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it('handles user switching from guest to authenticated', async () => {
    const { useIsScrolled } = require('@/hooks/use-is-scrolled');
    (useIsScrolled as jest.Mock).mockReturnValue(false);

    render(<Header />);

    await act(async () => {
      authStateCallback(null);
    });

    expect(screen.getByText('sign-in')).toBeInTheDocument();
    expect(screen.getByText('sign-up')).toBeInTheDocument();
    expect(screen.queryByText('sign-out')).not.toBeInTheDocument();

    const mockUser = { uid: 'u1', email: 'test@example.com' } as User;
    await act(async () => {
      authStateCallback(mockUser);
    });

    expect(screen.queryByText('sign-in')).not.toBeInTheDocument();
    expect(screen.queryByText('sign-up')).not.toBeInTheDocument();
    expect(screen.getByText('sign-out')).toBeInTheDocument();
  });
});
