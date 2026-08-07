import { Link } from 'react-router-dom';
import {
  CalendarCheck, ClipboardList, ListChecks, Star, ArrowRight, MapPin, Bot,
} from 'lucide-react';
import StatCard from '@/components/common/StatCard';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { useAuth } from '@/features/auth/useAuth';
import { usePatientDashboard } from '@/hooks/patient/usePatientDashboard';

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = usePatientDashboard();

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading your dashboard..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load your dashboard"
        message="Something went wrong while fetching your overview."
        onRetry={refetch}
      />
    );
  }

  const d = data?.data ?? {};
  const upcoming = d.upcomingAppointments ?? d.upcoming ?? [];
  const totalAppointments = d.totalAppointments ?? d.totalCount ?? 0;
  const upcomingCount = d.upcomingCount ?? upcoming.length;
  const reviewsCount = d.reviewsCount ?? 0;
  const queue = d.queue ?? null;
  const firstName = user?.fullName?.split(' ')[0] ?? 'there';

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${firstName} 👋`}
        subtitle="Here's what's happening with your health today."
        action={
          <Link to="/doctors" className="btn-primary">
            <CalendarCheck className="h-4 w-4" />
            Book new appointment
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ClipboardList} label="Total appointments" value={String(totalAppointments)} accent="indigo" />
        <StatCard icon={CalendarCheck} label="Upcoming" value={String(upcomingCount)} accent="purple" />
        <StatCard icon={Star} label="Reviews written" value={String(reviewsCount)} accent="amber" />
        <StatCard
          icon={ListChecks}
          label="Queue position"
          value={queue?.position ? `#${queue.position}` : '—'}
          accent="teal"
          trend={queue?.estimatedWait}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Upcoming appointments</h2>
              <Link to="/patient/appointments" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="mt-5">
                <EmptyState
                  title="No upcoming appointments"
                  message="Book your next visit with a verified doctor."
                  action={<Link to="/doctors" className="btn-primary">Find a doctor</Link>}
                />
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {upcoming.map((a) => {
                  const name = typeof a.doctor === 'string' ? a.doctor : a.doctor?.fullName ?? 'Doctor';
                  const spec = a.specialization?.name ?? a.doctor?.specialization?.name ?? '';
                  return (
                    <div key={a.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-indigo-200 hover:bg-white">
                      <Avatar name={name} size="lg" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900">{name}</p>
                        <p className="text-sm text-slate-500">
                          {[spec, a.date, a.time && `at ${a.time}`].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <Badge status={a.status}>{a.status}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-brand-gradient p-6 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">Live queue</p>
                <p className="text-lg font-extrabold">
                  {queue?.position ? `Position #${queue.position}` : 'No active queue'}
                </p>
              </div>
            </div>
            {queue?.estimatedWait && (
              <p className="mt-3 text-sm text-indigo-100">
                Estimated wait: <span className="font-bold text-white">{queue.estimatedWait}</span>
              </p>
            )}
            <Link to="/patient/queue" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50">
              Track queue
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-slate-900">Health Assistant</p>
                <p className="text-xs text-slate-500">AI symptom guidance, 24/7</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Not sure what your symptoms mean? Chat with our AI assistant for instant guidance.
            </p>
            <Link to="/patient/chatbot" className="mt-4 block">
              <Button variant="outline" className="w-full">Start chatting</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
