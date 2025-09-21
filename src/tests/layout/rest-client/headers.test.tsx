import { render, screen, fireEvent } from '@testing-library/react';
import Headers from '../../../components/layout/rest-client/tabs/headers/headers';

const addHeader = jest.fn();
const updateHeader = jest.fn();
const removeHeader = jest.fn();
const toggleHeader = jest.fn();

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const dict: Record<string, string> = {
      key: 'Key',
      value: 'Value',
      description: 'Description',
      addButton: 'Add header',
    };
    return dict[key] ?? key;
  },
}));

jest.mock('@/hooks/use-headers', () => ({
  useHeaders: () => ({
    headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
        description: 'json',
        disabled: false,
      },
      { key: 'X-Trace', value: 'abc', description: '', disabled: true },
    ],
    addHeader,
    updateHeader,
    removeHeader,
    toggleHeader,
  }),
}));

jest.mock('@/components/ui/field-input/field-input', () => ({
  FieldInput: ({ value, onChange, placeholder, variant, type, className }) => (
    <input
      data-testid={`fi-${placeholder}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      type={type}
      data-variant={variant}
    />
  ),
}));

jest.mock('@/components/ui/button/button', () => {
  const ButtonMock = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props} />
  );
  (ButtonMock as { displayName?: string }).displayName = 'ButtonMock';
  return ButtonMock;
});

jest.mock('./headers.module.scss', () => ({
  wrapper: 'wrapper',
  headerRow: 'headerRow',
  row: 'row',
  col: 'col',
  checkbox: 'checkbox',
  removeButton: 'removeButton',
  addButton: 'addButton',
}));

describe('Headers', () => {
  beforeEach(() => {
    addHeader.mockClear();
    updateHeader.mockClear();
    removeHeader.mockClear();
    toggleHeader.mockClear();
  });

  it('renders title lines from the store', () => {
    render(<Headers />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    expect(screen.getByDisplayValue('Content-Type')).toBeInTheDocument();
    expect(screen.getByDisplayValue('application/json')).toBeInTheDocument();
    expect(screen.getByDisplayValue('json')).toBeInTheDocument();
  });

  it('clicking on the checkbox calls the toggleHeader with the index', () => {
    render(<Headers />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    expect(toggleHeader).toHaveBeenCalledWith(1);
  });

  it('changing fields calls updateHeader with the correct arguments', () => {
    render(<Headers />);

    fireEvent.change(screen.getByDisplayValue('Content-Type'), {
      target: { value: 'Accept' },
    });
    expect(updateHeader).toHaveBeenCalledWith(0, 'key', 'Accept');
    fireEvent.change(screen.getByDisplayValue('application/json'), {
      target: { value: 'text/plain' },
    });
    expect(updateHeader).toHaveBeenCalledWith(0, 'value', 'text/plain');

    fireEvent.change(screen.getByDisplayValue('json'), {
      target: { value: 'plain text' },
    });
    expect(updateHeader).toHaveBeenCalledWith(0, 'description', 'plain text');
  });

  it('removing and adding a header calls removeHeader and addHeader', () => {
    render(<Headers />);

    const removeButtons = screen.getAllByRole('button', { name: '✕' });
    fireEvent.click(removeButtons[0]);
    expect(removeHeader).toHaveBeenCalledWith(0);

    fireEvent.click(screen.getByText(/\+\s*Add header/i));
    expect(addHeader).toHaveBeenCalled();
  });
});
