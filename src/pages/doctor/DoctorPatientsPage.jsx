import { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import SearchBar from '@/components/common/SearchBar';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import Pagination from '@/components/common/Pagination';

const initial = [
  { id: 1, name: 'Rahul Verma', phone: '+1 555 010 2233', email: 'rahul@example.com', visits: 4, lastVisit: 'Jul 28, 2026' },
  { id: 2, name: 'Fatima Rahman', phone: '+1 555 010 4455', email: 'fatima@example.com', visits: 2, lastVisit: 'Aug 02, 2026' },
  { id: 3, name: 'David Chen', phone: '+1 555 010 6677', email: 'david@example.com', visits: 7, lastVisit: 'Aug 05, 2026' },
];

export default function DoctorPatientsPage() {
  const [search, setSearch] = useState('');

  const filtered = initial.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="My patients" subtitle="Patients you've consulted." />

      <div className="mb-5 max-w-sm">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patients..." />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3.5">Patient</th>
              <th className="px-6 py-3.5">Contact</th>
              <th className="px-6 py-3.5">Visits</th>
              <th className="px-6 py-3.5">Last visit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p) => (
              <tr key={p.id} className="transition hover:bg-slate-50/60">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name} />
                    <span className="font-semibold text-slate-800">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="flex items-center gap-1.5 text-slate-600"><Mail className="h-3.5 w-3.5" />{p.email}</p>
                  <p className="flex items-center gap-1.5 text-slate-400"><Phone className="h-3.5 w-3.5" />{p.phone}</p>
                </td>
                <td className="px-6 py-4"><Badge status="ACTIVE">{p.visits} visits</Badge></td>
                <td className="px-6 py-4 text-slate-500">{p.lastVisit}</td>
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