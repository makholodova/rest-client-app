import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import type { User } from 'firebase/auth';
import { onAuthStateChanged as _onAuthStateChanged } from 'firebase/auth';
import { AuthUser } from '../types/interfaces';

const formatAuthUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  name: user.displayName,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState: User | null) => {
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);
    setLoading(false);
  };

  const onAuthStateChanged = (cb: (user: User | null) => void) => {
    return _onAuthStateChanged(auth, cb);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
  };
}
