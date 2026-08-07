import { useState } from 'react';
import { Check, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';

const initial = [
  { id: 1, patient: 'Maria Gomez', doctor: 'Dr. Ayesha Siddiqui', date: 'Today, 3:30 PM', status: 'PENDING' },
  { id: 2, patient: 'Alex Johnson', doctor: 'Dr. Ayesha Siddiqui', date: 'Today, 4:00 PM', status: 'PENDING' },
  { id: 3, patient: 'Lina Zhang', doctor: 'Dr. Ayesha Siddiqui', date: 'Tomorrow, 9:30 AM', status: 'PENDING' },
];

export default function AppointmentRequestsPage() {
  const [requests, setRequests] = useState(initial);
  const pending = requests.filter((r) => r.status === 'PENDING');

  const handle = (id, action) => {
    setRequests((list) => list.map((r) => (r.id === id ? { ...r, status: action } : r)));
    toast.success(action === 'CONFIRMED' ? 'Request accepted' : 'Request rejected');
  };

  return (
    <div>
      <PageHeader title="Appointment requests" subtitle="Review patient booking requests for your doctor." />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pending.map((r) => (
          <div key={r.id} className="card flex flex-col p-5 transition hover:shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white">
                {r.patient.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-900">{r.patient}</p>
                <p className="text-xs text-slate-500">for {r.doctor}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
              <Clock className="h-4 w-4 text-indigo-500" />
              {r.date}
            </div>

            <Badge status={r.status} className="mt-3 self-start">{r.status}</Badge>

            <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
              <Button size="sm" className="flex-1" onClick={() => handle(r.id, 'CONFIRMED')}>
                <Check className="h-4 w-4" />
                Accept
              </Button>
              <Button size="sm" variant="danger" className="flex-1" onClick={() => handle(r.id, 'REJECTED')}>
                <X className="h-4 w-4" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>

      {pending.length === 0 && (
        <div className="card p-10 text-center text-slate-400">No pending requests — you're all caught up!</div>
      )}
    </div>
  );
}