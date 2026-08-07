import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserRoundPlus, User, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerPatientSchema } from '@/validations/authValidation';
import { useRegisterPatient } from '@/hooks/auth/useRegisterPatient';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/common/Input';
import PasswordInput from '@/components/common/PasswordInput';
import Button from '@/components/common/Button';

export default function RegisterPatientPage() {
  const { mutateAsync: registerPatient, isPending } = useRegisterPatient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerPatientSchema) });

  const onSubmit = async (values) => {
    try {
      await registerPatient(values);
      toast.success('Account created! Please sign in to continue.');
      navigate('/login');
    } catch {
      // error toast is handled by the mutation layer
    }
  };

  return (
    <AuthLayout
      icon={UserRoundPlus}
      title="Create your account"
      subtitle="Join MediTrack as a patient — it's free."
      footer={
        <>
          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
              Sign in
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-slate-500">
            Are you a doctor?{' '}
            <Link to="/register/doctor" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
              Register here
            </Link>
          </p>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Full name"
          autoComplete="name"
          placeholder="Jane Doe"
          icon={User}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
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

        <Button type="submit" size="lg" loading={isPending} className="w-full py-3">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
