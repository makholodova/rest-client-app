import styles from './logo.module.scss';
import Link from 'next/link';
import { ROUTES } from '@/routes';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Logo() {
  const t = useTranslations('Header');
  return (
    <Link href={ROUTES.HOME} className={styles.logo}>
      <Image
        src="/logo.svg"
        alt={t('logo')}
        width={25}
        height={17}
        className={styles.logoIcon}
      />
      {t('logo')}
    </Link>
  );
}
