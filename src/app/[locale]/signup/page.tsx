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
import { useTranslations } from 'next-intl';

export default function SignUpPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const t = useTranslations('SignUp');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${styles.formContainer} ${isSubmitting ? styles.formContainerDisabled : ''}`}
      >
        <h3 className={styles.title}>{t('title')}</h3>
        <input
          type="text"
          className={styles.input}
          placeholder={t('name')}
          disabled={isSubmitting}
          {...register('name')}
        />
        <p className={styles.error}>{errors.name?.message || ''}</p>
        <input
          type="email"
          className={styles.input}
          placeholder={t('email')}
          disabled={isSubmitting}
          {...register('email')}
        />
        <p className={styles.error}>{errors.email?.message || ''}</p>{' '}
        <input
          type="password"
          className={styles.input}
          placeholder={t('password')}
          disabled={isSubmitting}
          {...register('password')}
        />
        <p className={styles.error}>{errors.password?.message || ''}</p>
        <input
          type="password"
          className={styles.input}
          placeholder={t('passwordConfirm')}
          disabled={isSubmitting}
          {...register('confirmPassword')}
        />
        <p className={styles.error}>{errors.confirmPassword?.message || ''}</p>
        <button
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnDsbl : ''}`}
          type="submit"
        >
          {t('submitBtn')}{' '}
        </button>{' '}
      </form>
      <div>
        <p className={styles.linkWrapper}>
          {' '}
          {t('linkWrapper')}{' '}
          <Link href={ROUTES.SIGN_IN} className={styles.registerLink}>
            {t('signInLink')}{' '}
          </Link>
        </p>
      </div>
    </div>
  );
}
