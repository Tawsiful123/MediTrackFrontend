import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useNavigate } from 'react-router-dom';
import { KeyRound, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { changePasswordSchema } from '@/validations/authValidation';
import { useChangePassword } from '@/hooks/auth/useChangePassword';
import { useAuth } from '@/features/auth/useAuth';
import { getRedirectPath } from '@/utils/roleRedirect';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/common/PasswordInput';
import Button from '@/components/common/Button';

export default function ChangePasswordPage() {
  const { mutateAsync: changePassword, isPending } = useChangePassword();
  const { user, needsPasswordChange, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(changePasswordSchema) });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const onSubmit = async (values) => {
    try {
      await changePassword(values);
      toast.success('Password updated!');
      navigate(getRedirectPath(user?.role), { replace: true });
    } catch {
      // error toast is handled by the mutation layer
    }
  };

  return (
    <AuthLayout
      icon={KeyRound}
      title="Change password"
      subtitle="Keep your account secure with a strong password."
      alert={
        needsPasswordChange && (
          <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-xs font-medium text-amber-800">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            Your administrator requires you to set a new password before continuing.
          </div>
        )
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <PasswordInput
          label="Current password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />

        <PasswordInput
          label="New password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />

        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" size="lg" loading={isPending} className="w-full py-3">
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}
