export interface AuthUser {
  uid: string;
  email: string | null;
}

export interface AuthUserContextType {
  authUser: AuthUser | null;
  loading: boolean;
}
