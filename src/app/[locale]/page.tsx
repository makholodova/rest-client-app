'use client';

import UserGreeting from '@/components/ui/user-greeting/user-greeting';
import GuestGreeting from '@/components/ui/guest-greeting/guest-greeting';
import TriggerErrorButton from '@/components/ui/error/trigger-erro-button';
import HomeContent from '@/components/ui/home-content/home-content';
import Page from '@/components/layout/page/page';
import { useAuth } from '@/context/authUserContext';

export default function Home() {
  const { authUser } = useAuth();

  return (
    <Page>
      {authUser ? <UserGreeting name={authUser.name} /> : <GuestGreeting />}
      <TriggerErrorButton />
      <HomeContent />
    </Page>
  );
}
