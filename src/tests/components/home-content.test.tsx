import { render, screen } from '@testing-library/react';
import HomeContent from '@/components/ui/home-content/home-content';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

jest.mock('@/components/ui/team-members/team-members', () => () => (
  <div data-testid="team-members" />
));

describe('HomeContent', () => {
  it('рендерит projectText, courseTitle, courseText и TeamMembers', () => {
    render(<HomeContent />);

    expect(screen.getByText('projectText')).toBeInTheDocument();
    expect(screen.getByText('courseTitle')).toBeInTheDocument();
    expect(screen.getByText('courseText')).toBeInTheDocument();

    expect(screen.getByTestId('team-members')).toBeInTheDocument();

    expect(screen.getByAltText('RS School')).toBeInTheDocument();
  });
});
