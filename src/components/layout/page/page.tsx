'use client';
import styles from './page.module.scss';
import clsx from 'clsx';
import { useAuthTokenGuard } from '@/hooks/useAuthTokenGuard';

type PageProps = {
  children: React.ReactNode;
  centered?: boolean;
};

export default function Page({ children, centered }: PageProps) {
  useAuthTokenGuard();
  return (
    <main className={clsx(styles.main, centered && styles.centered)}>
      <div className={'container'}>{children}</div>
    </main>
  );
}
