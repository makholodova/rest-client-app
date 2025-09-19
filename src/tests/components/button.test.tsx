import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/button/button';

jest.mock('./button.module.scss', () => ({
  button: 'btn',
  primary: 'primary',
  spinner: 'spinner',
}));

describe('Button', () => {
  it('renders children and type by default = button', () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole('button', { name: 'Click me' });
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn).toHaveClass('btn', 'primary');
  });

  it('renders spinner instead of children when isLoading', () => {
    render(<Button isLoading>Load</Button>);
    const btn = screen.getByRole('button');
    expect(btn.querySelector('.spinner')).toBeInTheDocument();
    expect(btn).not.toHaveTextContent('Load');
  });

  it('calls onClick, but not when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Press</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Press' }));
    expect(handleClick).toHaveBeenCalledTimes(1);

    handleClick.mockClear();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
