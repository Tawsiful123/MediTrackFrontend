import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, User, Mail, Lock, Phone, Building2, MapPin, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerDoctorSchema } from '@/validations/authValidation';

const specializations = [
  'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
  'Pediatrics', 'General Medicine', 'Gynecology', 'Ophthalmology',
];

export default function RegisterDoctorPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerDoctorSchema) });

  const onSubmit = async (values) => {
    // TODO: wire to POST /auth/register/doctor (useRegisterDoctor)
    console.log('register doctor', values);
    toast.success('Application submitted! Our team will review it shortly.');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gradient px-4 py-12">
      <div className="relative w-full max-w-lg">
        <div className="card p-8 shadow-2xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg">
              <HeartPulse className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Join as a doctor</h1>
            <p className="mt-1 text-sm text-slate-500">
              Submit your application — our team verifies every profile.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input placeholder="Dr. John Smith" className={`input pl-9 ${errors.fullName ? 'border-rose-400' : ''}`} {...register('fullName')} />
              </div>
              {errors.fullName && <p className="mt-1 text-xs font-medium text-rose-600">{errors.fullName.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="email" placeholder="you@example.com" className={`input pl-9 ${errors.email ? 'border-rose-400' : ''}`} {...register('email')} />
                </div>
                {errors.email && <p className="mt-1 text-xs font-medium text-rose-600">{errors.email.message}</p>}
              </div>
              <div>
                <label className="label">Phone (optional)</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="tel" placeholder="+1 555 000 1234" className={`input pl-9 ${errors.phone ? 'border-rose-400' : ''}`} {...register('phone')} />
                </div>
                {errors.phone && <p className="mt-1 text-xs font-medium text-rose-600">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="password" placeholder="At least 8 characters" className={`input pl-9 ${errors.password ? 'border-rose-400' : ''}`} {...register('password')} />
              </div>
              {errors.password && <p className="mt-1 text-xs font-medium text-rose-600">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Specialization</label>
              <select className={`input ${errors.specializationId ? 'border-rose-400' : ''}`} {...register('specializationId')}>
                <option value="">Select your specialization</option>
                {specializations.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.specializationId && <p className="mt-1 text-xs font-medium text-rose-600">{errors.specializationId.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Hospital (optional)</label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input placeholder="City General" className={`input pl-9 ${errors.hospitalName ? 'border-rose-400' : ''}`} {...register('hospitalName')} />
                </div>
              </div>
              <div>
                <label className="label">Consultation fee ($)</label>
                <div className="relative">
                  <Banknote className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="number" step="0.01" min="0" placeholder="50" className={`input pl-9 ${errors.consultationFee ? 'border-rose-400' : ''}`} {...register('consultationFee')} />
                </div>
                {errors.consultationFee && <p className="mt-1 text-xs font-medium text-rose-600">{errors.consultationFee.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Clinic address (optional)</label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input placeholder="123 Main Street, Springfield" className={`input pl-9 ${errors.clinicAddress ? 'border-rose-400' : ''}`} {...register('clinicAddress')} />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
              {isSubmitting ? 'Submitting...' : 'Submit application'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}