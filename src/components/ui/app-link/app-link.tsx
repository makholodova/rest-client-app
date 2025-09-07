import Link from 'next/link';
import clsx from 'clsx';
import styles from './app-link.module.scss';

type AppLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function AppLink({ href, children, className }: AppLinkProps) {
  return (
    <Link href={href} className={clsx(styles.link, className)}>
      {children}
    </Link>
  );
}
