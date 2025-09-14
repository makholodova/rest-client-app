'use client';
import { useEffect } from 'react';
import { auth, logInWithEmailAndPassword } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

import styles from './signin.module.scss';
import { signInSchema, type SignInForm } from '@/utils/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import AppLink from '@/components/ui/app-link/app-link';
import { ROUTES } from '@/constants/routes';
import Button from '@/components/ui/button/button';
import { FieldInput } from '@/components/ui/field-input/field-input';
import Page from '@/components/layout/page/page';

export default function SignInPage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const t = useTranslations('SignIn');
  const tV = useTranslations('Validation');
  const schema = signInSchema(tV);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
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
    <Page>
      <div className={styles.content}>
        <form
          onSubmit={handleSubmit(handleSignIn)}
          className={styles.formContainer}
        >
          <h2 className={styles.title}>{t('title')}</h2>
          <FieldInput
            type="email"
            placeholder={t('email')}
            {...register('email')}
            disabled={isSubmitting}
          />
          <p className={styles.error}>{errors.email?.message || ''}</p>
          <FieldInput
            type="password"
            placeholder={t('password')}
            {...register('password')}
            disabled={isSubmitting}
          />
          <p className={styles.error}>{errors.password?.message || ''}</p>
          <Button
            isLoading={isSubmitting}
            disabled={!isValid || isSubmitting}
            type={'submit'}
          >
            {t('submitBtn')}
          </Button>
        </form>

        <div>
          <p className={styles.linkWrapper}>
            {t('linkWrapper')}{' '}
            <AppLink href={ROUTES.SIGN_UP}>{t('registrationLink')}</AppLink>
          </p>
        </div>
      </div>
    </Page>
  );
}
