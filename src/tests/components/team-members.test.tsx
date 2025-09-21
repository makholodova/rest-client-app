import { render, screen } from '@testing-library/react';
import TeamMembers from '@/components/ui/team-members/team-members';
import { TEAM } from '@/constants/team';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('next/image', () => {
  const NextImageMock = (
    props: React.ImgHTMLAttributes<HTMLImageElement> & { alt: string }
  ) => <img {...props} alt={props.alt} />;

  (NextImageMock as { displayName?: string }).displayName = 'NextImageMock';
  return NextImageMock;
});

describe('TeamMembers', () => {
  it('renders the number of TeamMemberCards', () => {
    render(<TeamMembers />);

    expect(screen.getAllByRole('link', { name: /github/i }).length).toBe(
      TEAM.length
    );
  });
});
