import { Link } from 'react-router-dom';
import { Users, CalendarDays, Star, ListChecks, ArrowRight, Clock, Wallet } from 'lucide-react';
import StatCard from '@/components/common/StatCard';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { useAuth } from '@/features/auth/useAuth';
import { useDoctorDashboard } from '@/hooks/doctorSelf/useDoctorDashboard';
import { formatCurrency } from '@/utils/formatCurrency';

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useDoctorDashboard();

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading your dashboard..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load your dashboard"
        message="Something went wrong while fetching your overview."
        onRetry={refetch}
      />
    );
  }

  const d = data?.data ?? {};
  const patients = d.todayPatients ?? d.patientsToday ?? [];
  const queue = d.queue ?? d.todayQueue ?? d.nextPatient ?? null;
  const firstName = user?.fullName?.split(' ')[0] ?? 'Doctor';

  const stats = [
    { icon: Users, label: 'Patients today', value: String(d.patientsTodayCount ?? d.patientsToday?.length ?? patients.length), accent: 'indigo', trend: d.patientsTrend },
    { icon: CalendarDays, label: 'Appointments today', value: String(d.appointmentsTodayCount ?? d.totalAppointments ?? 0), accent: 'purple' },
    { icon: ListChecks, label: 'In queue', value: String(d.queueCount ?? (Array.isArray(queue) ? queue.length : queue ? 1 : 0)), accent: 'teal' },
    { icon: Star, label: 'Average rating', value: d.averageRating ? Number(d.averageRating).toFixed(1) : '—', accent: 'amber', trend: d.ratingTrend },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back, Dr. ${firstName}`}
        subtitle="Here's your practice overview for today."
        action={
          <Link to="/doctor/schedule" className="btn-primary">
            <CalendarDays className="h-4 w-4" />
            Manage schedule
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} accent={s.accent} trend={s.trend} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Today's patients</h2>
              <Link to="/doctor/patients/today" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {patients.length === 0 ? (
              <div className="mt-5">
                <EmptyState title="No patients scheduled today" message="Enjoy the quiet day, or check your schedule." />
              </div>
            ) : (
              <div className="mt-5 divide-y divide-slate-100">
                {patients.slice(0, 6).map((p) => {
                  const name = typeof p.patient === 'string' ? p.patient : p.patient?.fullName ?? p.name ?? 'Patient';
                  const time = p.time ?? p.slot ?? p.appointment?.time ?? '';
                  const queueNo = p.queueNo ?? p.queueNumber ?? '—';
                  const status = p.status ?? p.queueStatus ?? 'WAITING';
                  return (
                    <div key={p.id ?? name} className="flex items-center gap-4 py-3.5">
                      <span className="w-16 shrink-0 text-xs font-bold text-slate-400">{queueNo}</span>
                      <Avatar name={name} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800">{name}</p>
                        {time && (
                          <p className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="h-3 w-3" /> {time}
                          </p>
                        )}
                      </div>
                      <Badge status={status}>{status.replace('_', ' ')}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-brand-gradient p-6 text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">Your next patient</p>
            {queue ? (
              <>
                <p className="mt-2 text-2xl font-extrabold">
                  {typeof queue.patient === 'string' ? queue.patient : queue.patient?.fullName ?? queue.name ?? 'Looking good'}
                </p>
                <p className="mt-1 text-sm text-indigo-100">
                  {[queue.time ?? queue.slot, queue.room ?? queue.location].filter(Boolean).join(' · ') || 'No one in the queue right now'}
                </p>
              </>
            ) : (
              <p className="mt-2 text-2xl font-extrabold">You're caught up 🎉</p>
            )}
            <Link to="/doctor/queue" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50">
              <ListChecks className="h-4 w-4" />
              Open queue
            </Link>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Today at a glance</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { label: 'Start time', value: d.clinicStartTime ?? d.startTime ?? '—' },
                {
                  label: 'Slots filled',
                  value: d.slotsFilled != null ? `${d.slotsFilled} / ${d.totalSlots ?? '—'}` : '—',
                },
                {
                  label: 'Revenue today',
                  value: d.revenueToday != null ? formatCurrency(d.revenueToday) : '—',
                },
              ].map((r) => (
                <li key={r.label} className="flex items-center justify-between border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                  <span className="text-slate-500">{r.label}</span>
                  <span className="flex items-center gap-1 font-bold text-slate-800">
                    {r.label === 'Revenue today' && <Wallet className="h-3.5 w-3.5 text-teal-500" />}
                    {r.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}