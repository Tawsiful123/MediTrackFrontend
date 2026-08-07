import { Download, TrendingUp, Users, CalendarCheck, DollarSign, Star } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { useAdminReports } from '@/hooks/admin/useAdminReports';
import { formatCurrency } from '@/utils/formatCurrency';

const COLORS = ['#6366f1', '#8b5cf6', '#14b8a6', '#f59e0b', '#f43f5e', '#0ea5e9'];

const normalizeRevenue = (trend = []) =>
  (Array.isArray(trend) ? trend : []).map((d) => ({
    month: d.month ?? d.label ?? d.date ?? '—',
    revenue: Number(d.revenue ?? d.amount ?? d.value ?? 0),
  }));

const normalizeDistribution = (dist = []) =>
  (Array.isArray(dist) ? dist : []).map((d) => ({
    name: d.name ?? d.role ?? 'Other',
    value: Number(d.value ?? d.count ?? 0),
  }));

const normalizeTopDoctors = (top = []) =>
  (Array.isArray(top) ? top : []).map((d) => ({
    id: d.id,
    name: d.fullName ?? d.name ?? 'Doctor',
    appointments: Number(d.appointments ?? d.appointmentCount ?? 0),
    rating: Number(d.averageRating ?? d.rating ?? 0),
  }));

const toCSV = (rows) =>
  [rows[0].map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')]
    .concat(rows.slice(1).map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')))
    .join('\n');

const downloadCSV = (rows, name) => {
  const blob = new Blob([toCSV(rows)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export default function ReportsPage() {
  const { data, isLoading, isError, refetch } = useAdminReports();

  const result = data?.data ?? {};
  const stats = result.stats ?? result;
  const revenue = normalizeRevenue(result.revenueTrend ?? result.revenue ?? []);
  const distribution = normalizeDistribution(result.userDistribution ?? result.roles ?? []);
  const topDoctors = normalizeTopDoctors(result.topDoctors ?? result.popularDoctors ?? []);

  const exportCSV = () => {
    downloadCSV([['Month', 'Revenue'], ...revenue.map((r) => [r.month, r.revenue])], 'revenue-report');
    downloadCSV(
      [['Doctor', 'Appointments', 'Rating'], ...topDoctors.map((d) => [d.name, d.appointments, d.rating])],
      'top-doctors',
    );
  };

  const totalRevenue = Number(stats.totalRevenue ?? result.totalRevenue ?? 0);
  const totalAppointments = Number(stats.totalAppointments ?? result.totalAppointments ?? 0);
  const activeUsers = Number(stats.activeUsers ?? result.activeUsers ?? 0);
  const averageRating = Number(stats.averageRating ?? result.averageRating ?? 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Platform analytics and insights."
        action={
          <Button variant="outline" onClick={exportCSV} disabled={isLoading}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      {isLoading ? (
        <div className="card flex items-center justify-center py-24">
          <Spinner label="Loading reports..." />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load reports"
          message="Something went wrong while fetching analytics."
          onRetry={refetch}
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Active users" value={activeUsers.toLocaleString()} accent="indigo" />
            <StatCard icon={CalendarCheck} label="Appointments" value={totalAppointments.toLocaleString()} accent="purple" />
            <StatCard icon={DollarSign} label="Revenue" value={totalRevenue ? formatCurrency(totalRevenue) : '—'} accent="emerald" />
            <StatCard icon={Star} label="Avg. rating" value={averageRating ? averageRating.toFixed(1) : '—'} accent="amber" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="card p-6 lg:col-span-2">
              <h2 className="text-lg font-bold text-slate-900">Revenue trend</h2>
              {revenue.length === 0 ? (
                <EmptyState title="No revenue data yet" message="Charts will appear once billing data is available." />
              ) : (
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
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} formatter={(v) => [formatCurrency(Number(v)), 'Revenue']} />
                      <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2.5} fill="url(#rev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-900">User distribution</h2>
              {distribution.length === 0 ? (
                <EmptyState icon={TrendingUp} title="No data" message="Distribution will appear once users sign up." />
              ) : (
                <>
                  <div className="mt-4 h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3}>
                          {distribution.map((entry, i) => (
                            <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {distribution.map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-600">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          {d.name}
                        </span>
                        <span className="font-bold text-slate-800">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {topDoctors.length > 0 && (
            <div className="card overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-bold text-slate-900">Top performing doctors</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-3.5">Rank</th>
                      <th className="px-6 py-3.5">Doctor</th>
                      <th className="px-6 py-3.5">Appointments</th>
                      <th className="px-6 py-3.5">Rating</th>
                      <th className="px-6 py-3.5">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topDoctors.map((d, i) => (
                      <tr key={d.id ?? d.name} className="transition hover:bg-slate-50/60">
                        <td className="px-6 py-4 font-bold text-slate-400">#{i + 1}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{d.name}</td>
                        <td className="px-6 py-4 text-slate-500">{d.appointments}</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1 font-semibold text-amber-500">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {d.rating ? d.rating.toFixed(1) : '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-teal-400"
                              style={{
                                width: `${Math.min(100, totalAppointments ? (d.appointments / totalAppointments) * 200 : 0)}%`,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}