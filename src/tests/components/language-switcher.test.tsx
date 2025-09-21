import { render, screen } from '@testing-library/react';
import LanguageSwitcher from '@/components/ui/language-switcher/language-switcher';
import { LOCALES } from '@/constants/languages';

jest.mock('@/i18n/navigation', () => ({
  Link: (props) => (
    <a data-testid={`link-${props.locale}`} {...props}>
      {props.children}
    </a>
  ),
  usePathname: () => '/test-path',
}));

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

jest.mock('next/image', () => {
  const NextImageMock = (
    props: Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'fill'> & {
      alt?: string;
      fill?: boolean;
    }
  ) => {
    const { fill: _fill, ...rest } = props;
    return <img {...rest} alt={props.alt || ''} />;
  };

  (NextImageMock as { displayName?: string }).displayName = 'NextImageMock';
  return NextImageMock;
});

describe('LanguageSwitcher', () => {
  it('renders links for all locales', () => {
    render(<LanguageSwitcher />);
    LOCALES.forEach(({ code }) => {
      const link = screen.getByTestId(`link-${code}`);
      expect(link).toBeInTheDocument();

      if (code === 'en') {
        expect(link.className).toMatch(/active/);
      } else {
        expect(link.className).toMatch(/inactive/);
      }
    });
  });
});
