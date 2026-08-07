import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, User, Mail, Lock, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerPatientSchema } from '@/validations/authValidation';

export default function RegisterPatientPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerPatientSchema) });

  const onSubmit = async (values) => {
    // TODO: wire to POST /auth/register/patient (useRegisterPatient)
    console.log('register patient', values);
    toast.success('Account created! Please check your email to verify.');
    navigate('/login');
  };

  const field = {
    wrapper: 'space-y-5',
    label: 'label',
    input: (hasError) => `input pl-9 ${hasError ? 'border-rose-400 focus:ring-rose-200' : ''}`,
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gradient px-4 py-12">
      <div className="relative w-full max-w-md">
        <div className="card p-8 shadow-2xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg">
              <HeartPulse className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Create your account</h1>
            <p className="mt-1 text-sm text-slate-500">Join MediTrack as a patient — it's free.</p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={field.wrapper}>
              <label className={field.label}>Full name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input placeholder="Jane Doe" className={field.input(!!errors.fullName)} {...register('fullName')} />
              </div>
              {errors.fullName && <p className="mt-1 text-xs font-medium text-rose-600">{errors.fullName.message}</p>}
            </div>

            <div className={field.wrapper}>
              <label className={field.label}>Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="email" placeholder="you@example.com" className={field.input(!!errors.email)} {...register('email')} />
              </div>
              {errors.email && <p className="mt-1 text-xs font-medium text-rose-600">{errors.email.message}</p>}
            </div>

            <div className={field.wrapper}>
              <label className={field.label}>Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="password" placeholder="At least 8 characters" className={field.input(!!errors.password)} {...register('password')} />
              </div>
              {errors.password && <p className="mt-1 text-xs font-medium text-rose-600">{errors.password.message}</p>}
            </div>

            <div className={field.wrapper}>
              <label className={field.label}>Phone (optional)</label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="tel" placeholder="+1 555 000 1234" className={field.input(!!errors.phone)} {...register('phone')} />
              </div>
              {errors.phone && <p className="mt-1 text-xs font-medium text-rose-600">{errors.phone.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Sign in
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-slate-500">
            Are you a doctor?{' '}
            <Link to="/register/doctor" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}