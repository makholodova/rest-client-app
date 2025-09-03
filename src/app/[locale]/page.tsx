'use client';

import UserGreeting from '@/components/ui/user-greeting/user-greeting';
import GuestGreeting from '@/components/ui/guest-greeting/guest-greeting';
import { useState } from 'react';
export default function Home() {
  const [user] = useState(false); //временно

  return (
    <div className="pageHome container">
      {user ? <UserGreeting name={'Marina'} /> : <GuestGreeting />}
    </div>
  );
}
