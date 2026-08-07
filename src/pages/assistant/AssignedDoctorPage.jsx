import { Link } from 'react-router-dom';
import { Stethoscope, MapPin, Phone, CalendarDays } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

const doctor = {
  name: 'Dr. Ayesha Siddiqui',
  role: 'Cardiologist',
  clinic: 'City General Hospital',
  phone: '+1 555 010 2030',
  email: 'ayesha@meditrack.com',
  address: '134 Stroke Avenue, Springfield',
  todayStatus: 'Available',
};

export default function AssignedDoctorPage() {
  return (
    <div>
      <PageHeader
        title="Assigned doctor"
        subtitle="The doctor you're assisting."
        action={
          <Link to="/assistant/appointments" className="btn-outline">
            <CalendarDays className="h-4 w-4" /> Schedule
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="bg-brand-gradient px-8 py-10 text-white">
          <div className="flex items-center gap-6">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white/15 text-2xl font-extrabold backdrop-blur">
              {doctor.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
            <div>
              <h2 className="text-2xl font-extrabold">{doctor.name}</h2>
              <p className="mt-1 flex items-center gap-2 text-indigo-100">
                <Stethoscope className="h-4 w-4" /> {doctor.role}
              </p>
              <span className="badge mt-3 bg-white/90 text-emerald-700">{doctor.todayStatus} today</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Clinic</p>
              <p className="mt-1 font-semibold text-slate-800">{doctor.clinic}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Phone className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</p>
              <p className="mt-1 font-semibold text-slate-800">{doctor.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Hours</p>
              <p className="mt-1 font-semibold text-slate-800">Mon – Sat · 9:00 AM – 5:00 PM</p>
            </div>
          </div>
          <div>
            <Link to="/assistant/queue" className="btn-primary w-full">
              Manage today's queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}