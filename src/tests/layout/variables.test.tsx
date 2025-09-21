import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Variables from '@/components/layout/variables/variables';

jest.mock('./variables.module.scss', () => ({
  wrapper: 'wrapper',
  title: 'title',
  addVar: 'addVar',
  input: 'input',
  list: 'list',
  listItem: 'listItem',
  varKey: 'varKey',
  varValue: 'varValue',
  clear: 'clear',
  noVariables: 'noVariables',
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k, // t('key') -> 'key'
}));

jest.mock('@/components/layout/page/page', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="page">{children}</div>,
}));
jest.mock('@/components/ui/button/button', () => ({
  __esModule: true,
  default: ({ children, ...props }) => <button {...props}>{children}</button>,
}));
jest.mock('@/components/ui/field-input/field-input', () => ({
  __esModule: true,
  FieldInput: ({ onChange, ...props }) => (
    <input data-testid={props.placeholder} onChange={onChange} {...props} />
  ),
}));

jest.mock('next/image', () => {
  const NextImageMock = (props: { alt: string }) => <img alt={props.alt} />;
  (NextImageMock as { displayName?: string }).displayName = 'NextImageMock';
  return NextImageMock;
});

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

const useAuthStateMock = jest.fn();
jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: (...args) => useAuthStateMock(...args),
}));
jest.mock('@/firebase', () => ({ auth: {} }));

const toastErrorMock = jest.fn();
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn((...args) => toastErrorMock(...args)) },
}));

const addMock = jest.fn();
const removeMock = jest.fn();
const clearMock = jest.fn();
let useVariablesState = {
  entries: [] as [string, string][],
  has: false,
  add: addMock,
  remove: removeMock,
  clear: clearMock,
};
jest.mock('@/hooks/use-variables', () => ({
  useVariables: () => useVariablesState,
}));

describe('Variables page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStateMock.mockReturnValue([null, false, null]);
    useVariablesState = {
      entries: [],
      has: false,
      add: addMock,
      remove: removeMock,
      clear: clearMock,
    };
    addMock.mockReset();
    removeMock.mockReset();
    clearMock.mockReset();
  });

  it('shows a toast when auth fails', async () => {
    useAuthStateMock.mockReturnValue([{ uid: 'u1' }, false, new Error('x')]);
    render(<Variables />);
    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('useEffectErrorMessage');
    });
  });

  it('renders a placeholder when there are no variables (has=false)', () => {
    useAuthStateMock.mockReturnValue([{ uid: 'u1' }, false, null]);
    render(<Variables />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'noVariables'
    );
  });

  it('renders a list and allows deleting and clearing', () => {
    useAuthStateMock.mockReturnValue([{ uid: 'u1' }, false, null]);
    useVariablesState.has = true;
    useVariablesState.entries = [
      ['API_KEY', '123'],
      ['USER', 'john'],
    ];
    render(<Variables />);

    expect(screen.getByText('API_KEY')).toBeInTheDocument();
    expect(screen.getByText('john')).toBeInTheDocument();

    const removeButtons = screen.getAllByRole('button', { name: 'Close' });
    removeButtons[0].click();
    expect(removeMock).toHaveBeenCalledWith('API_KEY');

    const clearBtn = screen.getByRole('button', { name: 'clearBtn' });
    expect(clearBtn).toBeEnabled();
    clearBtn.click();
    expect(clearMock).toHaveBeenCalled();
  });
  it('adds a variable and clears the fields on success', () => {
    useAuthStateMock.mockReturnValue([{ uid: 'u1' }, false, null]);
    addMock.mockReturnValue(true);
    render(<Variables />);

    const addBtn = screen.getByRole('button', { name: '+' });
    expect(addBtn).toBeDisabled();

    const keyInput = screen.getByTestId('key');
    const valueInput = screen.getByTestId('value');

    fireEvent.change(keyInput, { target: { value: 'NAME' } });
    fireEvent.change(valueInput, { target: { value: 'John' } });

    expect(addBtn).toBeEnabled();

    fireEvent.click(addBtn);
    expect(addMock).toHaveBeenCalledWith('NAME', 'John');

    expect((keyInput as HTMLInputElement).value).toBe('');
    expect((valueInput as HTMLInputElement).value).toBe('');
  });

  it('does nщt spin side effects until loading=true', () => {
    useAuthStateMock.mockReturnValue([null, true, null]);
    render(<Variables />);

    expect(pushMock).not.toHaveBeenCalled();
    expect(toastErrorMock).not.toHaveBeenCalled();
  });
});
