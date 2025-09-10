import clsx from 'clsx';
import styles from './button.module.scss';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'removeButton' | 'ghost';
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function Button({
  children,
  className,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled,
  isLoading,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(styles.button, styles[variant], className)}
    >
      {isLoading ? <span className={styles.spinner} /> : children}
    </button>
  );
}
