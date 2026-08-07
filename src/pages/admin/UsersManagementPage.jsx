import { useState } from 'react';
import { UserCheck, Ban, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const initial = [
  { id: 1, name: 'Rahul Verma', email: 'rahul@example.com', role: 'PATIENT', status: 'ACTIVE' },
  { id: 2, name: 'Dr. Ayesha Siddiqui', email: 'ayesha@meditrack.com', role: 'DOCTOR', status: 'ACTIVE' },
  { id: 3, name: 'Sarah Blake', email: 'sarah@example.com', role: 'PATIENT', status: 'SUSPENDED' },
  { id: 4, name: 'Nadia Khan', email: 'nadia@meditrack.com', role: 'DOCTOR_ASSISTANT', status: 'ACTIVE' },
  { id: 5, name: 'Omar Farouk', email: 'omar@meditrack.com', role: 'DOCTOR', status: 'INACTIVE' },
];

const roleColor = {
  PATIENT: 'bg-blue-100 text-blue-800',
  DOCTOR: 'bg-purple-100 text-purple-800',
  DOCTOR_ASSISTANT: 'bg-teal-100 text-teal-800',
  ADMIN: 'bg-rose-100 text-rose-800',
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState(initial);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSuspend = (user) => {
    setUsers((list) =>
      list.map((u) =>
        u.id === user.id
          ? { ...u, status: u.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED' }
          : u
      )
    );
    toast.success(user.status === 'SUSPENDED' ? 'User activated' : 'User suspended');
  };

  const confirmDelete = () => {
    setUsers((list) => list.filter((u) => u.id !== deleteTarget.id));
    toast.success('User deleted');
    setDeleteTarget(null);
  };

  return (
    <div>
      <PageHeader title="User management" subtitle="Manage users across the platform." />

      <div className="mb-5 max-w-sm">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email or role..." />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3.5">User</th>
              <th className="px-6 py-3.5">Role</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => (
              <tr key={u.id} className="transition hover:bg-slate-50/60">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white">
                      {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`badge ${roleColor[u.role]}`}>{u.role.replace('_', ' ')}</span>
                </td>
                <td className="px-6 py-4"><Badge status={u.status}>{u.status}</Badge></td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleSuspend(u)} aria-label="Suspend or activate">
                      {u.status === 'SUSPENDED' ? <UserCheck className="h-4 w-4 text-green-600" /> : <Ban className="h-4 w-4 text-amber-600" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50" onClick={() => setDeleteTarget(u)} aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Pagination page={1} totalPages={3} onChange={() => {}} />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete user"
        message={`Permanently delete ${deleteTarget?.name ?? ''}? This cannot be undone.`}
        confirmLabel="Delete user"
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}