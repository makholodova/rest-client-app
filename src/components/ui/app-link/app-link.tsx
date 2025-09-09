import Link, { LinkProps } from 'next/link';
import clsx from 'clsx';
import styles from './app-link.module.scss';

type AppLinkProps = LinkProps & {
  target?: string;
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function AppLink({
  href,
  children,
  className,
  target,

  ...props
}: AppLinkProps) {
  return (
    <Link
      target={target}
      href={href}
      className={clsx(styles.link, className)}
      {...props}
    >
      {children}
    </Link>
  );
}
