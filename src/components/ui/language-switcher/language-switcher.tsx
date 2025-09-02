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
          prefetch={false}
          className={`${styles.link} ${active === code ? styles.active : styles.inactive}`}
        >
          <Image
            className={styles.image}
            priority={false}
            src={flag}
            alt={label}
            width={48}
            height={36}
          />
        </Link>
      ))}
    </div>
  );
}
