import { render, screen } from '@testing-library/react';
import TeamMemberCard from '@/components/ui/team-member-card/team-member-card';
import { TeamMember } from '@/types/team';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt} />;
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

  it('рендерит имя, роль и био через переводы', () => {
    render(<TeamMemberCard member={member} />);
    expect(screen.getByText('team-member-name')).toBeInTheDocument();
    expect(screen.getByText('team-member-role')).toBeInTheDocument();
    expect(screen.getByText('team-member-bio')).toBeInTheDocument();
  });
});
