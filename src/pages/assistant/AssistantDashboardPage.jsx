import { Link } from 'react-router-dom';
import { Inbox, ClipboardList, ListChecks, UserCheck, ArrowRight, Stethoscope } from 'lucide-react';
import StatCard from '@/components/common/StatCard';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { useAssistantDashboard } from '@/hooks/assistant/useAssistantDashboard';
import { useAssignedDoctor } from '@/hooks/assistant/useAssignedDoctor';
import { useAppointmentRequests } from '@/hooks/appointments/useAppointmentRequests';

export default function AssistantDashboardPage() {
  const { data, isLoading, isError, refetch } = useAssistantDashboard();
  const { data: doctorData, isLoading: doctorLoading } = useAssignedDoctor();
  const { data: requestsData } = useAppointmentRequests({ limit: 4 });

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
  const doctor = doctorData?.data ?? {};
  const requestsRaw = requestsData?.data ?? {};
  const requests = requestsRaw.requests ?? requestsRaw.items ?? requestsRaw.data ?? [];
  const pending = requests.filter((r) => r.status === 'PENDING');
  const doctorName = typeof doctor === 'string' ? doctor : doctor.fullName ?? 'Your doctor';

  const stats = [
    { icon: Inbox, label: 'Pending requests', value: String(d.pendingRequests ?? d.pendingRequestCount ?? pending.length), accent: 'amber' },
    { icon: ClipboardList, label: 'Appointments today', value: String(d.appointmentsToday ?? d.todayAppointments ?? 0), accent: 'indigo' },
    { icon: ListChecks, label: 'In queue', value: String(d.queueCount ?? d.inQueue ?? 0), accent: 'teal' },
    { icon: UserCheck, label: 'Patients served', value: String(d.patientsServed ?? d.servedCount ?? 0), accent: 'emerald', trend: d.servedTrend },
  ];

  return (
    <div>
      <PageHeader
        title="Assistant overview"
        subtitle="Requests and queue status across your assigned doctor."
        action={
          <Link to="/assistant/requests" className="btn-primary">
            <Inbox className="h-4 w-4" />
            View requests
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} accent={s.accent} trend={s.trend} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Appointment requests</h2>
            <Link to="/assistant/requests" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Manage <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {pending.length === 0 ? (
            <div className="mt-5">
              <EmptyState title="No pending requests" message="You're all caught up." />
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {pending.slice(0, 4).map((r) => {
                const patientName = typeof r.patient === 'string' ? r.patient : r.patient?.fullName ?? r.name ?? 'Patient';
                const time = r.date ?? r.slot ?? r.time ?? '';
                return (
                  <div key={r.id ?? r._id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                    <Avatar name={patientName} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800">{patientName}</p>
                      <p className="text-xs text-slate-400">{time}</p>
                    </div>
                    <Badge status={r.status}>{r.status}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-brand-gradient p-6 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Stethoscope className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">Assigned doctor</p>
              <p className="truncate text-lg font-extrabold">
                {doctorLoading ? 'Loading...' : doctorName}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-extrabold">{d.nextQueueNo ?? d.nextInQueue ?? '—'}</p>
              <p className="text-xs text-indigo-100">Next in queue</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-extrabold">{d.averageWaitTime ?? '~15 min'}</p>
              <p className="text-xs text-indigo-100">Avg. wait time</p>
            </div>
          </div>
          <Link to="/assistant/queue" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50">
            <ListChecks className="h-4 w-4" />
            Open queue board
          </Link>
        </div>
      </div>
    </div>
  );
}