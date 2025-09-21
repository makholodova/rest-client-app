import type { Metadata } from 'next';
import '@/styles/index.scss';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';
import Footer from '@/components/layout/footer/footer';
import Header from '@/components/layout/header/header';
import { getMessages } from 'next-intl/server';
import { ErrorBoundary } from '@/components/layout/error-boundary/error-boundary';
import ToastProvider from '@/components/providers/toast-provider';

export const metadata: Metadata = {
  title: 'REST Client',
  description:
    'Rest Client API helps developers test and send HTTP requests, analyze responses, and streamline API development',
  icons: {
    icon: '/logo.svg',
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <ErrorBoundary locale={locale}>{children}</ErrorBoundary>
          <Footer />
          <ToastProvider />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
