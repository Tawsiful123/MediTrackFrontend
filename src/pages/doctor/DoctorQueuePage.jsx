import { Clock, CheckCircle2 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';

const queue = [
  { id: 1, queueNo: 'Q-01', name: 'Rahul Verma', time: '10:00 AM', status: 'COMPLETED' },
  { id: 2, queueNo: 'Q-02', name: 'Fatima Rahman', time: '10:30 AM', status: 'COMPLETED' },
  { id: 3, queueNo: 'Q-03', name: 'David Chen', time: '11:00 AM', status: 'IN_CONSULTATION' },
  { id: 4, queueNo: 'Q-04', name: 'Olivia Brown', time: '11:30 AM', status: 'WAITING' },
];

const statusIcon = {
  COMPLETED: <CheckCircle2 className="h-4 w-4" />,
  IN_CONSULTATION: <Clock className="h-4 w-4" />,
};

export default function DoctorQueuePage() {
  return (
    <div>
      <PageHeader title="Today's queue" subtitle="Read-only view of your consultation queue." />

      <div className="card overflow-hidden">
        <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {queue.map((q) => (
            <div key={q.id} className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-400">{q.queueNo}</span>
                <span className={`flex h-8 w-8 items-center justify-center rounded-full ${q.status === 'IN_CONSULTATION' ? 'bg-indigo-100 text-indigo-600' : q.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                  {statusIcon[q.status] ?? <Clock className="h-4 w-4" />}
                </span>
              </div>
              <p className="mt-3 font-bold text-slate-900">{q.name}</p>
              <p className="mt-1 text-xs text-slate-400">{q.time}</p>
              <Badge status={q.status} className="mt-3">{q.status.replace('_', ' ')}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}