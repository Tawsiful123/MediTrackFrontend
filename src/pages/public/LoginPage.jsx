import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeartPulse, Mail, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema } from '@/validations/authValidation';
import { useLogin } from '@/hooks/auth/useLogin';
import { useAuth } from '@/features/auth/useAuth';
import { getRedirectPath } from '@/utils/roleRedirect';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/common/Input';
import PasswordInput from '@/components/common/PasswordInput';
import Button from '@/components/common/Button';

export default function LoginPage() {
  const { mutateAsync: login, isPending } = useLogin();
  const { login: setCredentials } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    try {
      const res = await login(values);
      const { user, accessToken, needsPasswordChange } = res.data;
      setCredentials({ user, accessToken, needsPasswordChange });
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}!`);
      if (needsPasswordChange) {
        navigate('/change-password', { replace: true });
      } else {
        const dest = getRedirectPath(user.role);
        navigate(dest === '/' ? from : dest, { replace: true });
      }
    } catch {
      // error toast is handled by the mutation layer
    }
  };

  return (
    <AuthLayout
      icon={HeartPulse}
      title="Welcome back"
      subtitle="Sign in to your MediTrack account"
      footer={
        <p className="text-center text-sm text-slate-500">
          New to MediTrack?{' '}
          <Link to="/register/patient" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
            Create an account
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-end text-sm">
          <Link
            to="/forgot-password"
            className="font-semibold text-indigo-600 transition hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded px-1"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" loading={isPending} className="w-full py-3">
          {!isPending && <LogIn className="h-4 w-4" />}
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
