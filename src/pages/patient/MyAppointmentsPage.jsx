import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import EmptyState from '@/components/common/EmptyState';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import { formatCurrency } from '@/utils/formatCurrency';
import { useMyAppointments } from '@/hooks/appointments/useMyAppointments';

const TABS = ['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'];

function getDoctorName(a) {
  if (!a) return 'Unknown doctor';
  return typeof a.doctor === 'string' ? a.doctor : a.doctor?.fullName ?? 'Unknown doctor';
}

function getSpec(a) {
  const s = a.specialization ?? a.doctor?.specialization;
  return typeof s === 'string' ? s : s?.name ?? '';
}

export default function MyAppointmentsPage() {
  const [tab, setTab] = useState('ALL');
  const { data, isLoading, isError, refetch } = useMyAppointments(
    tab === 'ALL' ? { limit: 50 } : { status: tab, limit: 50 },
  );

  const result = data?.data ?? {};
  const appointments = result.appointments ?? result.items ?? result.data ?? [];

  return (
    <div>
      <PageHeader
        title="My appointments"
        subtitle="Manage your bookings, reschedule, or cancel."
        action={
          <Link to="/doctors" className="btn-primary">
            <Plus className="h-4 w-4" />
            New appointment
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === t
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <Spinner label="Loading appointments..." />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load appointments"
          message="Something went wrong while fetching your bookings."
          onRetry={refetch}
        />
      ) : appointments.length === 0 ? (
        <EmptyState
          title="No appointments yet"
          message="Book your first appointment with one of our verified doctors."
          action={<Link to="/doctors" className="btn-primary">Find a doctor</Link>}
        />
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <Link
              key={a.id}
              to={`/patient/appointments/${a.id}`}
              className="card group flex flex-col gap-4 p-5 transition hover:shadow-lg sm:flex-row sm:items-center"
            >
              <Avatar name={getDoctorName(a)} size="lg" />
              <div className="flex-1">
                <p className="font-bold text-slate-900 group-hover:text-indigo-700">{getDoctorName(a)}</p>
                <p className="text-sm text-slate-500">
                  {[getSpec(a), a.date, a.time && `at ${a.time}`].filter(Boolean).join(' · ')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  {a.consultationFee > 0 && (
                    <p className="text-sm font-bold text-slate-800">{formatCurrency(a.consultationFee)}</p>
                  )}
                  <Badge status={a.status}>{a.status}</Badge>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
