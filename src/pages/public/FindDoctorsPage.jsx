import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import DoctorCard from '@/components/doctors/DoctorCard';
import DoctorFilterBar from '@/components/doctors/DoctorFilterBar';
import Spinner from '@/components/common/Spinner';
import Pagination from '@/components/common/Pagination';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { useDoctorsList } from '@/hooks/doctors/useDoctorsList';
import { useSpecializations } from '@/hooks/specializations/useSpecializations';

export default function FindDoctorsPage() {
  const [filters, setFilters] = useState({ search: '', specialization: '', sortBy: 'rating' });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  const changeFilters = (next) => {
    setFilters((f) => ({ ...f, ...next }));
    setPage(1);
  };

  const { data, isLoading, isError, refetch } = useDoctorsList({
    search: debouncedSearch || undefined,
    specialization: filters.specialization || undefined,
    sortBy: filters.sortBy,
    page,
    limit: 9,
  });

  const { data: specData } = useSpecializations();
  const specNames = (specData?.data ?? []).map((s) => (typeof s === 'string' ? s : s.name)).filter(Boolean);

  const result = data?.data ?? {};
  const doctors = result.doctors ?? result.items ?? result.data ?? [];
  const totalPages = result.meta?.totalPages ?? (result.meta?.limit > 0 ? Math.ceil((result.meta?.total ?? 0) / result.meta.limit) : 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <span className="badge bg-indigo-100 text-indigo-700">Find your doctor</span>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Browse our doctors</h1>
        <p className="mt-3 text-slate-500">
          Search by name, specialization, or location — then book directly from their profile.
        </p>
      </div>

      <div className="card mt-8 flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={filters.search}
            onChange={(e) => changeFilters({ search: e.target.value })}
            placeholder="Search by doctor or specialization..."
            className="input pl-9"
          />
        </div>
        <DoctorFilterBar
          filters={filters}
          specializations={specNames}
          onChange={changeFilters}
        />
      </div>

      {isLoading ? (
        <div className="mt-12">
          <Spinner fullScreen label="Loading doctors..." />
        </div>
      ) : isError ? (
        <div className="mt-12">
          <ErrorState
            title="Could not load doctors"
            message="Something went wrong while fetching the doctor list."
            onRetry={refetch}
          />
        </div>
      ) : doctors.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="No doctors found"
            message="Try adjusting your search or filters."
            action={
              <button
                className="btn-outline"
                onClick={() => changeFilters({ search: '', specialization: '', sortBy: 'rating' })}
              >
                Clear filters
              </button>
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination meta={result.meta} page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </>
      )}

      <div className="mt-16 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 p-10 text-center shadow-xl">
        <h2 className="text-2xl font-extrabold text-white">Can't find who you're looking for?</h2>
        <p className="mx-auto mt-2 max-w-lg text-indigo-100">
          Join MediTrack and get personalized doctor recommendations near you.
        </p>
        <Link to="/register/patient" className="btn-primary mt-6 bg-white text-indigo-700 hover:bg-indigo-50">
          Create free account
        </Link>
      </div>
    </div>
  );
}
