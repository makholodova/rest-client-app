'use client';

import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  locale: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { locale } = this.props;

    if (hasError) {
      const t =
        locale === 'ru'
          ? { title: 'Ошибка', retry: 'Попробовать снова' }
          : { title: 'Error', retry: 'Try again' };

      return (
        <div className="container">
          <h2>{t.title}</h2>
          <p>{error?.message ?? 'Что-то пошло не так'}</p>
          <button onClick={this.reset}>{t.retry}</button>
        </div>
      );
    }

    return this.props.children;
  }
}
