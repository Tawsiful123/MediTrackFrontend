import { useState } from 'react';
import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';

const initial = [
  { id: 'a1', patient: 'Rahul Verma', doctor: 'Dr. Ayesha Siddiqui', date: 'Aug 10 · 10:30 AM', status: 'CONFIRMED' },
  { id: 'a2', patient: 'Fatima Rahman', doctor: 'Dr. Ayesha Siddiqui', date: 'Aug 10 · 11:00 AM', status: 'COMPLETED' },
  { id: 'a3', patient: 'David Chen', doctor: 'Dr. Ayesha Siddiqui', date: 'Aug 12 · 2:00 PM', status: 'PENDING' },
];

export default function AllAppointmentsPage() {
  const [appointments, setAppointments] = useState(initial);
  const [search, setSearch] = useState('');

  const filtered = appointments.filter(
    (a) =>
      a.patient.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.toLowerCase().includes(search.toLowerCase())
  );

  const advance = (id, status) => {
    setAppointments((list) => list.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success(`Marked as ${status}`);
  };

  return (
    <div>
      <PageHeader title="All appointments" subtitle="Every appointment across the practice." />

      <div className="mb-5 max-w-sm">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient or doctor..." />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3.5">Patient</th>
              <th className="px-6 py-3.5">Doctor</th>
              <th className="px-6 py-3.5">Date & time</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((a) => (
              <tr key={a.id} className="transition hover:bg-slate-50/60">
                <td className="px-6 py-4 font-semibold text-slate-800">{a.patient}</td>
                <td className="px-6 py-4">{a.doctor}</td>
                <td className="px-6 py-4">{a.date}</td>
                <td className="px-6 py-4"><Badge status={a.status}>{a.status}</Badge></td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    {a.status === 'PENDING' && (
                      <>
                        <Button size="sm" onClick={() => advance(a.id, 'CONFIRMED')}>
                          <Check className="h-4 w-4" /> Confirm
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => advance(a.id, 'REJECTED')}>
                          <X className="h-4 w-4" /> Reject
                        </Button>
                      </>
                    )}
                    {a.status === 'CONFIRMED' && (
                      <Button size="sm" variant="outline" onClick={() => advance(a.id, 'COMPLETED')}>
                        Mark completed
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Pagination page={1} totalPages={2} onChange={() => {}} />
      </div>
    </div>
  );
}