import { Clock, CheckCircle2, UserRound, RefreshCw } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { useAuth } from '@/features/auth/useAuth';
import { useTodayQueue } from '@/hooks/queue/useTodayQueue';

const statusIcon = {
  COMPLETED: <CheckCircle2 className="h-4 w-4" />,
  IN_CONSULTATION: <Clock className="h-4 w-4" />,
};

export default function DoctorQueuePage() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useTodayQueue(user?.id ?? user?._id);

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading today's queue..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load the queue"
        message="Something went wrong while fetching today's queue."
        onRetry={refetch}
      />
    );
  }

  const raw = data?.data ?? {};
  const queue = Array.isArray(raw) ? raw : raw.queue ?? raw.entries ?? raw.items ?? [];

  if (queue.length === 0) {
    return (
      <div>
        <PageHeader
          title="Today's queue"
          subtitle="Read-only view of your consultation queue. Auto-refreshes every 15 seconds."
          action={
            <button onClick={refetch} className="btn-outline">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          }
        />
        <EmptyState title="The queue is empty" message="Patients will appear here as they check in." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Today's queue"
        subtitle="Read-only view of your consultation queue. Auto-refreshes every 15 seconds."
        action={
          <button onClick={refetch} className="btn-outline">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        }
      />

      <div className="card overflow-hidden">
        <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {queue.map((q) => {
            const name = typeof q.patient === 'string' ? q.patient : q.patient?.fullName ?? q.name ?? 'Patient';
            const queueNo = q.queueNo ?? q.queueNumber ?? `#${q.id ?? '—'}`;
            const time = q.time ?? q.slot ?? q.appointment?.time ?? '';
            const status = q.status ?? 'WAITING';
            return (
              <div key={q.id ?? q._id} className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-400">{queueNo}</span>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      status === 'IN_CONSULTATION'
                        ? 'bg-indigo-100 text-indigo-600'
                        : status === 'COMPLETED'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-slate-100 text-slate-400'
                    }`}
                    aria-label={`Status: ${status.replace('_', ' ')}`}
                    title={status.replace('_', ' ')}
                  >
                    {statusIcon[status] ?? <UserRound className="h-4 w-4" />}
                  </span>
                </div>
                <p className="mt-3 font-bold text-slate-900">{name}</p>
                <p className="mt-1 text-xs text-slate-400">{time}</p>
                <Badge status={status} className="mt-3">{status.replace('_', ' ')}</Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}