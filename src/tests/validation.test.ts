import { signInSchema, signUpSchema } from '@/utils/validation';

const tV = (k: string) => k;

describe('signUpSchema', () => {
  const schema = signUpSchema(tV);
  it('a valid object is validated', () => {
    const ok = schema.parse({
      name: "John O'Neil",
      email: 'john@example.com',
      password: 'Aa12345678!@',
      confirmPassword: 'Aa12345678!@',
    });
    expect(ok.email).toBe('john@example.com');
  });
});

describe('signInSchema', () => {
  const schema = signInSchema(tV);
  it('email/password errors are proxied from the base scheme', () => {
    const res = schema.safeParse({ email: '', password: 'Aa12345678!@' });
    expect(res.success).toBe(false);
  });
});
