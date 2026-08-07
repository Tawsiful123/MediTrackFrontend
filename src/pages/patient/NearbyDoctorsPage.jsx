import { Link } from 'react-router-dom';
import { MapPin, CalendarCheck, Stethoscope as StethoscopeIcon } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import NearbyDoctorsMap from '@/components/maps/NearbyDoctorsMap';
import Badge from '@/components/common/Badge';

const nearby = [
  { id: 1, name: 'Dr. Ayesha Siddiqui', spec: 'Cardiology', distance: '0.8 km', fee: 60, rating: 4.8 },
  { id: 2, name: 'Dr. John Carter', spec: 'Dermatology', distance: '1.4 km', fee: 45, rating: 4.6 },
  { id: 3, name: 'Dr. Ethan Brooks', spec: 'Orthopedics', distance: '2.1 km', fee: 55, rating: 4.7 },
];

export default function NearbyDoctorsPage() {
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
          {nearby.map((d) => (
            <Link
              key={d.id}
              to={`/doctors/${d.id}`}
              className="card flex items-center gap-4 p-4 transition hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-white">
                <StethoscopeIcon />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-slate-900">{d.name}</p>
                <p className="text-xs text-slate-500">{d.spec} · ⭐ {d.rating}</p>
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-indigo-600">
                  <MapPin className="h-3 w-3" /> {d.distance} away
                </p>
              </div>
              <Badge status="ACTIVE">${d.fee}</Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}