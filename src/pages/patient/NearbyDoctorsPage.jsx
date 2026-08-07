import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CalendarCheck, Stethoscope as StethoscopeIcon } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import NearbyDoctorsMap from '@/components/maps/NearbyDoctorsMap';
import Badge from '@/components/common/Badge';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { formatCurrency } from '@/utils/formatCurrency';
import { useNearbyDoctors } from '@/hooks/doctors/useNearbyDoctors';

const DEFAULT_COORDS = { lat: 24.8607, lng: 67.0011 };

export default function NearbyDoctorsPage() {
  const [coords, setCoords] = useState(DEFAULT_COORDS);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { timeout: 5000 },
    );
  }, []);

  const { data, isLoading, isError, refetch } = useNearbyDoctors(coords);

  const result = data?.data ?? {};
  const nearby = result.doctors ?? result.items ?? result.data ?? [];

  return (
    <div>
      <PageHeader
        title="Nearby doctors"
        subtitle="Find verified doctors closest to you."
        action={
          <Link to="/patient/appointments" className="btn-outline">
            <CalendarCheck className="h-4 w-4" />
            My appointments
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <NearbyDoctorsMap />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">Doctors near you</h2>
          {isLoading ? (
            <div className="py-12 text-center">
              <Spinner label="Finding doctors near you..." />
            </div>
          ) : isError ? (
            <ErrorState
              title="Could not load nearby doctors"
              message="Something went wrong while searching for nearby doctors."
              onRetry={refetch}
            />
          ) : nearby.length === 0 ? (
            <EmptyState
              title="No doctors nearby"
              message="Try searching in the full directory instead."
              action={<Link to="/doctors" className="btn-primary">Browse all doctors</Link>}
            />
          ) : (
            nearby.map((d) => {
              const name = typeof d.fullName === 'string' ? d.fullName : d.name ?? 'Doctor';
              const spec = d.specialization?.name ?? d.specialization ?? d.spec ?? '';
              const distance =
                typeof d.distanceKm === 'number'
                  ? `${d.distanceKm.toFixed(1)} km`
                  : d.distance ?? '';
              return (
                <Link
                  key={d.id}
                  to={`/doctors/${d.id}`}
                  className="card flex items-center gap-4 p-4 transition hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-white">
                    <StethoscopeIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500">
                      {[spec, d.averageRating ? `⭐ ${Number(d.averageRating).toFixed(1)}` : ''].filter(Boolean).join(' · ')}
                    </p>
                    {distance && (
                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-indigo-600">
                        <MapPin className="h-3 w-3" /> {distance} away
                      </p>
                    )}
                  </div>
                  {d.consultationFee > 0 && (
                    <Badge status="ACTIVE">{formatCurrency(d.consultationFee)}</Badge>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
