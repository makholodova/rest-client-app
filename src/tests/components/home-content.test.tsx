import { render, screen } from '@testing-library/react';
import HomeContent from '@/components/ui/home-content/home-content';

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

jest.mock('@/components/ui/team-members/team-members', () => {
  const TeamMembersMock: React.FC = () => <div data-testid="team-members" />;
  (TeamMembersMock as { displayName?: string }).displayName = 'TeamMembersMock';
  return TeamMembersMock;
});

describe('HomeContent', () => {
  it('renders projectText, courseTitle, courseText and TeamMembers', () => {
    render(<HomeContent />);

    expect(screen.getByText('projectText')).toBeInTheDocument();
    expect(screen.getByText('courseTitle')).toBeInTheDocument();
    expect(screen.getByText('courseText')).toBeInTheDocument();

    expect(screen.getByTestId('team-members')).toBeInTheDocument();

    expect(screen.getByAltText('RS School')).toBeInTheDocument();
  });
});
