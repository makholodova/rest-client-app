import styles from './footer.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FOOTER_INFO, DEVELOPERS } from '@/constants/footer';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerWrapper} container`}>
        <div className={styles.footerLinks}>
          {DEVELOPERS.map((item) => (
            <Link
              key={item.nameKey}
              href={item.github}
              target="_blank"
              aria-label="Github"
              className={styles.footerLink}
            >
              <Image
                src={FOOTER_INFO.logoGithub}
                alt="GitHub"
                width={18}
                height={18}
              />
              <span className={styles.footerLinkText}>{t(item.nameKey)}</span>
            </Link>
          ))}
        </div>

        <div className={styles.footerYear}>{FOOTER_INFO.year}</div>

        <Link
          href={FOOTER_INFO.rsSchool}
          target="_blank"
          aria-label="RS_Shool"
          className={styles.footerRsSchool}
        >
          <Image
            src={FOOTER_INFO.logoRsSchool}
            alt="RS School"
            width={65}
            height={24}
          />
        </Link>
      </div>
    </footer>
  );
}
