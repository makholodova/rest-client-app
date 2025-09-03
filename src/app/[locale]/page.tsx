'use client';

import UserGreeting from '@/components/ui/user-greeting/user-greeting';
import GuestGreeting from '@/components/ui/guest-greeting/guest-greeting';
import { useState } from 'react';
export default function Home() {
  const [user] = useState(true); //временно пока нет зарегистрированного пользователя

  return (
    <div className="pageHome container">
      {user ? <UserGreeting name={'Marina'} /> : <GuestGreeting />}
    </div>
  );
}
