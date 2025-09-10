import styles from './field-input.module.scss';
import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type FieldInputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: 'default' | 'small';
};

export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(styles.input, className, {
          [styles.small]: variant === 'small',
        })}
        {...props}
      />
    );
  }
);

FieldInput.displayName = 'FieldInput';
