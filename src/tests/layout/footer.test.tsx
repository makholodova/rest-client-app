import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/footer/footer';

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn().mockResolvedValue((key: string) => key),
}));

jest.mock('next/image', () => {
  const NextImageMock = (
    props: { alt: string } & React.ImgHTMLAttributes<HTMLImageElement>
  ) => <img {...props} alt={props.alt} />;

  (NextImageMock as { displayName?: string }).displayName = 'NextImageMock';

  return NextImageMock;
});

describe('Footer', () => {
  it('renders year', async () => {
    render(await Footer());
    expect(screen.getByText('2025')).toBeInTheDocument();
  });

  it('renders developer links', async () => {
    render(await Footer());
    const githubLinks = screen.getAllByRole('link', { name: 'Github' });
    expect(githubLinks.length).toBeGreaterThan(0);
  });

  it('renders a link to RS School', async () => {
    render(await Footer());
    expect(screen.getByRole('link', { name: 'RS_Shool' })).toBeInTheDocument();
  });
});
