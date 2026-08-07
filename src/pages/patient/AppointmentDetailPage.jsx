import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock, MapPin, Stethoscope } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

const appointment = {
  doctor: 'Dr. Ayesha Siddiqui',
  spec: 'Cardiology',
  date: 'Aug 10, 2026',
  time: '10:30 AM',
  status: 'CONFIRMED',
  clinic: 'City General Hospital, Room 3',
  address: '134 Heartbeat Avenue, Springfield',
  fee: 60,
};

export default function AppointmentDetailPage() {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Appointment details"
        subtitle={`Booking reference #${id}`}
        action={
          <Link to="/patient/appointments" className="btn-outline">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="bg-brand-gradient px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">Your appointment</p>
              <h2 className="mt-1 text-2xl font-extrabold">{appointment.date} · {appointment.time}</h2>
            </div>
            <Badge status={appointment.status} className="bg-white/90">{appointment.status}</Badge>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Doctor</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-slate-900">{appointment.doctor}</p>
                <p className="text-sm text-slate-500">{appointment.spec}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</p>
            <div className="mt-2 flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-slate-900">{appointment.clinic}</p>
                <p className="text-sm text-slate-500">{appointment.address}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <CalendarDays className="h-4 w-4" /> Date & time
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800">{appointment.date} · {appointment.time}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <Clock className="h-4 w-4" /> Fee
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800">${appointment.fee}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 px-6 py-4 sm:px-8">
          <Button variant="outline" size="sm">Reschedule</Button>
          <Button variant="danger" size="sm">Cancel appointment</Button>
          {appointment.status === 'COMPLETED' && (
            <Button variant="primary" size="sm">
              Leave a review
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}