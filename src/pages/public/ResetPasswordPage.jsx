import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { resetPasswordSchema } from '@/validations/authValidation';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: searchParams.get('token') ?? '' },
  });

  const onSubmit = async (values) => {
    // TODO: wire to POST /auth/reset-password (useResetPassword)
    console.log('reset password', values);
    toast.success('Password updated! You can now sign in.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gradient px-4 py-12">
      <div className="relative w-full max-w-md">
        <div className="card p-8 shadow-2xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg">
              <KeyRound className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Set a new password</h1>
            <p className="mt-1 text-sm text-slate-500">Choose a strong password you'll remember.</p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="label">New password</label>
              <input type="password" placeholder="At least 8 characters" className={`input ${errors.newPassword ? 'border-rose-400' : ''}`} {...register('newPassword')} />
              {errors.newPassword && <p className="mt-1 text-xs font-medium text-rose-600">{errors.newPassword.message}</p>}
            </div>
            <div>
              <label className="label">Confirm new password</label>
              <input type="password" placeholder="Repeat your password" className={`input ${errors.confirmPassword ? 'border-rose-400' : ''}`} {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="mt-1 text-xs font-medium text-rose-600">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
              {isSubmitting ? 'Updating...' : 'Update password'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}