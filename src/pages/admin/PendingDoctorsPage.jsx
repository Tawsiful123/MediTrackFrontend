import { useState } from 'react';
import { Check, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const initial = [
  { id: 1, name: 'Dr. Omar Farouk', spec: 'Neurology', email: 'omar@meditrack.com', status: 'PENDING' },
  { id: 2, name: 'Dr. Emily Watson', spec: 'Pediatrics', email: 'emily@meditrack.com', status: 'PENDING' },
  { id: 3, name: 'Dr. Hassan Ali', spec: 'General Medicine', email: 'hassan@meditrack.com', status: 'PENDING' },
];

export default function PendingDoctorsPage() {
  const [doctors, setDoctors] = useState(initial);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const approve = (id) => {
    setDoctors((list) => list.map((d) => (d.id === id ? { ...d, status: 'APPROVED' } : d)));
    toast.success('Doctor approved');
  };

  const reject = () => {
    if (!rejectReason.trim()) {
      toast.error('A reason is required to reject');
      return;
    }
    setDoctors((list) => list.map((d) => (d.id === rejectTarget.id ? { ...d, status: 'REJECTED' } : d)));
    toast.success('Doctor rejected');
    setRejectTarget(null);
    setRejectReason('');
  };

  const pending = doctors.filter((d) => d.status === 'PENDING');

  return (
    <div>
      <PageHeader title="Pending doctor approvals" subtitle="Review and approve doctor applications to keep the platform trustworthy." />

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3.5">Doctor</th>
              <th className="px-6 py-3.5">Specialization</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(pending.length ? pending : doctors).map((d) => (
              <tr key={d.id} className="transition hover:bg-slate-50/60">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white">
                      {d.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{d.name}</p>
                      <p className="text-xs text-slate-400">{d.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{d.spec}</td>
                <td className="px-6 py-4"><Badge status={d.status}>{d.status}</Badge></td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setViewTarget(d)}>
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    {d.status === 'PENDING' && (
                      <>
                        <Button variant="primary" size="sm" onClick={() => approve(d.id)}>
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setRejectTarget(d)}>
                          <X className="h-4 w-4" />
                          Reject
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

      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="Doctor application" size="lg">
        {viewTarget && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-lg font-bold text-white">
                {viewTarget.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{viewTarget.name}</p>
                <p className="text-sm text-slate-500">{viewTarget.spec} · {viewTarget.email}</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs font-semibold uppercase text-slate-400">Hospital</dt>
                <dd className="mt-1 font-semibold text-slate-800">City General Hospital</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs font-semibold uppercase text-slate-400">Experience</dt>
                <dd className="mt-1 font-semibold text-slate-800">10 years</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs font-semibold uppercase text-slate-400">License #</dt>
                <dd className="mt-1 font-semibold text-slate-800">PMC-2024-88912</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs font-semibold uppercase text-slate-400">Consultation fee</dt>
                <dd className="mt-1 font-semibold text-slate-800">$60</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!rejectTarget}
        title="Reject doctor"
        message={`Reject the application of ${rejectTarget?.name ?? ''}? A reason is required.`}
        confirmLabel="Reject application"
        onClose={() => setRejectTarget(null)}
        onConfirm={reject}
      />
    </div>
  );
}