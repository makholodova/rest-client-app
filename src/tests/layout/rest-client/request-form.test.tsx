import { render, screen, fireEvent } from '@testing-library/react';
import RequestForm from '@/components/layout/rest-client/request-form/request-form';

const setMethodMock = jest.fn();
const onSendRequestMock = jest.fn();

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) =>
    key === 'RestClient' ? (k: string) => (k === 'send' ? 'Send' : k) : key,
}));

jest.mock('@/hooks/use-api-request', () => ({
  useApiRequest: () => ({
    method: 'GET',
    url: 'https://api.example.com/users',
    setMethod: setMethodMock,
    onSendRequest: onSendRequestMock,
  }),
}));

jest.mock('@/components/ui/field-input/field-input', () => ({
  FieldInput: ({ value, onChange, placeholder, className }) => (
    <input
      data-testid="url-input"
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
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

jest.mock('./request-form.module.scss', () => ({
  wrapper: 'wrapper',
  selector: 'selector',
  url: 'url',
  sendBtn: 'sendBtn',
}));

describe('RequestForm', () => {
  beforeEach(() => {
    setMethodMock.mockClear();
    onSendRequestMock.mockClear();
  });

  it('changes method and calls setMethod', () => {
    render(<RequestForm />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'POST' } });
    expect(setMethodMock).toHaveBeenCalledWith('POST');
  });

  it('uses initial url from store and updates on typing', () => {
    render(<RequestForm />);
    const input = screen.getByTestId('url-input') as HTMLInputElement;
    expect(input.value).toBe('https://api.example.com/users');

    fireEvent.change(input, {
      target: { value: 'https://api.example.com/pets' },
    });
    expect(input.value).toBe('https://api.example.com/pets');
  });
});
