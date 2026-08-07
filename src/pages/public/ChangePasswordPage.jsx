import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Lock, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { changePasswordSchema } from '@/validations/authValidation';
import { useChangePassword } from '@/hooks/auth/useChangePassword';
import { useAuth } from '@/features/auth/useAuth';
import { getRedirectPath } from '@/utils/roleRedirect';

export default function ChangePasswordPage() {
  const { mutateAsync: changePassword, isPending } = useChangePassword();
  const { user, needsPasswordChange } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = async (values) => {
    try {
      await changePassword(values);
      toast.success('Password updated!');
      navigate(getRedirectPath(user?.role));
    } catch {
      // error toast is handled by the mutation layer
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gradient px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
      <div className="relative w-full max-w-md">
        <div className="card p-8 shadow-2xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg">
              <KeyRound className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Change password</h1>
            {needsPasswordChange && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                You must set a new password before continuing.
              </div>
            )}
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="label">Current password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="password" placeholder="••••••••" className={`input pl-9 ${errors.currentPassword ? 'border-rose-400' : ''}`} {...register('currentPassword')} />
              </div>
              {errors.currentPassword && <p className="mt-1 text-xs font-medium text-rose-600">{errors.currentPassword.message}</p>}
            </div>

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

            <button type="submit" disabled={isPending} className="btn-primary w-full py-3">
              {isPending ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}