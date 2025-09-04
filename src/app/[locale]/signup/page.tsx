'use client';
import { useEffect } from 'react';
import { auth, registerWithEmailAndPassword } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../../constants/routes';
import Link from 'next/link';
import { signUpSchema, type SignUpForm } from '../../../utils/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from '../signin/signin.module.scss';

export default function SignUpPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });
  const onSubmit = async (data: SignUpForm) => {
    await registerWithEmailAndPassword(data.name, data.email, data.password);
  };

  useEffect(() => {
    if (loading) return;
    if (user) router.push(ROUTES.HOME);
  }, [user, loading, router]);

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
        <input
          type="text"
          className={styles.input}
          placeholder="Full Name"
          {...register('name')}
        />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}
        <input
          type="text"
          className={styles.input}
          placeholder="E-mail Address"
          {...register('email')}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        <input
          type="password"
          className={styles.input}
          placeholder="Password"
          {...register('password')}
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}
        <input
          type="password"
          className={styles.input}
          placeholder="Confirm Password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className={styles.error}>{errors.confirmPassword.message}</p>
        )}
        <button className={styles.submitBtn} type="submit">
          Sign Up
        </button>{' '}
      </form>
      <div className={styles.linkWrapper}>
        <Link href={ROUTES.SIGN_IN} className={styles.registerLink}>
          Sign In
        </Link>
      </div>
    </div>
  );
}
