import { UserCheck, UserPlus } from 'lucide-react';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { getPatientName, getQueueNo } from './queueUtils';

export default function QueueRow({ entry, onAdvance, advancePending = false }) {
  const status = entry?.status ?? 'WAITING';
  const isCalled = status === 'CALLED';

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-indigo-200 hover:bg-white">
      <span className="w-12 shrink-0 text-sm font-bold text-slate-400">{getQueueNo(entry)}</span>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white">
        {getPatientName(entry).split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-800">{getPatientName(entry)}</p>
        <p className="text-xs text-slate-400">Scheduled {entry?.time ?? entry?.slot ?? '—'}</p>
      </div>
      <Badge status={status}>{status.replace('_', ' ')}</Badge>
      <Button
        size="sm"
        variant={isCalled ? 'primary' : 'outline'}
        loading={advancePending}
        disabled={advancePending}
        onClick={() => onAdvance(entry)}
        aria-label={`Advance ${getPatientName(entry)}`}
      >
        {isCalled ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
        {isCalled ? 'Consult' : 'Proceed'}
      </Button>
    </div>
  );
}