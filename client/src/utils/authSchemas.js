import { z } from 'zod';
import { ROLES } from './constants';

// Mirrors server/controllers/authController.js validation exactly — email
// required + valid format, password >= 8 chars, role must be buyer/supplier
// — so a client-side rejection never says something the backend would
// disagree with.

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum([ROLES.BUYER, ROLES.SUPPLIER], {
      errorMap: () => ({ message: 'Select whether you are a buyer or a supplier' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
