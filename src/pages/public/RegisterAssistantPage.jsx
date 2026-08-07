import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardList, User, Mail, Phone, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerAssistantSchema } from '@/validations/authValidation';
import { useRegisterAssistant } from '@/hooks/auth/useRegisterAssistant';
import { getErrorStatus } from '@/utils/getErrorMessage';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/common/Input';
import PasswordInput from '@/components/common/PasswordInput';
import Button from '@/components/common/Button';

export default function RegisterAssistantPage() {
  const { mutateAsync: registerAssistant, isPending } = useRegisterAssistant();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerAssistantSchema) });

  const onSubmit = async (values) => {
    try {
      await registerAssistant(values);
      toast.success('Registration submitted — an admin will assign you to a doctor.');
      navigate('/login');
    } catch (err) {
      if (getErrorStatus(err) === 409) {
        setError('email', { type: 'manual', message: 'An account with this email already exists.' });
      }
    }
  };

  return (
    <AuthLayout
      icon={ClipboardList}
      title="Join as a doctor assistant"
      subtitle="Manage bookings and the queue for a doctor's practice."
      footer={
        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Full name"
          autoComplete="name"
          placeholder="Jane Wilson"
          icon={User}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone (optional)"
            type="tel"
            autoComplete="tel"
            placeholder="+1 555 000 1234"
            icon={Phone}
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <PasswordInput
          label="Password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Designation (optional)"
          autoComplete="organization-title"
          placeholder="e.g. Medical receptionist"
          icon={BadgeCheck}
          error={errors.designation?.message}
          {...register('designation')}
        />

        <Button type="submit" size="lg" loading={isPending} className="w-full py-3">
          Submit registration
        </Button>
      </form>
    </AuthLayout>
  );
}