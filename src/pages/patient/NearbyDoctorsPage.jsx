import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  CalendarCheck,
  Clock,
  Crosshair,
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  Star,
} from 'lucide-react';
import NearbyDoctorsMap from '@/components/maps/NearbyDoctorsMap';
import Select from '@/components/common/Select';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import Avatar from '@/components/common/Avatar';
import { useNearbyDoctors } from '@/hooks/doctors/useNearbyDoctors';
import { useSpecializations } from '@/hooks/specializations/useSpecializations';
import { formatCurrency } from '@/utils/formatCurrency';
import { buildDirectionsUrl } from '@/utils/maps';

const DEFAULT_COORDS = { lat: 24.8607, lng: 67.0011 };
const RADIUS_OPTIONS = [5, 10, 25, 50];
const GEO_OPTIONS = { timeout: 8000, maximumAge: 60000 };

export default function NearbyDoctorsPage() {
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [geoStatus, setGeoStatus] = useState(() =>
    typeof navigator !== 'undefined' && navigator.geolocation ? 'locating' : 'error',
  );
  const [specialization, setSpecialization] = useState('');
  const [radius, setRadius] = useState(10);
  const [selectedId, setSelectedId] = useState(null);

  const handlePositionSuccess = (pos) => {
    setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    setGeoStatus('located');
  };

  const handlePositionError = (err) => {
    setGeoStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error');
  };

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      handlePositionSuccess,
      handlePositionError,
      GEO_OPTIONS,
    );
  }, []);

  const locate = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }
    setGeoStatus('locating');
    navigator.geolocation.getCurrentPosition(
      handlePositionSuccess,
      handlePositionError,
      GEO_OPTIONS,
    );
  };

  const { data, isLoading, isError, isFetching, refetch } = useNearbyDoctors({
    lat: coords.lat,
    lng: coords.lng,
    specialization: specialization || undefined,
    radius,
  });

  const { data: specData } = useSpecializations();
  const specOptions = (specData?.data ?? [])
    .map((s) => {
      const name = typeof s === 'string' ? s : s?.name;
      return name ? { value: name, label: name } : null;
    })
    .filter(Boolean);

  const result = data?.data ?? {};
  const doctors = result.doctors ?? result.items ?? result.data ?? [];

  const geoLabel = useMemo(() => {
    if (geoStatus === 'locating') return 'Locating you...';
    if (geoStatus === 'denied') return 'Location access blocked — using default city';
    if (geoStatus === 'error') return 'Could not detect location — using default city';
    return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
  }, [geoStatus, coords]);

  const geoStateClass =
    geoStatus === 'locating'
      ? 'bg-indigo-100 text-indigo-600'
      : geoStatus === 'located'
        ? 'bg-teal-100 text-teal-600'
        : 'bg-amber-100 text-amber-600';

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-0 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl" />
        <div className="relative">
          <span className="badge bg-white/20 text-white">Find care near you</span>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">Nearby doctors</h1>
          <p className="mt-2 max-w-xl text-sm text-indigo-100">
            Discover verified doctors around your location — compare distances, reviews and fees,
            then get turn-by-turn directions in one tap.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={locate}
              disabled={geoStatus === 'locating'}
              className="btn bg-white text-indigo-700 shadow-md hover:bg-indigo-50 focus:ring-white"
            >
              {geoStatus === 'locating' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Crosshair className="h-4 w-4" />
              )}
              {geoStatus === 'locating' ? 'Locating...' : 'Use my location'}
            </button>
            <Link
              to="/patient/appointments"
              className="btn border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <CalendarCheck className="h-4 w-4" />
              My appointments
            </Link>
          </div>
        </div>
      </section>

      <div className="card flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-end">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${geoStateClass}`}
          >
            {geoStatus === 'locating' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <MapPin className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">Your location</p>
            <p className="truncate text-xs text-slate-500">{geoLabel}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:w-[440px]">
          <Select
            id="nearby-specialization"
            label="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            options={specOptions}
            placeholder="All specializations"
          />
          <Select
            id="nearby-radius"
            label="Search radius"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            options={RADIUS_OPTIONS.map((r) => ({ value: r, label: `${r} km` }))}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card relative h-[420px] overflow-hidden lg:col-span-3 lg:h-[560px]">
          {isFetching && !isLoading && (
            <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-md backdrop-blur">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Updating results...
            </div>
          )}
          <NearbyDoctorsMap
            doctors={doctors}
            center={coords}
            selectedId={selectedId}
            onSelectDoctor={setSelectedId}
          />
        </div>

        <div className="min-w-0 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">Doctors near you</h2>
            <span className="badge bg-indigo-100 text-indigo-700">
              {isLoading ? '...' : `${doctors.length} found`}
            </span>
          </div>

          {isLoading ? (
            <div className="card flex items-center justify-center py-16">
              <Spinner label="Finding doctors near you..." />
            </div>
          ) : isError ? (
            <ErrorState
              title="Could not load nearby doctors"
              message="Something went wrong while searching around your location."
              onRetry={refetch}
            />
          ) : doctors.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No doctors nearby"
              message={`No doctors found within ${radius} km of your location. Try a wider radius or a different specialization.`}
              action={
                <button className="btn-outline" onClick={() => setRadius(50)}>
                  Expand radius to 50 km
                </button>
              }
            />
          ) : (
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <DoctorListItem
                  key={doctor.id}
                  doctor={doctor}
                  origin={coords}
                  isActive={String(doctor.id) === String(selectedId)}
                  onClick={() => setSelectedId(doctor.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">
        Showing results within {radius} km · Distances are approximate and based on clinic location.
      </p>
    </div>
  );
}

function DoctorListItem({ doctor, origin, isActive, onClick }) {
  const name = typeof doctor.fullName === 'string' ? doctor.fullName : doctor.name ?? 'Doctor';
  const spec =
    doctor.specialization?.name ?? doctor.specialization ?? doctor.spec ?? 'General Practice';
  const distance =
    typeof doctor.distanceKm === 'number'
      ? `${doctor.distanceKm.toFixed(1)} km`
      : doctor.distance ?? '';
  const directions = buildDirectionsUrl(doctor, origin);
  const rating = Number(doctor.averageRating);

  return (
    <article
      onClick={onClick}
      className={`card cursor-pointer p-4 transition hover:-translate-y-0.5 hover:shadow-lg ${
        isActive ? 'ring-2 ring-indigo-500' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <Avatar name={name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-bold text-slate-900">{name}</h3>
            {distance && (
              <span className="badge bg-teal-100 text-teal-800">
                <MapPin className="mr-1 h-3 w-3" />
                {distance} away
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm font-medium text-slate-500">{spec}</p>
        </div>
        {doctor.consultationFee > 0 && (
          <span className="badge bg-indigo-100 text-indigo-700">
            {formatCurrency(doctor.consultationFee)}
          </span>
        )}
      </div>

      {(doctor.clinicAddress || doctor.hospitalName) && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
          {doctor.clinicAddress && (
            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{doctor.clinicAddress}</span>
            </span>
          )}
          {doctor.hospitalName && (
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              {doctor.hospitalName}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-3 text-xs">
          {Number.isFinite(rating) && rating > 0 ? (
            <span className="flex items-center gap-1 font-semibold text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {rating.toFixed(1)}
            </span>
          ) : (
            <span className="text-slate-400">New doctor</span>
          )}
          {doctor.experienceYears > 0 && (
            <span className="flex items-center gap-1 text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              {doctor.experienceYears} yrs exp
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {directions && (
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-3 py-2 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <Navigation className="h-3.5 w-3.5" />
              Directions
            </a>
          )}
          <Link
            to={`/doctors/${doctor.id}`}
            className="btn-outline px-3 py-2 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Profile
          </Link>
        </div>
      </div>
    </article>
  );
}