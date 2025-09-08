import clsx from 'clsx';
import styles from './button.module.scss';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'removeButton';
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({
  children,
  className,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(styles.button, styles[variant], className)}
    >
      {children}
    </button>
  );
}
