import { Link } from 'react-router-dom';
import {
  Users, CalendarCheck, Star, ArrowRight, TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar,
} from 'recharts';
import StatCard from '@/components/common/StatCard';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';

const appointmentsData = [
  { month: 'Jan', appointments: 320, patients: 280 },
  { month: 'Feb', appointments: 410, patients: 350 },
  { month: 'Mar', appointments: 380, patients: 330 },
  { month: 'Apr', appointments: 520, patients: 440 },
  { month: 'May', appointments: 470, patients: 400 },
  { month: 'Jun', appointments: 610, patients: 510 },
];

const pendingDoctors = [
  { id: 1, name: 'Dr. Omar Farouk', spec: 'Neurology', submitted: '2 days ago' },
  { id: 2, name: 'Dr. Emily Watson', spec: 'Pediatrics', submitted: '5 days ago' },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Admin dashboard"
        subtitle="Platform overview across users, doctors, and appointments."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total users" value="8,420" accent="indigo" trend="+12%" />
        <StatCard icon={CalendarCheck} label="Appointments" value="1,240" accent="purple" trend="+8%" />
        <StatCard icon={Star} label="Avg. rating" value="4.8" accent="amber" />
        <StatCard icon={TrendingUp} label="Revenue" value="$48.2k" accent="emerald" trend="+18%" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">Growth overview</h2>
          <p className="mt-1 text-sm text-slate-500">Appointments & new patients, last 6 months</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={appointmentsData}>
                <defs>
                  <linearGradient id="ap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                <Area type="monotone" dataKey="appointments" stroke="#6366f1" strokeWidth={2.5} fill="url(#ap)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Pending approvals</h2>
            <Link to="/admin/doctors/pending" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Review <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {pendingDoctors.map((d) => (
              <div key={d.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-sm font-bold text-white">
                    {d.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{d.name}</p>
                    <p className="text-xs text-slate-400">{d.spec} · {d.status.toLowerCase()}</p>
                  </div>
                  <Badge status="PENDING">Pending</Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Doctor mix</h3>
            <div className="mt-3 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentsData.slice(0, 4)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                  <Bar dataKey="patients" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}