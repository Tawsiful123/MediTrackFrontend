import { useEffect, useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import SearchBar from '@/components/common/SearchBar';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { useDoctorPatients } from '@/hooks/doctorSelf/useDoctorPatients';

const LIMIT = 10;

export default function DoctorPatientsPage() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const { data, isLoading, isError, refetch } = useDoctorPatients({
    search: debounced || undefined,
    page,
    limit: LIMIT,
  });

  const result = data?.data ?? {};
  const patients = result.patients ?? result.items ?? result.data ?? [];

  return (
    <div>
      <PageHeader title="My patients" subtitle="Patients you've consulted." />

      <div className="mb-5 max-w-sm">
        <SearchBar value={search} onChange={onSearchChange} placeholder="Search patients..." />
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <Spinner label="Loading patients..." />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load patients"
          message="Something went wrong while fetching your patient list."
          onRetry={refetch}
        />
      ) : patients.length === 0 ? (
        <EmptyState title="No patients found" message="Patients you've consulted will appear here." />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Patient</th>
                  <th className="px-6 py-3.5">Contact</th>
                  <th className="px-6 py-3.5">Visits</th>
                  <th className="px-6 py-3.5">Last visit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((p) => {
                  const name = p.fullName ?? p.name ?? 'Patient';
                  const visits = p.visits ?? p.appointmentCount ?? p.totalVisits ?? 0;
                  const lastVisit = p.lastVisit ?? p.lastVisitDate ?? '—';
                  return (
                    <tr key={p.id ?? p._id} className="transition hover:bg-slate-50/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={name} />
                          <span className="font-semibold text-slate-800">{name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="flex items-center gap-1.5 text-slate-600"><Mail className="h-3.5 w-3.5" />{p.email ?? '—'}</p>
                        <p className="flex items-center gap-1.5 text-slate-400"><Phone className="h-3.5 w-3.5" />{p.phone ?? '—'}</p>
                      </td>
                      <td className="px-6 py-4"><Badge status="ACTIVE">{visits} visits</Badge></td>
                      <td className="px-6 py-4 text-slate-500">{lastVisit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Pagination meta={result.meta} page={page} onChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}