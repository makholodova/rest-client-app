'use client';
import { useEffect } from 'react';
import { auth, logInWithEmailAndPassword } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../../constants/routes';
import Link from 'next/link';
import styles from './signin.module.scss';
import { signInSchema, type SignInForm } from '../../../utils/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

export default function SignInPage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (loading) return;
    if (user) router.push(ROUTES.HOME);
    if (error)
      toast.error('Please, try later or sign in in case you are a new user.');
  }, [user, loading, router, error]);

  const handleSignIn = async (data: SignInForm) => {
    await logInWithEmailAndPassword(data.email, data.password);
  };

  return (
    <div className={styles.wrapper}>
      <form
        onSubmit={handleSubmit(handleSignIn)}
        className={`${styles.formContainer} ${isSubmitting ? styles.formContainerDisabled : ''}`}
      >
        <h3 className={styles.title}>Sign in</h3>
        <input
          type="email"
          className={styles.input}
          placeholder="E-mail Address"
          disabled={isSubmitting}
          {...register('email')}
        />{' '}
        <p className={styles.error}>{errors.email?.message || ''}</p>
        <input
          type="password"
          className={styles.input}
          placeholder="Password"
          disabled={isSubmitting}
          {...register('password')}
        />{' '}
        <p className={styles.error}>{errors.password?.message || ''}</p>
        <button
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnDsbl : ''}`}
          type="submit"
          disabled={isSubmitting}
        >
          Sign In
        </button>{' '}
      </form>
      <div>
        <p className={styles.linkWrapper}>
          Do not have an account?{' '}
          <Link href={ROUTES.SIGN_UP} className={styles.loginLink}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
