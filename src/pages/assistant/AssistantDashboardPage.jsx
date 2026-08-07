import { Link } from 'react-router-dom';
import { Inbox, ClipboardList, ListChecks, UserCheck, ArrowRight, Stethoscope } from 'lucide-react';
import StatCard from '@/components/common/StatCard';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';

const requests = [
  { id: 1, patient: 'Maria Gomez', time: 'Today, 3:30 PM', status: 'PENDING' },
  { id: 2, patient: 'Alex Johnson', time: 'Today, 4:00 PM', status: 'PENDING' },
];

export default function AssistantDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Assistant overview"
        subtitle="Requests and queue status across your assigned doctor."
        action={
          <Link to="/assistant/requests" className="btn-primary">
            <Inbox className="h-4 w-4" />
            View requests
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Inbox} label="Pending requests" value="3" accent="amber" />
        <StatCard icon={ClipboardList} label="Appointments today" value="21" accent="indigo" />
        <StatCard icon={ListChecks} label="In queue" value="9" accent="teal" />
        <StatCard icon={UserCheck} label="Patients served" value="12" accent="emerald" trend="+4" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Appointment requests</h2>
            <Link to="/assistant/requests" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Manage <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white">
                  {r.patient.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{r.patient}</p>
                  <p className="text-xs text-slate-400">{r.time}</p>
                </div>
                <Badge status={r.status}>{r.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-brand-gradient p-6 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Stethoscope className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">Assigned doctor</p>
              <p className="text-lg font-extrabold">Dr. Ayesha Siddiqui</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-extrabold">Q-04</p>
              <p className="text-xs text-indigo-100">Next in queue</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-extrabold">~20 min</p>
              <p className="text-xs text-indigo-100">Avg. wait time</p>
            </div>
          </div>
          <Link to="/assistant/queue" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50">
            <ListChecks className="h-4 w-4" />
            Open queue board
          </Link>
        </div>
      </div>
    </div>
  );
}