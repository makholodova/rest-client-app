import { AuthUserProvider } from '@/context/authUserContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthUserProvider>{children}</AuthUserProvider>;
}
