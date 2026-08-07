import { useEffect, useState } from 'react';
import { Check, X, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import { useAllAppointments } from '@/hooks/appointments/useAllAppointments';
import { useUpdateAppointmentStatus } from '@/hooks/appointments/useUpdateAppointmentStatus';

const LIMIT = 10;

export default function AllAppointmentsPage() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const { mutateAsync: updateStatus, isPending: updatingId } = useUpdateAppointmentStatus();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const { data, isLoading, isError, refetch } = useAllAppointments({
    search: debounced || undefined,
    page,
    limit: LIMIT,
  });

  const result = data?.data ?? {};
  const appointments = result.appointments ?? result.items ?? result.data ?? [];

  const changeStatus = async (a, status) => {
    await updateStatus({ id: a.id ?? a._id, status });
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading appointments..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load appointments"
        message="Something went wrong while fetching the appointment list."
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <PageHeader title="All appointments" subtitle="Every appointment across the practice." />

      <div className="mb-5 max-w-sm">
        <SearchBar value={search} onChange={onSearchChange} placeholder="Search patient or doctor..." />
      </div>

      {appointments.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No appointments found"
          message="Try adjusting your search, or check back later."
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Patient</th>
                <th className="px-6 py-3.5">Doctor</th>
                <th className="px-6 py-3.5">Date & time</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((a) => {
                const patientName = typeof a.patient === 'string' ? a.patient : a.patient?.fullName ?? 'Patient';
                const doctorName = typeof a.doctor === 'string' ? a.doctor : a.doctor?.fullName ?? 'Doctor';
                const dateTime = [a.date, a.time].filter(Boolean).join(' · ');
                const id = a.id ?? a._id;
                const busy = Boolean(updatingId);
                return (
                  <tr key={id} className="transition hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <Link to={`/assistant/appointments/${id}`} className="font-semibold text-slate-800 hover:text-indigo-700">
                        {patientName}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{doctorName}</td>
                    <td className="px-6 py-4">{dateTime}</td>
                    <td className="px-6 py-4"><Badge status={a.status}>{a.status}</Badge></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {a.status === 'PENDING' && (
                          <>
                            <Button size="sm" loading={updatingId === id} disabled={busy} onClick={() => changeStatus(a, 'CONFIRMED')}>
                              <Check className="h-4 w-4" /> Confirm
                            </Button>
                            <Button size="sm" variant="danger" loading={updatingId === id} disabled={busy} onClick={() => changeStatus(a, 'REJECTED')}>
                              <X className="h-4 w-4" /> Reject
                            </Button>
                          </>
                        )}
                        {a.status === 'CONFIRMED' && (
                          <Button size="sm" variant="outline" loading={updatingId === id} disabled={busy} onClick={() => changeStatus(a, 'COMPLETED')}>
                            Mark completed
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !isError && appointments.length > 0 && (
        <div className="mt-6">
          <Pagination meta={result.meta} page={page} onChange={setPage} />
        </div>
      )}
    </div>
  );
}