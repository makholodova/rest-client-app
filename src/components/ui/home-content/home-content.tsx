import styles from './home-content.module.scss';
import TeamMembers from '@/components/ui/team-members/team-members';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function HomeContent() {
  const t = useTranslations('HomePage');
  return (
    <section className={styles.wrapper}>
      <div className={styles.project}>
        <p className={styles.description}>{t('projectText')}</p>
      </div>

      <TeamMembers />

      <div className={styles.course}>
        <Image src="/pana.png" alt=" RS School" width={307} height={302} />
        <div className={styles.courseContent}>
          <h2 className={styles.title}>{t('courseTitle')}</h2>
          <p className={styles.description}>{t('courseText')}</p>
        </div>
      </div>
    </section>
  );
}
