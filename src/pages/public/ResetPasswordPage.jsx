import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { resetPasswordSchema } from '@/validations/authValidation';
import { useResetPassword } from '@/hooks/auth/useResetPassword';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/common/PasswordInput';
import Button from '@/components/common/Button';

export default function ResetPasswordPage() {
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const onSubmit = async (values) => {
    try {
      await resetPassword(values);
      toast.success('Password updated! You can now sign in.');
      navigate('/login');
    } catch {
      // error toast is handled by the mutation layer
    }
  };

  if (!token) {
    return (
      <AuthLayout
        icon={KeyRound}
        title="Invalid reset link"
        subtitle="This link is missing its token or has already expired."
        footer={
          <p className="text-center text-sm text-slate-500">
            <Link to="/forgot-password" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
              Request a new reset link
            </Link>
          </p>
        }
      >
        <p className="text-center text-sm text-slate-500">
          You can also{' '}
          <Link to="/login" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
            go back to sign in
          </Link>
          .
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={KeyRound}
      title="Set a new password"
      subtitle="Choose a strong password you'll remember."
      footer={
        <p className="text-center text-sm text-slate-500">
          <Link to="/login" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
            Back to sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <input type="hidden" {...register('token')} />

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
