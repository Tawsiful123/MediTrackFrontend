import { Link } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import EmptyState from '@/components/common/EmptyState';

const appointments = [
  { id: 'a1', doctor: 'Dr. Ayesha Siddiqui', spec: 'Cardiology', date: 'Aug 10, 2026', time: '10:30 AM', status: 'CONFIRMED', fee: 60 },
  { id: 'a2', doctor: 'Dr. John Carter', spec: 'Dermatology', date: 'Aug 14, 2026', time: '2:00 PM', status: 'PENDING', fee: 45 },
  { id: 'a3', doctor: 'Dr. Priya Sharma', spec: 'Pediatrics', date: 'Jul 28, 2026', time: '11:00 AM', status: 'COMPLETED', fee: 55 },
];

export default function MyAppointmentsPage() {
  return (
    <div>
      <PageHeader
        title="My appointments"
        subtitle="Manage your bookings, reschedule, or cancel."
        action={
          <Link to="/doctors" className="btn-primary">
            <Plus className="h-4 w-4" />
            New appointment
          </Link>
        }
      />

      {appointments.length === 0 ? (
        <EmptyState
          title="No appointments yet"
          message="Book your first appointment with one of our verified doctors."
          action={<Link to="/doctors" className="btn-primary">Find a doctor</Link>}
        />
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <Link
              key={a.id}
              to={`/patient/appointments/${a.id}`}
              className="card group flex flex-col gap-4 p-5 transition hover:shadow-lg sm:flex-row sm:items-center"
            >
              <Avatar name={a.doctor} size="lg" />
              <div className="flex-1">
                <p className="font-bold text-slate-900 group-hover:text-indigo-700">{a.doctor}</p>
                <p className="text-sm text-slate-500">
                  {a.spec} · {a.date} at {a.time}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">${a.fee}</p>
                  <Badge status={a.status}>{a.status}</Badge>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}