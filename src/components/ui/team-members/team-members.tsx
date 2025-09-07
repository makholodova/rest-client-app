import styles from './team-members.module.scss';
import { TEAM } from '@/constants/team';
import TeamMemberCard from '@/components/ui/team-member-card/team-member-card';

export default function TeamMembers() {
  return (
    <div className={styles.list}>
      {TEAM.map((member, index) => (
        <TeamMemberCard key={index} member={member} />
      ))}
    </div>
  );
}
