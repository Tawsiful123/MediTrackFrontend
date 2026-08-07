import { Link } from 'react-router-dom';
import { Stethoscope, MapPin, Phone, CalendarDays, Mail, Star } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Avatar from '@/components/common/Avatar';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import { useAssignedDoctor } from '@/hooks/assistant/useAssignedDoctor';
import { formatCurrency } from '@/utils/formatCurrency';
import { getErrorStatus } from '@/utils/getErrorMessage';

export default function AssignedDoctorPage() {
  const { data, isLoading, isError, error, refetch } = useAssignedDoctor();

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading assigned doctor..." />
      </div>
    );
  }

  if (isError) {
    if (getErrorStatus(error) === 404) {
      return (
        <div>
          <PageHeader title="Assigned doctor" subtitle="The doctor you're assisting." />
          <div className="card p-8 text-center">
            <Stethoscope className="mx-auto h-10 w-10 text-slate-300" />
            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No doctor assigned yet. Please contact the administrator.
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Once an administrator assigns you to a doctor, their profile and schedule will appear
              here.
            </p>
          </div>
        </div>
      );
    }
    return (
      <ErrorState
        title="Could not load assigned doctor"
        message="Something went wrong while fetching your assigned doctor."
        onRetry={refetch}
      />
    );
  }

  const doctor = data?.data ?? {};
  const name = doctor.fullName ?? doctor.name ?? 'Your doctor';
  const spec =
    typeof doctor.specialization === 'string'
      ? doctor.specialization
      : doctor.specialization?.name ?? 'Specialist';
  const hours = doctor.workHours ?? doctor.scheduleHours ?? 'Mon – Sat · 9:00 AM – 5:00 PM';

  return (
    <div>
      <PageHeader
        title="Assigned doctor"
        subtitle="The doctor you're assisting."
        action={
          <Link to="/assistant/appointments" className="btn-outline">
            <CalendarDays className="h-4 w-4" /> Schedule
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="bg-brand-gradient px-8 py-10 text-white">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Avatar name={name} size="xl" className="h-20 w-20 border-4 border-white/30 text-3xl shadow-lg" />
            <div>
              <h2 className="text-2xl font-extrabold">{name}</h2>
              <p className="mt-1 flex items-center gap-2 text-indigo-100">
                <Stethoscope className="h-4 w-4" /> {spec}
              </p>
              <div className="mt-2 flex items-center gap-4 text-indigo-100">
                <span className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                  {doctor.averageRating ? Number(doctor.averageRating).toFixed(1) : 'New'}
                </span>
                {doctor.consultationFee > 0 && (
                  <span className="text-sm">{formatCurrency(doctor.consultationFee)} / visit</span>
                )}
              </div>
              <span className="badge mt-3 bg-white/90 text-emerald-700">Available today</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Clinic</p>
              <p className="mt-1 font-semibold text-slate-800">{doctor.hospitalName ?? doctor.clinicName ?? '—'}</p>
              <p className="text-sm text-slate-500">{doctor.clinicAddress ?? ''}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Phone className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</p>
              <p className="mt-1 font-semibold text-slate-800">{doctor.phone ?? '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</p>
              <p className="mt-1 font-semibold text-slate-800">{doctor.email ?? '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Hours</p>
              <p className="mt-1 font-semibold text-slate-800">{hours}</p>
            </div>
          </div>
          <div className="sm:col-span-2">
            <Link to="/assistant/queue" className="btn-primary w-full sm:w-auto">
              Manage today's queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}