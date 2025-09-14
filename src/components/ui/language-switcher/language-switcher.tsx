'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import Image from 'next/image';
import styles from './language-switcher.module.scss';
import { LOCALES } from '@/constants/languages';

export default function LanguageSwitcher() {
  const active = useLocale();
  const pathname = usePathname();

  return (
    <div className={styles.wrapper}>
      {LOCALES.map(({ code, label, flag }) => (
        <Link
          key={code}
          href={pathname}
          locale={code}
          className={`${styles.link} ${active === code ? styles.active : styles.inactive}`}
        >
          <div className={styles.imageWrapper}>
            <Image className={styles.image} src={flag} alt={label} fill />
          </div>
        </Link>
      ))}
    </div>
  );
}
