import type {
  PropsWithChildren,
  MouseEventHandler,
  InputHTMLAttributes,
} from 'react';
import { render, screen } from '@testing-library/react';
import SignInPage from '@/app/[locale]/signin/page';
import { useAuthState } from 'react-firebase-hooks/auth';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/firebase', () => ({
  auth: {},
  logInWithEmailAndPassword: jest.fn(),
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

type AppLinkProps = PropsWithChildren<{ href: string }>;

type ButtonProps = PropsWithChildren<{
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}>;

type FieldInputProps = InputHTMLAttributes<HTMLInputElement> & {
  type?: string;
};

type PageProps = PropsWithChildren<unknown>;

jest.mock('@/components/ui/app-link/app-link', () => {
  const AppLinkMock = (props: AppLinkProps) => (
    <a data-testid="app-link" href={props.href}>
      {props.children}
    </a>
  );
  (AppLinkMock as { displayName?: string }).displayName = 'AppLinkMock';
  return AppLinkMock;
});

jest.mock('@/components/ui/button/button', () => {
  const ButtonMock = (props: ButtonProps) => (
    <button type={props.type} disabled={props.disabled} onClick={props.onClick}>
      {props.children}
    </button>
  );
  (ButtonMock as { displayName?: string }).displayName = 'ButtonMock';
  return ButtonMock;
});

jest.mock('@/components/ui/field-input/field-input', () => {
  const FieldInput = (props: FieldInputProps) => (
    <input data-testid={props.type} {...props} />
  );
  (FieldInput as { displayName?: string }).displayName = 'FieldInputMock';
  return { FieldInput };
});

jest.mock('@/components/layout/page/page', () => {
  const PageMock = (props: PageProps) => (
    <div data-testid="page">{props.children}</div>
  );
  (PageMock as { displayName?: string }).displayName = 'PageMock';
  return PageMock;
});

jest.mock('./signin.module.scss', () => ({
  content: 'content',
  formContainer: 'formContainer',
  title: 'title',
  error: 'error',
  linkWrapper: 'linkWrapper',
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

describe('SignInPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pushMock.mockClear();
  });

  it('renders basic form elements', () => {
    (useAuthState as unknown as jest.Mock).mockReturnValue([null, false, null]);

    render(<SignInPage />);

    expect(screen.getByTestId('page')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'title'
    );
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'submitBtn' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('app-link')).toHaveAttribute('href', '/signup');
  });
});
