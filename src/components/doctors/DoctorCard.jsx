import { Link } from 'react-router-dom';
import { Stethoscope, MapPin, Star, ChevronRight, Clock, Building2 } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import { formatCurrency } from '@/utils/formatCurrency';

export default function DoctorCard({ doctor }) {
  return (
    <Link
      to={`/doctors/${doctor.id}`}
      className="card group flex flex-col p-5 transition hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex items-start gap-4">
        <Avatar name={doctor.fullName} size="lg" />
        <div className="min-w-0">
          <h3 className="truncate font-bold text-slate-900 group-hover:text-indigo-700">
            {doctor.fullName}
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <Stethoscope className="h-4 w-4 text-indigo-500" />
            {doctor.specialization?.name ?? 'General Practice'}
          </p>
        </div>
        <span className="ml-auto badge bg-green-100 text-green-800">
          {doctor.verificationStatus ?? 'Approved'}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
        {doctor.clinicAddress && (
          <span className="flex min-w-0 items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate">{doctor.clinicAddress}</span>
          </span>
        )}
        {doctor.hospitalName && (
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
            {doctor.hospitalName}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm font-semibold text-amber-500">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {doctor.averageRating ? doctor.averageRating.toFixed(1) : 'New'}
          </span>
          {doctor.experienceYears > 0 && (
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              {doctor.experienceYears} yrs
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-base font-bold text-slate-900">
            {formatCurrency(doctor.consultationFee)}
          </span>
          <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" />
        </div>
      </div>
    </Link>
  );
}