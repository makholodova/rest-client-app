import { render } from '@testing-library/react';
import CircleLoader from '@/components/ui/circle-loader/circle-loader';

describe('CircleLoader', () => {
  it('renders div with class', () => {
    const { container } = render(<CircleLoader />);
    expect(container.firstChild).toHaveClass('circleLoader');
  });
});
