'use client';
import { useState, useEffect } from 'react';
import { auth, logInWithEmailAndPassword } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../../constants/routes';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) router.push(ROUTES.HOME);
    if (error)
      alert('Please, try later or sign in in case you are a new user.');
  }, [user, loading, router, error]);

  const handleSignIn = async () => {
    await logInWithEmailAndPassword(email, password);
  };

  return (
    <div className="login">
      <div className="login_container">
        <input
          type="text"
          className="login_textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login_textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="login_btn" onClick={handleSignIn}>
          Sign In
        </button>
      </div>
      <div>
        <p className="login_signup-text">
          <Link href={ROUTES.SIGN_UP} className="login_link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
