import { render, screen, fireEvent } from '@testing-library/react';
import CodeGenerator from '../../../components/layout/rest-client/tabs/code-generator/code-generator';
const setCode = jest.fn();
const handleLanguageChange = jest.fn();

jest.mock('@/hooks/use-code-generator', () => ({
  useCodeGenerator: () => ({
    code: 'initial code',
    setCode,
    language: 'javascript',
    value: 'js|fetch',
    supportedLanguages: [
      {
        key: 'js',
        label: 'JavaScript',
        variants: [{ key: 'fetch' }, { key: 'axios' }],
      },
      {
        key: 'python',
        label: 'Python',
        variants: [{ key: 'requests' }],
      },
    ],
    handleLanguageChange,
  }),
}));

jest.mock('@/components/ui/code-panel/code-panel', () => (props: any) => (
  <div data-testid="code-panel">
    <div data-testid="cp-language">{props.language}</div>
    <textarea
      data-testid="cp-input"
      value={props.text}
      onChange={(e) => props.setText?.(e.target.value)}
    />
  </div>
));

jest.mock('./code-generator.module.scss', () => ({
  wrapper: 'wrapper',
  selector: 'selector',
}));

describe('CodeGenerator', () => {
  beforeEach(() => {
    setCode.mockClear();
    handleLanguageChange.mockClear();
  });

  it('renders language variants and subvariants', () => {
    render(<CodeGenerator />);
    expect(
      screen.getByRole('option', { name: 'JavaScript | fetch' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'JavaScript | axios' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Python | requests' })
    ).toBeInTheDocument();

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('js|fetch');
  });

  it('changing the language causes', () => {
    render(<CodeGenerator />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'python|requests' } });
    expect(handleLanguageChange).toHaveBeenCalled();
  });

  it('passes props to CodePanel and setCode is called when the text changes', () => {
    render(<CodeGenerator />);

    expect(screen.getByTestId('cp-language')).toHaveTextContent('javascript');

    fireEvent.change(screen.getByTestId('cp-input'), {
      target: { value: 'new code' },
    });
    expect(setCode).toHaveBeenCalledWith('new code');
  });
});
