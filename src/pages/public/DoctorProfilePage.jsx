import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Building2, Clock, Star, ChevronRight, CalendarCheck,
  MessageSquare,
} from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import StarRating from '@/components/common/StarRating';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { formatCurrency } from '@/utils/formatCurrency';
import { useDoctorDetail } from '@/hooks/doctors/useDoctorDetail';
import { useDoctorReviews } from '@/hooks/doctors/useDoctorReviews';

export default function DoctorProfilePage() {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useDoctorDetail(id);
  const { data: reviewsData, isLoading: reviewsLoading } = useDoctorReviews(id, { limit: 10 });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <Spinner label="Loading doctor profile..." />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState
          title="Could not load doctor profile"
          message="The doctor you're looking for may not exist or the service is unavailable."
          onRetry={refetch}
        />
      </div>
    );
  }

  const doctor = data.data;
  const specName = doctor.specialization?.name ?? doctor.specialization ?? 'General Practice';
  const reviews = reviewsData?.data?.reviews ?? reviewsData?.data?.items ?? reviewsData?.data ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/doctors" className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
        <ChevronRight className="h-4 w-4 rotate-180" />
        Back to doctors
      </Link>

      <div className="card mt-5 overflow-hidden">
        <div className="bg-brand-gradient h-28" />
        <div className="p-6 sm:p-8">
          <div className="-mt-20 flex flex-col gap-4 sm:flex-row sm:items-end">
            <Avatar name={doctor.fullName} size="lg" className="h-24 w-24 border-4 border-white text-3xl shadow-lg" />
            <div className="flex-1 pt-14 sm:pt-0">
              <h1 className="text-2xl font-extrabold text-slate-900">{doctor.fullName}</h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {specName} · {doctor.experienceYears} years experience
              </p>
              <div className="mt-2 flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {doctor.averageRating ? Number(doctor.averageRating).toFixed(1) : 'New'}
                  {doctor.reviewCount > 0 && (
                    <span className="font-normal text-slate-400">({doctor.reviewCount} reviews)</span>
                  )}
                </span>
                {doctor.verificationStatus && (
                  <span className="badge bg-green-100 text-green-800">Verified</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to={`/patient/book/${id}`} className="btn-primary py-3">
                <CalendarCheck className="h-4 w-4" />
                Book appointment
              </Link>
            </div>
          </div>

          <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-400">Hospital</dt>
                <dd className="text-sm font-semibold text-slate-800">{doctor.hospitalName ?? '—'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-400">Clinic address</dt>
                <dd className="text-sm font-semibold text-slate-800">{doctor.clinicAddress ?? '—'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-400">Consultation fee</dt>
                <dd className="text-sm font-semibold text-slate-800">{formatCurrency(doctor.consultationFee)}</dd>
              </div>
            </div>
          </dl>

          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">About</h2>
            <p className="mt-2 leading-relaxed text-slate-600">{doctor.bio ?? 'No bio provided yet.'}</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">Patient reviews</h2>
        </div>
        <div className="mt-5 space-y-4">
          {reviewsLoading ? (
            <div className="py-8 text-center">
              <Spinner label="Loading reviews..." />
            </div>
          ) : reviews.length === 0 ? (
            <EmptyState title="No reviews yet" message="Be the first to review this doctor after your visit." />
          ) : (
            reviews.map((r) => {
              const author = r.patient?.fullName ?? r.author ?? 'Anonymous';
              return (
                <div key={r.id} className="card p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={author} size="sm" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{author}</p>
                        <p className="text-xs text-slate-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</p>
                      </div>
                    </div>
                    <StarRating value={r.rating} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{r.comment}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
