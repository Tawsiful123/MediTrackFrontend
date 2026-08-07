import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';

const patients = [
  { id: 1, name: 'Maria Gomez', time: '9:00 AM', queueNo: 'Q-01', status: 'COMPLETED' },
  { id: 2, name: 'Alex Johnson', time: '9:30 AM', queueNo: 'Q-02', status: 'COMPLETED' },
  { id: 3, name: 'Lina Zhang', time: '10:00 AM', queueNo: 'Q-03', status: 'IN_CONSULTATION' },
  { id: 4, name: 'Omar Patel', time: '10:30 AM', queueNo: 'Q-04', status: 'WAITING' },
  { id: 5, name: 'Emma Wilson', time: '11:00 AM', queueNo: 'Q-05', status: 'WAITING' },
];

export default function TodaysPatientsPage() {
  return (
    <div>
      <PageHeader
        title="Today's patients"
        subtitle="Everyone you'll see today."
        action={
          <Link to="/doctor/queue" className="btn-outline">
            <Clock className="h-4 w-4" />
            Queue view
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3.5">Queue</th>
              <th className="px-6 py-3.5">Patient</th>
              <th className="px-6 py-3.5">Scheduled</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((p) => (
              <tr key={p.id} className="transition hover:bg-slate-50/60">
                <td className="px-6 py-4 font-bold text-slate-400">{p.queueNo}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name} size="sm" />
                    <span className="font-semibold text-slate-800">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{p.time}</td>
                <td className="px-6 py-4"><Badge status={p.status}>{p.status.replace('_', ' ')}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}