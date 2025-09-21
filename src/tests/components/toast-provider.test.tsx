import React from 'react';
import { render, screen } from '@testing-library/react';
import ToastProvider from '@/components/providers/toast-provider';

jest.mock('react-toastify/dist/ReactToastify.css', () => ({}), {
  virtual: true,
});

jest.mock('react-toastify', () => ({
  ToastContainer: (props: Record<string, unknown>) => (
    <div data-testid="toast" data-props={JSON.stringify(props)} />
  ),
}));

describe('ToastProvider', () => {
  it('renders a ToastContainer with the expected props', () => {
    render(<ToastProvider />);

    const el = screen.getByTestId('toast');
    const props = JSON.parse(el.getAttribute('data-props') || '{}');

    expect(props).toMatchObject({
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      newestOnTop: false,
      closeOnClick: true,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      theme: 'light',
    });
  });
});
