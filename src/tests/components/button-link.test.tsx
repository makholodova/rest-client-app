import React from 'react';
import { render, screen } from '@testing-library/react';
import ButtonLink from '@/components/ui/button-link/button-link';

jest.mock('./button-link.module.scss', () => ({
  button: 'btn',
  primary: 'primary',
  secondary: 'secondary',
  scaleOnHover: 'scale',
}));

jest.mock('next/link', () => {
  return ({ href, className, children }: any) => (
    <a href={href} className={className} data-testid="link">
      {children}
    </a>
  );
});

describe('ButtonLink', () => {
  it('renders a link with children and href (variant=primary by default)', () => {
    render(<ButtonLink href="/test">Go</ButtonLink>);
    const link = screen.getByTestId('link');
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveClass('btn', 'primary');
    expect(link).toHaveTextContent('Go');
  });

  it('adds the scaleOnHover class', () => {
    render(
      <ButtonLink href="/hover" scaleOnHover>
        Hover
      </ButtonLink>
    );
    expect(screen.getByTestId('link')).toHaveClass('btn', 'primary', 'scale');
  });

  it('applies a different variant and className', () => {
    render(
      <ButtonLink href="/secondary" variant="secondary" className="extra">
        Sec
      </ButtonLink>
    );
    expect(screen.getByTestId('link')).toHaveClass('btn', 'secondary', 'extra');
  });
});
