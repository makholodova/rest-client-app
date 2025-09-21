'use client';

import React from 'react';
import styles from './error-boundary.module.scss';
import Button from '@/components/ui/button/button';
import Page from '@/components/layout/page/page';

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
        <Page centered>
          <div className={styles.wrapper}>
            <h2 className={styles.title}>{t.title}</h2>
            <p className={styles.text}>
              {error?.message ?? 'Что-то пошло не так'}
            </p>
            <Button onClick={this.reset}>{t.retry}</Button>
          </div>
        </Page>
      );
    }

    return this.props.children;
  }
}
