import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, Phone, Stethoscope } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

const appointment = {
  patient: 'Rahul Verma',
  phone: '+1 555 010 2233',
  doctor: 'Dr. Ayesha Siddiqui',
  spec: 'Cardiology',
  date: 'Aug 10, 2026',
  time: '10:30 AM',
  status: 'CONFIRMED',
  reason: 'Routine follow-up on blood pressure medication.',
  fee: 60,
};

export default function AppointmentDetailPage() {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Appointment details"
        subtitle={`Reference #${id}`}
        action={
          <Link to="/assistant/appointments" className="btn-outline">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="bg-brand-gradient px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">Appointment</p>
              <h2 className="mt-1 text-2xl font-extrabold">{appointment.date} · {appointment.time}</h2>
            </div>
            <Badge status={appointment.status} className="bg-white/90">{appointment.status}</Badge>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Patient</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white">
                {appointment.patient.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </span>
              <div>
                <p className="font-bold text-slate-900">{appointment.patient}</p>
                <p className="flex items-center gap-1 text-sm text-slate-500">
                  <Phone className="h-3.5 w-3.5" /> {appointment.phone}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Doctor</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-sm font-bold text-white">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-slate-900">{appointment.doctor}</p>
                <p className="text-sm text-slate-500">{appointment.spec}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <CalendarDays className="h-4 w-4" /> Reason
            </p>
            <p className="mt-2 text-sm text-slate-700">{appointment.reason}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <MapPin className="h-4 w-4" /> Location
            </p>
            <p className="mt-2 text-sm text-slate-700">City General Hospital, Room 3</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 sm:px-8">
          <p className="text-sm text-slate-500">
            Consultation fee: <span className="font-bold text-slate-900">${appointment.fee}</span>
          </p>
          <Button variant="outline" size="sm">
            Reschedule
          </Button>
        </div>
      </div>
    </div>
  );
}