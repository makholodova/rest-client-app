import styles from './page.module.scss';
import clsx from 'clsx';

type PageProps = {
  children: React.ReactNode;
  centered?: boolean;
};

export default function Page({ children, centered }: PageProps) {
  return (
    <main className={clsx(styles.main, centered && styles.centered)}>
      <div className={'container'}>{children}</div>
    </main>
  );
}
