import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CodePanel from '@/components/ui/code-panel/code-panel';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';

jest.mock('use-intl', () => ({
  useTranslations: () => (key: string) =>
    key === 'copyError' ? 'Copy error' : key,
}));
jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock('next/image', () => (props: any) => (
  <img {...props} alt={props.alt} />
));
jest.mock('@monaco-editor/react', () => () => <textarea />);
jest.mock('@monaco-editor/react', () => (props: any) => (
  <textarea
    data-testid="editor"
    value={props.value}
    onChange={(e) => props.onChange?.((e.target as HTMLTextAreaElement).value)}
  />
));

describe('CodePanel', () => {
  beforeEach(() => {
    global.navigator.clipboard = {
      writeText: jest.fn().mockResolvedValue(undefined),
    };
    (toast.error as jest.Mock).mockClear();
    (toast.success as jest.Mock)?.mockClear?.();
  });

  it('renders the header', () => {
    render(<CodePanel text="{}" title="Body" />);
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('calls setText on change', () => {
    const setText = jest.fn();
    render(<CodePanel text="old" setText={setText} />);
    fireEvent.change(screen.getByTestId('editor'), {
      target: { value: 'new' },
    });
    expect(setText).toHaveBeenCalledWith('new');
  });

  it('copies text to the clipboard', async () => {
    render(<CodePanel text="hello" />);
    fireEvent.click(screen.getByRole('button'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello');
  });

  it('raises toast.error on copy error', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(
      new Error('no access')
    );

    render(<CodePanel text="oops" />);
    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
    expect((toast.error as jest.Mock).mock.calls[0][0]).toMatch(
      /Copy error: Error: no access/
    );
  });
});
