import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '../hooks/useAuth';
import { registerSchema } from '../utils/authSchemas';
import { ROLE_HOME_ROUTE, ROLES, API_ERROR_CODES } from '../utils/constants';
import AuthCard from '../components/forms/AuthCard';
import RoleSelect from '../components/forms/RoleSelect';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: ROLES.BUYER },
  });

  const onSubmit = async (values) => {
    setFormError('');
    try {
      // confirmPassword is a client-only convenience check (see
      // authSchemas.js's refine) — the backend only accepts email/password/role.
      const user = await registerUser({
        email: values.email,
        password: values.password,
        role: values.role,
      });
      toast.success('Account created — welcome to TextileMarket!');
      navigate(ROLE_HOME_ROUTE[user.role] || '/', { replace: true });
    } catch (err) {
      if (err.code === API_ERROR_CODES.EMAIL_TAKEN) {
        setError('email', { message: err.message });
      }
      setFormError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <AuthCard
      eyebrow="Join TextileMarket"
      title="Create your account"
      description="Whether you're sourcing fabric or selling it, set up your account in a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {formError && (
          <p role="alert" className="rounded-lg bg-danger-100 px-3.5 py-2.5 text-sm text-danger">
            {formError}
          </p>
        )}

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <RoleSelect value={field.value} onChange={field.onChange} error={errors.role?.message} />
          )}
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
          Create account
        </Button>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;
