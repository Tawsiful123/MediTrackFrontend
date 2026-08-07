import { useState } from 'react';
import { PhoneCall, UserPlus, UserCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

const initialQueue = [
  { id: 1, queueNo: 'Q-01', name: 'Rahul Verma', time: '10:00 AM', status: 'WAITING' },
  { id: 2, queueNo: 'Q-02', name: 'Fatima Rahman', time: '10:30 AM', status: 'CALLED' },
  { id: 3, queueNo: 'Q-03', name: 'David Chen', time: '11:00 AM', status: 'IN_CONSULTATION' },
  { id: 4, queueNo: 'Q-04', name: 'Olivia Brown', time: '11:30 AM', status: 'WAITING' },
  { id: 5, queueNo: 'Q-05', name: 'Sofia Rossi', time: '12:00 PM', status: 'WAITING' },
];

const nextStatus = {
  WAITING: 'CALLED',
  CALLED: 'IN_CONSULTATION',
  IN_CONSULTATION: 'COMPLETED',
};

export default function QueueManagementPage() {
  const [queue, setQueue] = useState(initialQueue);
  const waiting = queue.filter((q) => q.status === 'WAITING' || q.status === 'CALLED');
  const inConsult = queue.find((q) => q.status === 'IN_CONSULTATION');

  const advance = (id) => {
    setQueue((list) =>
      list.map((q) =>
        q.id === id ? { ...q, status: nextStatus[q.status] ?? q.status } : q
      )
    );
    toast.success('Patient moved to next step');
  };

  const callNext = () => {
    const first = queue.find((q) => q.status === 'WAITING');
    if (!first) {
      toast('All waiting patients are handled.', { icon: '✅' });
      return;
    }
    setQueue((list) => list.map((q) => (q.id === first.id ? { ...q, status: 'CALLED' } : q)));
    toast.success(`Calling ${first.name} (${first.queueNo})`);
  };

  return (
    <div>
      <PageHeader
        title="Queue management"
        subtitle="Live queue board for today's consultations."
        action={
          <Button onClick={callNext}>
            <PhoneCall className="h-4 w-4" />
            Call next
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Today's queue</h2>
            <span className="badge bg-indigo-100 text-indigo-700">{waiting.length} waiting</span>
          </div>
          <div className="mt-5 space-y-3" aria-live="polite">
            {waiting.map((q) => (
              <div
                key={q.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-indigo-200 hover:bg-white"
              >
                <span className="w-12 text-sm font-bold text-slate-400">{q.queueNo}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white">
                  {q.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800">{q.name}</p>
                  <p className="text-xs text-slate-400">Scheduled {q.time}</p>
                </div>
                <Badge status={q.status}>{q.status.replace('_', ' ')}</Badge>
                {q.status !== 'COMPLETED' && (
                  <Button size="sm" variant={q.status === 'CALLED' ? 'primary' : 'outline'} onClick={() => advance(q.id)}>
                    {q.status === 'CALLED' ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {q.status === 'CALLED' ? 'Consult' : 'Proceed'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-brand-gradient p-6 text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">In consultation</p>
            {inConsult ? (
              <>
                <p className="mt-2 text-2xl font-extrabold">{inConsult.name}</p>
                <p className="mt-1 text-sm text-indigo-100">{inConsult.queueNo} · {inConsult.time}</p>
                <button
                  onClick={() => advance(inConsult.id)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Mark completed
                </button>
              </>
            ) : (
              <p className="mt-2 text-sm text-indigo-100">No patient is currently in consultation.</p>
            )}
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Tips</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Use "Call next" to bring the first waiting patient in.</li>
              <li>• Mark patients as completed after their consultation.</li>
              <li>• The board refreshes automatically every few seconds.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}