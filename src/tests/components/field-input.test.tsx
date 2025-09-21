import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { FieldInput } from '@/components/ui/field-input/field-input';

jest.mock('./field-input.module.scss', () => ({
  input: 'input',
  small: 'small',
}));

describe('FieldInput', () => {
  it('renders an input with a default class and a custom className', () => {
    render(<FieldInput className="extra" placeholder="Name" />);
    const input = screen.getByPlaceholderText('Name');
    expect(input).toHaveClass('input', 'extra'); // variant=default
  });

  it('adds the class small when variant="small"', () => {
    render(<FieldInput variant="small" placeholder="Age" />);
    const input = screen.getByPlaceholderText('Age');
    expect(input).toHaveClass('input', 'small');
  });

  it('supports ref and standard props', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FieldInput ref={ref} type="password" disabled />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveAttribute('type', 'password');
    expect(ref.current).toBeDisabled();
  });
});
