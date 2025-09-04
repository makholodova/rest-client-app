'use client';
import { useState, useEffect } from 'react';
import { auth, registerWithEmailAndPassword } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../../constants/routes';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const register = () => {
    if (!name) alert('Please enter name');
    registerWithEmailAndPassword(name, email, password);
  };

  useEffect(() => {
    if (loading) return;
    if (user) router.push(ROUTES.HOME);
  }, [user, loading, router]);

  return (
    <div className="register">
      <div className="register_container">
        <input
          type="text"
          className="register_textBox"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />{' '}
        <input
          type="text"
          className="register_textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="register_textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="register_btn" onClick={register}>
          Sign Up
        </button>
      </div>
      <div>
        <p className="register__signup-text">
          <Link href={ROUTES.SIGN_IN} className="register_link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
