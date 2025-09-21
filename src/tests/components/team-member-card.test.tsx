import { render, screen } from '@testing-library/react';
import TeamMemberCard from '@/components/ui/team-member-card/team-member-card';
import { TeamMember } from '@/types/team.type';

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
describe('TeamMemberCard', () => {
  const member: TeamMember = {
    nameKey: 'team-member-name',
    roleKey: 'team-member-role',
    bioKey: 'team-member-bio',
    contributionsKeys: ['c1', 'c2'],
    github: 'https://github.com/testuser',
    githubUsername: 'testuser',
  };

  it('renders name, role and bio', () => {
    render(<TeamMemberCard member={member} />);
    expect(screen.getByText('team-member-name')).toBeInTheDocument();
    expect(screen.getByText('team-member-role')).toBeInTheDocument();
    expect(screen.getByText('team-member-bio')).toBeInTheDocument();
  });
});
