import styles from './home-content.module.scss';
import TeamMembers from '@/components/ui/team-members/team-members';

export default function HomeContent() {
  return (
    <section className={styles.wrapper}>
      <TeamMembers />
    </section>
  );
}
