'use client';

import UserGreeting from '@/components/ui/user-greeting/user-greeting';
import GuestGreeting from '@/components/ui/guest-greeting/guest-greeting';
import TriggerErrorButton from '@/components/ui/error/trigger-erro-button';
import HomeContent from '@/components/ui/home-content/home-content';
import Page from '@/components/layout/page/page';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

export default function Home() {
  const [user] = useAuthState(auth);

  return (
    <Page>
      {user ? <UserGreeting name={user.displayName} /> : <GuestGreeting />}
      <TriggerErrorButton />
      <HomeContent />
    </Page>
  );
}
