import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { useTodaysPatients } from '@/hooks/doctorSelf/useTodaysPatients';

export default function TodaysPatientsPage() {
  const { data, isLoading, isError, refetch } = useTodaysPatients();

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading today's patients..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load today's patients"
        message="Something went wrong while fetching your patient list."
        onRetry={refetch}
      />
    );
  }

  const raw = data?.data ?? {};
  const patients = Array.isArray(raw) ? raw : raw.patients ?? raw.items ?? [];

  if (patients.length === 0) {
    return (
      <div>
        <PageHeader
          title="Today's patients"
          subtitle="Everyone you'll see today."
          action={
            <Link to="/doctor/queue" className="btn-outline">
              <Clock className="h-4 w-4" />
              Queue view
            </Link>
          }
        />
        <EmptyState title="No patients today" message="Patients with confirmed appointments will appear here." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Today's patients"
        subtitle="Everyone you'll see today."
        action={
          <Link to="/doctor/queue" className="btn-outline">
            <Clock className="h-4 w-4" />
            Queue view
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3.5">Queue</th>
              <th className="px-6 py-3.5">Patient</th>
              <th className="px-6 py-3.5">Scheduled</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((p) => {
              const name = typeof p.patient === 'string' ? p.patient : p.patient?.fullName ?? p.name ?? 'Patient';
              const time = p.time ?? p.slot ?? p.appointment?.time ?? '—';
              const queueNo = p.queueNo ?? p.queueNumber ?? '—';
              const status = p.status ?? p.queueStatus ?? 'WAITING';
              return (
                <tr key={p.id ?? p._id ?? name} className="transition hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-bold text-slate-400">{queueNo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={name} size="sm" />
                      <span className="font-semibold text-slate-800">{name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{time}</td>
                  <td className="px-6 py-4"><Badge status={status}>{status.replace('_', ' ')}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}