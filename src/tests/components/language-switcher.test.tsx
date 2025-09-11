import { render, screen } from '@testing-library/react';
import LanguageSwitcher from '@/components/ui/language-switcher/language-switcher';
import { LOCALES } from '@/constants/languages';

jest.mock('@/i18n/navigation', () => ({
  Link: (props: any) => (
    <a data-testid={`link-${props.locale}`} {...props}>
      {props.children}
    </a>
  ),
  usePathname: () => '/test-path',
}));

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

describe('LanguageSwitcher', () => {
  it('renders links for all locales', () => {
    render(<LanguageSwitcher />);
    LOCALES.forEach(({ code, label, flag }) => {
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
