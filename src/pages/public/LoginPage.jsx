import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeartPulse, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema } from '@/validations/authValidation';
import { useLogin } from '@/hooks/auth/useLogin';
import { useAuth } from '@/features/auth/useAuth';
import { roleRedirect } from '@/utils/roleRedirect';

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
        navigate('/change-password');
      } else {
        navigate(roleRedirect[user.role] ?? from);
      }
    } catch {
      // error toast is handled by the mutation layer
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gradient px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent_50%)]" />
      <div className="relative w-full max-w-md">
        <div className="card p-8 shadow-2xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg">
              <HeartPulse className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to your MediTrack account</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`input pl-9 ${errors.email ? 'border-rose-400 focus:ring-rose-200' : ''}`}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs font-medium text-rose-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`input pl-9 ${errors.password ? 'border-rose-400 focus:ring-rose-200' : ''}`}
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="mt-1 text-xs font-medium text-rose-600">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={isPending} className="btn-primary w-full py-3">
              {isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to MediTrack?{' '}
            <Link to="/register/patient" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}