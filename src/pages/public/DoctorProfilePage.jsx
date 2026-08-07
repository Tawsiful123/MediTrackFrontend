import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Building2, Clock, Star, ChevronRight, CalendarCheck,
  MessageSquare,
} from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import StarRating from '@/components/common/StarRating';
import { formatCurrency } from '@/utils/formatCurrency';

const doctor = {
  fullName: 'Dr. Ayesha Siddiqui',
  email: 'ayesha@meditrack.com',
  phone: '+1 555 010 2030',
  specialization: { name: 'Cardiology' },
  hospitalName: 'City General Hospital',
  clinicAddress: '134 Heartbeat Avenue, Springfield',
  consultationFee: 60,
  experienceYears: 12,
  averageRating: 4.8,
  reviewCount: 214,
  bio: 'Board-certified cardiologist with over a decade of experience in preventive cardiology and heart failure management. Committed to compassionate, evidence-based care.',
};

const reviews = [
  { id: 1, author: 'Rahul Verma', rating: 5, date: 'Mar 12, 2026', comment: 'Dr. Siddiqui took the time to explain everything clearly. Highly recommended!' },
  { id: 2, author: 'Sarah Blake', rating: 4, date: 'Feb 28, 2026', comment: 'Very professional and caring. Waiting room was quick too.' },
  { id: 3, author: 'Michael Osei', rating: 5, date: 'Feb 10, 2026', comment: 'Best cardiologist I have visited. Very thorough examination.' },
];

export default function DoctorProfilePage() {
  const { id } = useParams();

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
                {doctor.specialization.name} · {doctor.experienceYears} years experience
              </p>
              <div className="mt-2 flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {doctor.averageRating}
                  <span className="font-normal text-slate-400">({doctor.reviewCount} reviews)</span>
                </span>
                <span className="badge bg-green-100 text-green-800">Available Today</span>
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
                <dd className="text-sm font-semibold text-slate-800">{doctor.hospitalName}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-400">Clinic address</dt>
                <dd className="text-sm font-semibold text-slate-800">{doctor.clinicAddress}</dd>
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
            <p className="mt-2 leading-relaxed text-slate-600">{doctor.bio}</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">Patient reviews</h2>
        </div>
        <div className="mt-5 space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={r.author} size="sm" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{r.author}</p>
                    <p className="text-xs text-slate-400">{r.date}</p>
                  </div>
                </div>
                <StarRating value={r.rating} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}