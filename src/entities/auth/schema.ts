import { z } from 'zod';
import { Roles, passwordLength } from './constants';

export const AuthSchema = z.object({
  email: z.string().email().trim(),
  role: z.enum([Roles.ADMIN, Roles.USER]),
  refreshTokens: z.array(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().trim().min(passwordLength),
  firstname: z.string().trim(),
  lastname: z.string().trim(),
});

export const LoginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a valid email',
    })
    .email()
    .trim(),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .trim()
    .min(passwordLength),
});

export type Auth = z.infer<typeof AuthSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type Login = z.infer<typeof AuthSchema>;
