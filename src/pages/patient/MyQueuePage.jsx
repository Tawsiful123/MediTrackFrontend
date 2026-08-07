import { Link } from 'react-router-dom';
import { MapPin, Clock, ListChecks } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';
import EmptyState from '@/components/common/EmptyState';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import { useMyQueue } from '@/hooks/queue/useMyQueue';

const QUEUE_STEPS = [
  { label: 'Check-in', activeFor: ['WAITING', 'CALLED', 'IN_CONSULTATION', 'COMPLETED'] },
  { label: 'In queue', activeFor: ['WAITING', 'CALLED', 'IN_CONSULTATION', 'COMPLETED'] },
  { label: 'Consultation', activeFor: ['CALLED', 'IN_CONSULTATION', 'COMPLETED'] },
  { label: 'Done', activeFor: ['IN_CONSULTATION', 'COMPLETED'] },
];

export default function MyQueuePage() {
  const { data, isLoading, isError, refetch } = useMyQueue();

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading your queue..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load your queue"
        message="Something went wrong while checking your queue position."
        onRetry={refetch}
      />
    );
  }

  const queue = data?.data ?? {};
  const position = queue.position ?? null;

  if (!position) {
    return (
      <div>
        <PageHeader title="My queue" subtitle="See where you stand at the clinic, in real time." />
        <EmptyState
          title="You're not in a queue"
          message="After your appointment is confirmed and you check in, your queue position will appear here."
          action={<Link to="/patient/appointments" className="btn-primary">View appointments</Link>}
        />
      </div>
    );
  }

  const ahead = queue.aheadCount ?? queue.ahead ?? 0;
  const total = queue.totalCount ?? queue.total ?? ahead + 1;
  const estimatedWait = queue.estimatedWait ?? '~15 minutes';
  const clinicName = queue.clinicName ?? queue.hospitalName ?? 'Clinic';
  const department = queue.department ?? queue.specialization ?? '';
  const status = queue.status ?? 'WAITING';
  const activeIndex = Math.max(
    0,
    QUEUE_STEPS.findIndex((s) => s.activeFor.includes(status)),
  );

  return (
    <div>
      <PageHeader
        title="My queue"
        subtitle="See where you stand at the clinic, in real time."
        action={
          <Link to="/patient/doctors/nearby" className="btn-outline">
            <MapPin className="h-4 w-4" />
            Nearby clinics
          </Link>
        }
      />

      <div className="rounded-2xl bg-brand-gradient p-8 text-white shadow-lg">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">
              {[clinicName, department].filter(Boolean).join(' · ')}
            </p>
            <h2 className="mt-2 text-5xl font-extrabold">#{position}</h2>
            <p className="mt-1 text-sm text-indigo-100">
              {total > 0 ? `You're ${position} of ${total} in line` : 'No one else is waiting right now'}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-6 py-4 backdrop-blur">
            <Clock className="h-8 w-8 text-cyan-200" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">Est. wait</p>
              <p className="text-xl font-extrabold">{estimatedWait}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {QUEUE_STEPS.map((step, i) => (
            <div
              key={step.label}
              className={`relative rounded-xl p-4 ${i <= activeIndex ? 'bg-white/90 text-slate-900 shadow-md' : 'bg-white/10 text-white'}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    i <= activeIndex ? 'bg-indigo-600 text-white' : 'bg-white/20'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-semibold">{step.label}</span>
              </div>
              {i === activeIndex && status !== 'COMPLETED' && (
                <Badge status="CALLED" className="absolute right-3 top-3">In progress</Badge>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/patient/appointments" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50">
            <ListChecks className="h-4 w-4" />
            View appointments
          </Link>
        </div>
      </div>

      <div className="mt-8 card p-6">
        <h3 className="font-bold text-slate-900">Before your consultation</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>• Carry a valid photo ID and your insurance card.</li>
          <li>• Bring any recent reports or prescriptions.</li>
          <li>• Arrive 10 minutes before your expected slot.</li>
        </ul>
      </div>
    </div>
  );
}
