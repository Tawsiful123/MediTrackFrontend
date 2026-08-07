import { RefreshCw } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import QueueBoard from '@/components/queue/QueueBoard';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import { useAuth } from '@/features/auth/useAuth';
import { useTodayQueue } from '@/hooks/queue/useTodayQueue';
import { useCallNext } from '@/hooks/queue/useCallNext';
import { useUpdateQueueStatus } from '@/hooks/queue/useUpdateQueueStatus';

const nextStatus = {
  WAITING: 'CALLED',
  CALLED: 'IN_CONSULTATION',
  IN_CONSULTATION: 'COMPLETED',
};

export default function QueueManagementPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useTodayQueue(user?.id ?? user?._id);
  const { mutateAsync: callNext, isPending: calling } = useCallNext();
  const { mutateAsync: updateStatus, isPending: updatingId } = useUpdateQueueStatus();

  const raw = data?.data ?? {};
  const queue = Array.isArray(raw) ? raw : raw.queue ?? raw.entries ?? raw.items ?? [];

  const handleCallNext = async () => {
    const first = queue.find((q) => q.status === 'WAITING');
    if (!first) return;
    await callNext(first.id ?? first._id);
  };

  const handleAdvance = async (entry) => {
    const next = nextStatus[entry.status];
    if (!next) return;
    await updateStatus({ id: entry.id ?? entry._id, status: next });
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading the queue board..." />
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

  return (
    <div>
      <PageHeader
        title="Queue management"
        subtitle="Live queue board for today's consultations. Auto-refreshes every 15 seconds."
        action={
          <button onClick={refetch} className="btn-outline">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        }
      />

      <QueueBoard
        queue={queue}
        onCallNext={handleCallNext}
        onAdvance={handleAdvance}
        callNextPending={calling}
        advancePending={Boolean(updatingId)}
      />

      <div className="mt-6 card p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Tips</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>• Use "Call next" to bring the first waiting patient in.</li>
          <li>• Mark patients as completed after their consultation.</li>
          <li>• The board refreshes automatically every 15 seconds.</li>
        </ul>
      </div>
    </div>
  );
}