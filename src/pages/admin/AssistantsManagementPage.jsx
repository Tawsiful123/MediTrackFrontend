import { useState } from 'react';
import { UserCog, UserMinus, Ban } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';
import Select from '@/components/common/Select';

const initial = [
  { id: 1, name: 'Nadia Khan', email: 'nadia@meditrack.com', doctor: 'Dr. Ayesha Siddiqui', status: 'ACTIVE' },
  { id: 2, name: 'James Park', email: 'james@meditrack.com', doctor: 'Dr. John Carter', status: 'ACTIVE' },
  { id: 3, name: 'Sara Ali', email: 'sara@meditrack.com', doctor: null, status: 'INACTIVE' },
];

const doctors = ['Dr. Ayesha Siddiqui', 'Dr. John Carter', 'Dr. Priya Sharma'];

export default function AssistantsManagementPage() {
  const [assistants, setAssistants] = useState(initial);
  const [assignTarget, setAssignTarget] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const assign = () => {
    if (!selectedDoctor) {
      toast.error('Select a doctor to assign');
      return;
    }
    setAssistants((list) =>
      list.map((a) => (a.id === assignTarget.id ? { ...a, doctor: selectedDoctor, status: 'ACTIVE' } : a))
    );
    toast.success('Assistant assigned');
    setAssignTarget(null);
    setSelectedDoctor('');
  };

  const remove = (a) => {
    setAssistants((list) => list.map((x) => (x.id === a.id ? { ...x, doctor: null, status: 'INACTIVE' } : x)));
    toast.success('Assistant unassigned');
  };

  return (
    <div>
      <PageHeader title="Assistants management" subtitle="Assign doctor assistants to practices." />

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3.5">Assistant</th>
              <th className="px-6 py-3.5">Assigned doctor</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assistants.map((a) => (
              <tr key={a.id} className="transition hover:bg-slate-50/60">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-800">{a.name}</p>
                  <p className="text-xs text-slate-400">{a.email}</p>
                </td>
                <td className="px-6 py-4">{a.doctor ?? <span className="text-slate-400">Unassigned</span>}</td>
                <td className="px-6 py-4"><Badge status={a.status}>{a.status}</Badge></td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setAssignTarget(a); setSelectedDoctor(a.doctor ?? ''); }}>
                      <UserCog className="h-4 w-4" /> Assign
                    </Button>
                    {a.doctor && (
                      <>
                        <Button size="sm" variant="ghost" className="text-amber-600 hover:bg-amber-50" onClick={() => remove(a)}>
                          <UserMinus className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-50" onClick={() => remove(a)} aria-label="Suspend">
                          <Ban className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        title={`Assign ${assignTarget?.name ?? ''}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setAssignTarget(null)}>Cancel</Button>
            <Button onClick={assign}>Assign assistant</Button>
          </>
        }
      >
        <Select
          label="Doctor"
          options={doctors}
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          placeholder="Select a doctor"
        />
      </Modal>
    </div>
  );
}