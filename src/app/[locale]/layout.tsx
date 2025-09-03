import type { Metadata } from 'next';
import '@/styles/index.scss';

import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';
import Footer from '@/components/layout/footer/footer';
import Header from '@/components/layout/header/header';
import { getMessages } from 'next-intl/server';

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
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body>
          <Header />
          {children}
          <Footer />
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
