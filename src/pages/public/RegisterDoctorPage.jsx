import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, User, Mail, Phone, Building2, MapPin, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerDoctorSchema } from '@/validations/authValidation';
import { useRegisterDoctor } from '@/hooks/auth/useRegisterDoctor';
import { useSpecializations } from '@/hooks/specializations/useSpecializations';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import PasswordInput from '@/components/common/PasswordInput';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';

export default function RegisterDoctorPage() {
  const { mutateAsync: registerDoctor, isPending } = useRegisterDoctor();
  const { data: specData, isLoading: specsLoading } = useSpecializations();
  const navigate = useNavigate();

  const specializations = specData?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerDoctorSchema) });

  const onSubmit = async (values) => {
    try {
      await registerDoctor(values);
      toast.success('Application submitted! Our team will review it shortly.');
      navigate('/login');
    } catch {
      // error toast is handled by the mutation layer
    }
  };

  return (
    <AuthLayout
      icon={Stethoscope}
      title="Join as a doctor"
      subtitle="Submit your application — our team verifies every profile."
      maxWidth="lg"
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
          placeholder="Dr. John Smith"
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

        {specsLoading ? (
          <div className="input flex items-center gap-2 text-slate-400">
            <Spinner size="sm" label="Loading specializations..." />
          </div>
        ) : (
          <Select
            label="Specialization"
            placeholder="Select your specialization"
            options={specializations.map((s) => ({ value: s.id, label: s.name }))}
            error={errors.specializationId?.message}
            {...register('specializationId')}
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Hospital (optional)"
            autoComplete="organization"
            placeholder="City General"
            icon={Building2}
            error={errors.hospitalName?.message}
            {...register('hospitalName')}
          />
          <Input
            label="Consultation fee ($)"
            type="number"
            step="0.01"
            min="0"
            placeholder="50"
            icon={Banknote}
            error={errors.consultationFee?.message}
            {...register('consultationFee')}
          />
        </div>

        <Input
          label="Clinic address (optional)"
          autoComplete="street-address"
          placeholder="123 Main Street, Springfield"
          icon={MapPin}
          error={errors.clinicAddress?.message}
          {...register('clinicAddress')}
        />

        <Button type="submit" size="lg" loading={isPending} className="w-full py-3">
          Submit application
        </Button>
      </form>
    </AuthLayout>
  );
}
