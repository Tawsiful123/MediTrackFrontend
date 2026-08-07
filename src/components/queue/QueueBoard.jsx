import { PhoneCall } from 'lucide-react';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import QueueRow from './QueueRow';
import { getPatientName, getQueueNo } from './queueUtils';

export default function QueueBoard({
  queue = [],
  onCallNext,
  onAdvance,
  callNextPending = false,
  advancePending = false,
}) {
  const waiting = queue.filter((q) => ['WAITING', 'CALLED'].includes(q.status));
  const inConsult = queue.find((q) => q.status === 'IN_CONSULTATION');

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="card p-6 lg:col-span-2" aria-live="polite" aria-relevant="additions removals">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Today's queue</h2>
          <div className="flex items-center gap-2">
            <span className="badge bg-indigo-100 text-indigo-700">{waiting.length} waiting</span>
            <Button size="sm" onClick={onCallNext} loading={callNextPending}>
              <PhoneCall className="h-4 w-4" />
              Call next
            </Button>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {waiting.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-10 text-center text-sm text-slate-400">
              No patients waiting right now.
            </div>
          ) : (
            waiting.map((q) => (
              <QueueRow
                key={q.id ?? q._id}
                entry={q}
                onAdvance={onAdvance}
                advancePending={advancePending}
              />
            ))
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl bg-brand-gradient p-6 text-white shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">In consultation</p>
          {inConsult ? (
            <>
              <p className="mt-2 text-2xl font-extrabold">{getPatientName(inConsult)}</p>
              <p className="mt-1 text-sm text-indigo-100">
                {getQueueNo(inConsult)} · {inConsult.time ?? inConsult.slot ?? ''}
              </p>
              <button
                onClick={() => onAdvance(inConsult)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
              >
                Mark completed
              </button>
            </>
          ) : (
            <p className="mt-2 text-sm text-indigo-100">No patient is currently in consultation.</p>
          )}
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Completed today</h3>
          <div className="mt-3 space-y-2.5">
            {queue.filter((q) => q.status === 'COMPLETED').length === 0 ? (
              <p className="text-sm text-slate-400">None yet.</p>
            ) : (
              queue
                .filter((q) => q.status === 'COMPLETED')
                .map((q) => (
                  <div key={q.id ?? q._id} className="flex items-center gap-3">
                    <span className="w-12 text-xs font-bold text-slate-400">{getQueueNo(q)}</span>
                    <Avatar name={getPatientName(q)} size="xs" />
                    <span className="flex-1 truncate text-sm font-medium text-slate-700">
                      {getPatientName(q)}
                    </span>
                    <Badge status="COMPLETED">Done</Badge>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}