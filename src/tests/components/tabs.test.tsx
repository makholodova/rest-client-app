import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from '@/components/ui/tabs/tabs';

describe('Tabs', () => {
  const tabs = [
    { label: 'Tab1', content: <div data-testid="content-1">Content 1</div> },
    { label: 'Tab2', content: <div data-testid="content-2">Content 2</div> },
    { label: 'Tab3', content: <div data-testid="content-3">Content 3</div> },
  ];

  it('switches tabs on click', () => {
    render(<Tabs tabs={tabs} />);

    expect(screen.getByTestId('content-1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Tab3'));
    expect(screen.getByTestId('content-3')).toBeInTheDocument();
    expect(screen.getByText('Tab3')).toHaveClass('active');
  });
});
