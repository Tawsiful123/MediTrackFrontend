import { Link } from 'react-router-dom';
import { Users, CalendarDays, Star, ListChecks, ArrowRight, Clock } from 'lucide-react';
import StatCard from '@/components/common/StatCard';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';

const todayPatients = [
  { id: 1, name: 'Rahul Verma', time: '10:00 AM', queueNo: 'Q-01', status: 'WAITING' },
  { id: 2, name: 'Fatima Rahman', time: '10:30 AM', queueNo: 'Q-02', status: 'CALLED' },
  { id: 3, name: 'David Chen', time: '11:00 AM', queueNo: 'Q-03', status: 'IN_CONSULTATION' },
  { id: 4, name: 'Olivia Brown', time: '11:30 AM', queueNo: 'Q-04', status: 'WAITING' },
];

export default function DoctorDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Good morning, Dr. Siddiqui"
        subtitle="Here's your practice overview for today."
        action={
          <Link to="/doctor/schedule" className="btn-primary">
            <CalendarDays className="h-4 w-4" />
            Manage schedule
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Patients today" value="18" accent="indigo" trend="+6 vs yesterday" />
        <StatCard icon={CalendarDays} label="Appointments today" value="14" accent="purple" />
        <StatCard icon={ListChecks} label="In queue" value="7" accent="teal" />
        <StatCard icon={Star} label="Average rating" value="4.8" accent="amber" trend="+0.2" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Today's patients</h2>
              <Link to="/doctor/patients/today" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-5 divide-y divide-slate-100">
              {todayPatients.map((p) => (
                <div key={p.id} className="flex items-center gap-4 py-3.5">
                  <span className="w-12 text-sm font-bold text-slate-400">{p.queueNo}</span>
                  <Avatar name={p.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800">{p.name}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" /> {p.time}
                    </p>
                  </div>
                  <Badge status={p.status}>{p.status.replace('_', ' ')}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-brand-gradient p-6 text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">Your next patient</p>
            <p className="mt-2 text-2xl font-extrabold">James Chen</p>
            <p className="mt-1 text-sm text-indigo-100">11:00 AM · Consult Room 3</p>
            <Link to="/doctor/queue" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50">
              <ListChecks className="h-4 w-4" />
              Open queue
            </Link>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Today at a glance</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { label: 'Start time', value: '9:00 AM' },
                { label: 'Slots filled', value: '8 / 10' },
                { label: 'Revenues', value: '$480.00' },
              ].map((r) => (
                <li key={r.label} className="flex items-center justify-between border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                  <span className="text-slate-500">{r.label}</span>
                  <span className="font-bold text-slate-800">{r.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}