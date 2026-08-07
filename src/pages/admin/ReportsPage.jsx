import { Link } from 'react-router-dom';
import { Download, TrendingUp, Users, CalendarCheck, DollarSign } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import Button from '@/components/common/Button';

const revenue = [
  { month: 'Jan', value: 8200 },
  { month: 'Feb', value: 9400 },
  { month: 'Mar', value: 8800 },
  { month: 'Apr', value: 11000 },
  { month: 'May', value: 12600 },
  { month: 'Jun', value: 14800 },
];

const distribution = [
  { name: 'Patients', value: 62, color: '#6366f1' },
  { name: 'Doctors', value: 20, color: '#8b5cf6' },
  { name: 'Assistants', value: 12, color: '#14b8a6' },
  { name: 'Admins', value: 6, color: '#f59e0b' },
];

const topDoctors = [
  { name: 'Dr. Ayesha Siddiqui', appointments: 142, rating: 4.8 },
  { name: 'Dr. Priya Sharma', appointments: 118, rating: 4.9 },
  { name: 'Dr. John Carter', appointments: 96, rating: 4.6 },
];

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Platform analytics and insights."
        action={
          <Button variant="outline">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Active users" value="8,420" accent="indigo" trend="+12%" />
        <StatCard icon={CalendarCheck} label="Appointments" value="1,240" accent="purple" trend="+8%" />
        <StatCard icon={DollarSign} label="Revenue (30d)" value="$48.2k" accent="emerald" trend="+18%" />
        <StatCard icon={TrendingUp} label="Conversion" value="6.4%" accent="amber" trend="+0.8%" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">Revenue trend</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} formatter={(v) => [`$${v}`, 'Revenue']} />
                <Area type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900">User distribution</h2>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {distribution.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {distribution.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="font-bold text-slate-800">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Top performing doctors</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3.5">Doctor</th>
              <th className="px-6 py-3.5">Appointments</th>
              <th className="px-6 py-3.5">Rating</th>
              <th className="px-6 py-3.5">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topDoctors.map((d, i) => (
              <tr key={d.name} className="transition hover:bg-slate-50/60">
                <td className="px-6 py-4 font-semibold text-slate-800">{i + 1}. {d.name}</td>
                <td className="px-6 py-4 text-slate-500">{d.appointments}</td>
                <td className="px-6 py-4 text-slate-500">★ {d.rating}</td>
                <td className="px-6 py-4">
                  <Link to={`/doctors/d${i + 1}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}