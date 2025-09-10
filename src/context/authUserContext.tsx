import { createContext, useContext, ReactNode } from 'react';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import { AuthUserContextType } from '../types/interfaces';

const authUserContext = createContext<AuthUserContextType>({
  authUser: null,
  loading: true,
});

export function AuthUserProvider({ children }: { children: ReactNode }) {
  const auth = useFirebaseAuth();
  return (
    <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>
  );
}

export const useAuth = () => useContext(authUserContext);
