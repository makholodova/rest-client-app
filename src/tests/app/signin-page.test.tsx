import { render, screen } from '@testing-library/react';
import SignInPage from '@/app/[locale]/signin/page';

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

jest.mock('@/components/ui/app-link/app-link', () => (props: any) => (
  <a data-testid="app-link" href={props.href}>
    {props.children}
  </a>
));
jest.mock('@/components/ui/button/button', () => (props: any) => (
  <button type={props.type} disabled={props.disabled} onClick={props.onClick}>
    {props.children}
  </button>
));
jest.mock('@/components/ui/field-input/field-input', () => ({
  FieldInput: (props: any) => <input data-testid={props.type} {...props} />,
}));
jest.mock('@/components/layout/page/page', () => (props: any) => (
  <div data-testid="page">{props.children}</div>
));

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
    const { useAuthState } = require('react-firebase-hooks/auth');
    useAuthState.mockReturnValue([null, false, null]);

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
