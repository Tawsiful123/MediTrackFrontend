import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Send, MailCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { forgotPasswordSchema } from '@/validations/authValidation';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function ForgotPasswordPage() {
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();
  const [sentEmail, setSentEmail] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values) => {
    try {
      await forgotPassword(values);
      toast.success('If that email exists, a reset link is on its way.');
      setSentEmail(values.email);
    } catch {
      // error toast is handled by the mutation layer
    }
  };

  return (
    <AuthLayout
      icon={sentEmail ? MailCheck : Mail}
      title={sentEmail ? 'Check your inbox' : 'Forgot your password?'}
      subtitle={
        sentEmail
          ? `We sent a reset link to ${sentEmail}.`
          : "Enter your email and we'll send you a reset link."
      }
      footer={
        <p className="text-center text-sm text-slate-500">
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
            Back to sign in
          </Link>
        </p>
      }
    >
      {sentEmail ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600">
            <MailCheck className="h-8 w-8" />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-500">
            The link expires shortly. If you don't see the email, check your spam folder or{' '}
            <button
              type="button"
              onClick={() => setSentEmail(null)}
              className="font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              try again
            </button>
            .
          </p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            icon={Mail}
            error={errors.email?.message}
            hint="We'll email you a secure link to reset your password."
            {...register('email')}
          />

          <Button type="submit" size="lg" loading={isPending} className="w-full py-3">
            {!isPending && <Send className="h-4 w-4" />}
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
