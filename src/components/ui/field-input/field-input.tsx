import styles from './field-input.module.scss';
import { forwardRef, InputHTMLAttributes } from 'react';

type FieldInputProps = InputHTMLAttributes<HTMLInputElement>;

export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input ref={ref} className={`${styles.input} ${className}`} {...props} />
    );
  }
);

FieldInput.displayName = 'FieldInput';
