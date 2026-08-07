import { Link } from 'react-router-dom';
import {
  Users, CalendarCheck, Star, ArrowRight, TrendingUp, Stethoscope, AlertCircle,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar,
} from 'recharts';
import StatCard from '@/components/common/StatCard';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard';

const normalizeTrend = (trend = []) =>
  (Array.isArray(trend) ? trend : []).map((d) => ({
    label: d.month ?? d.date ?? d.label ?? d.day ?? '—',
    appointments: Number(d.appointments ?? d.count ?? d.total ?? 0),
    patients: Number(d.patients ?? d.newPatients ?? 0),
  }));

const normalizeMix = (mix = []) =>
  (Array.isArray(mix) ? mix : []).map((s) => ({
    name: s.name ?? s.specialization ?? 'Other',
    doctors: Number(s.doctors ?? s.count ?? s.doctorCount ?? 0),
  }));

export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  const result = data?.data ?? {};
  const stats = result.stats ?? result;
  const trend = normalizeTrend(result.appointmentTrend ?? result.trend ?? result.growth ?? []);
  const mix = normalizeMix(result.specializations ?? result.doctorMix ?? result.topSpecializations ?? []);
  const pendingDoctors = result.pendingDoctors ?? result.pending ?? [];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="relative">
          <span className="badge bg-white/20 text-white">Platform overview</span>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">Admin dashboard</h1>
          <p className="mt-2 max-w-xl text-sm text-indigo-100">
            A snapshot of users, appointments and doctor approvals across MediTrack.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="card flex items-center justify-center py-24">
          <Spinner label="Loading dashboard..." />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load dashboard"
          message="Something went wrong while fetching platform metrics."
          onRetry={refetch}
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Total users" value={Number(stats.totalUsers ?? 0).toLocaleString()} accent="indigo" trend={stats.userGrowth ? `+${stats.userGrowth}%` : undefined} />
            <StatCard icon={Stethoscope} label="Doctors" value={Number(stats.totalDoctors ?? 0).toLocaleString()} accent="purple" trend={stats.doctorGrowth ? `+${stats.doctorGrowth}%` : undefined} />
            <StatCard icon={CalendarCheck} label="Appointments" value={Number(stats.totalAppointments ?? 0).toLocaleString()} accent="teal" trend={stats.appointmentGrowth ? `+${stats.appointmentGrowth}%` : undefined} />
            <StatCard icon={Star} label="Avg. rating" value={Number(stats.averageRating ?? 0).toFixed(1)} accent="amber" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="card p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Growth overview</h2>
                  <p className="mt-1 text-sm text-slate-500">Appointments & new patients over time</p>
                </div>
                <Link
                  to="/admin/reports"
                  className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Full reports <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {trend.length === 0 ? (
                <EmptyState title="No trend data yet" message="Charts will appear once activity builds up." />
              ) : (
                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trend}>
                      <defs>
                        <linearGradient id="ap" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                      <Area type="monotone" dataKey="appointments" stroke="#6366f1" strokeWidth={2.5} fill="url(#ap)" />
                      <Area type="monotone" dataKey="patients" stroke="#14b8a6" strokeWidth={2} fill="transparent" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="card p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Doctor mix</h2>
                <p className="mt-1 text-sm text-slate-500">Doctors by specialization</p>
              </div>
              {mix.length === 0 ? (
                <EmptyState icon={TrendingUp} title="Nothing to show" message="Add specializations to see the mix." />
              ) : (
                <div className="mt-6 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mix}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} interval={0} angle={-12} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                      <Bar dataKey="doctors" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <p className="text-sm font-bold text-slate-800">Pending approvals</p>
                </div>
                <p className="mt-1 text-3xl font-extrabold text-slate-900">
                  {Array.isArray(pendingDoctors) ? pendingDoctors.length : Number(pendingDoctors ?? 0)}
                </p>
                <Link to="/admin/doctors/pending" className="btn-primary mt-4 w-full">
                  Review applications
                </Link>
              </div>
            </div>
          </div>

          {Array.isArray(pendingDoctors) && pendingDoctors.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Recently submitted applications</h2>
                <Link to="/admin/doctors/pending" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                  Review all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pendingDoctors.slice(0, 6).map((d) => {
                  const name = d.fullName ?? d.name ?? 'Doctor';
                  const spec = d.specialization?.name ?? d.specialization ?? d.spec ?? '';
                  return (
                    <div key={d.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={name} size="md" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-800">{name}</p>
                          <p className="truncate text-xs text-slate-400">{spec}</p>
                        </div>
                        <Badge status="PENDING">Pending</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}