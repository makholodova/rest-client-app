import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .regex(
        /^[A-Za-zА-Яа-яЁё\s.'-]+$/,
        'Name should contain only letters, you can add your full name or short'
      ),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(12, { message: 'Password is required, at least 12 characters' })
      .regex(/[a-z]/, {
        message: 'Password should contain at least one lowercase',
      })
      .regex(/[A-Z]/, {
        message: 'Password should contain at least one uppercase',
      })
      .regex(/[0-9]/, {
        message: 'Password should contain at least one digit',
      })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Password should contain at least one special char',
      }),
    confirmPassword: z.string().min(12, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type SignUpForm = z.infer<typeof signUpSchema>;

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true,
});
export type SignInForm = z.infer<typeof signInSchema>;
