import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email address'),
    password: z
      .string()
      .min(6, { message: 'Password is required, at least 6 characters' })
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
    confirmPassword: z.string().min(6, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type SignUpForm = z.infer<typeof signUpSchema>;
