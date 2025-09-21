import { z } from 'zod';

export const signUpSchema = (tV: (key: string) => string) =>
  z
    .object({
      name: z
        .string()
        .min(1, { message: tV('name.required') })
        .regex(/^[A-Za-zА-Яа-яЁё\s.'-]+$/, { message: tV('name.regex') }),
      email: z
        .string()
        .min(1, { message: tV('email.required') })
        .email({ message: tV('email.invalid') }),
      password: z
        .string()
        .min(12, { message: tV('password.min') })
        .regex(/[a-z]/, { message: tV('password.lowercase') })
        .regex(/[A-Z]/, { message: tV('password.uppercase') })
        .regex(/[0-9]/, { message: tV('password.digit') })
        .regex(/[^A-Za-z0-9]/, { message: tV('password.special') }),
      confirmPassword: z
        .string()
        .min(12, { message: tV('confirmPassword.required') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: tV('confirmPassword.match'),
      path: ['confirmPassword'],
    });

export type SignUpForm = z.infer<ReturnType<typeof signUpSchema>>;

export const signInSchema = (tV: (key: string) => string) =>
  signUpSchema(tV).pick({
    email: true,
    password: true,
  });
export type SignInForm = z.infer<ReturnType<typeof signInSchema>>;
