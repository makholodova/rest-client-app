'use client';
import { useEffect } from 'react';
import { auth, logInWithEmailAndPassword } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../../constants/routes';
import styles from './signin.module.scss';
import { signInSchema, type SignInForm } from '../../../utils/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import AppLink from '@/components/ui/app-link/app-link';

export default function SignInPage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const t = useTranslations('SignIn');
  const tV = useTranslations('Validation');
  const schema = signInSchema(tV);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (loading) return;
    if (user) router.push(ROUTES.HOME);
    if (error) toast.error(t('useEffectErrorMessage'));
  }, [user, loading, router, error, t]);

  const handleSignIn = async (data: SignInForm) => {
    await logInWithEmailAndPassword(data.email, data.password);
  };

  return (
    <div className={styles.wrapper}>
      <form
        onSubmit={handleSubmit(handleSignIn)}
        className={`${styles.formContainer} ${isSubmitting ? styles.formContainerDisabled : ''}`}
      >
        <h3 className={styles.title}>{t('title')}</h3>
        <input
          type="email"
          className={styles.input}
          placeholder={t('email')}
          disabled={isSubmitting}
          {...register('email')}
        />{' '}
        <p className={styles.error}>{errors.email?.message || ''}</p>
        <input
          type="password"
          className={styles.input}
          placeholder={t('password')}
          disabled={isSubmitting}
          {...register('password')}
        />{' '}
        <p className={styles.error}>{errors.password?.message || ''}</p>
        <button
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnDsbl : ''}`}
          type="submit"
          disabled={isSubmitting}
        >
          {t('submitBtn')}{' '}
        </button>{' '}
      </form>
      <div>
        <p className={styles.linkWrapper}>
          {t('linkWrapper')}{' '}
          <AppLink href={ROUTES.SIGN_UP}>{t('registrationLink')}</AppLink>
        </p>
      </div>
    </div>
  );
}
