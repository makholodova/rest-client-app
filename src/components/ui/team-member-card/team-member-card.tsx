import styles from './team-member-card.module.scss';
import { useTranslations } from 'next-intl';
import { TeamMember } from '@/types/team.type';
import Image from 'next/image';
import AppLink from '@/components/ui/app-link/app-link';

type TeamMemberCardProps = {
  member: TeamMember;
};
export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const t = useTranslations('Teams');
  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{t(member.nameKey)}</h3>
      <p className={styles.role}>{t(member.roleKey)}</p>

      <AppLink className={styles.github} href={member.github} target="_blank">
        <Image src="/icon-github.svg" alt="GitHub" width={15} height={15} />
        <span>{member.githubUsername}</span>
      </AppLink>
      <p className={styles.bio}>{t(member.bioKey)}</p>
      <ul className={styles.contributions}>
        {member.contributionsKeys.map((key, idx) => (
          <li key={idx}>{t(key)}</li>
        ))}
      </ul>
    </div>
  );
}
