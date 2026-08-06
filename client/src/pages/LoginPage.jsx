import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '../hooks/useAuth';
import { loginSchema } from '../utils/authSchemas';
import { ROLE_HOME_ROUTE, API_ERROR_CODES } from '../utils/constants';
import AuthCard from '../components/forms/AuthCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    setFormError('');
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.email}`);

      // Deep-link redirect: route guards (ProtectedRoute/BuyerRoute/
      // SupplierRoute) stash the page the user was trying to reach in
      // location.state.from before bouncing them here. Fall back to their
      // role's home if they arrived at /login directly.
      const redirectTo = location.state?.from?.pathname || ROLE_HOME_ROUTE[user.role] || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // axiosClient already toasts err.message — this inline banner just
      // keeps it visible instead of relying on a toast the user might miss.
      if (err.code === API_ERROR_CODES.INVALID_CREDENTIALS) {
        setError('password', { message: err.message });
      }
      setFormError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Log in to your account"
      description="Access your dashboard, orders, and saved suppliers."
      footer={
        <>
          New to TextileMarket?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
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
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
          Log in
        </Button>
      </form>
    </AuthCard>
  );
};

export default LoginPage;
