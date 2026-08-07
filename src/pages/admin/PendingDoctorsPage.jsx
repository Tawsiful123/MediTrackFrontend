import { useState } from 'react';
import { Check, X, Eye, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import Modal from '@/components/common/Modal';
import TextArea from '@/components/common/TextArea';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { usePendingDoctors } from '@/hooks/admin/usePendingDoctors';
import { useApproveDoctor } from '@/hooks/admin/useApproveDoctor';
import { useRejectDoctor } from '@/hooks/admin/useRejectDoctor';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

const getDoctorName = (d) => d.fullName ?? d.name ?? d.user?.fullName ?? 'Doctor';
const getDoctorSpec = (d) => d.specialization?.name ?? d.specialization ?? d.spec ?? '';
const getDoctorEmail = (d) => d.email ?? d.user?.email ?? '';

export default function PendingDoctorsPage() {
  const { data, isLoading, isError, refetch } = usePendingDoctors();
  const approveMutation = useApproveDoctor();
  const rejectMutation = useRejectDoctor();

  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [viewTarget, setViewTarget] = useState(null);

  const result = data?.data ?? {};
  const doctors = result.doctors ?? result.items ?? result.data ?? [];
  const pending = Array.isArray(doctors) ? doctors.filter((d) => (d.verificationStatus ?? d.status ?? 'PENDING') === 'PENDING') : [];

  const handleApprove = (doctor) => {
    approveMutation.mutate(doctor.id);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error('A reason is required before rejecting.');
      return;
    }
    rejectMutation.mutate(
      { id: rejectTarget.id, reason: rejectReason.trim() },
      {
        onSuccess: () => {
          setRejectTarget(null);
          setRejectReason('');
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <span className="badge bg-white/20 text-white">
            <ShieldCheck className="mr-1 h-3.5 w-3.5" />
            Verification queue
          </span>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">Pending doctor approvals</h1>
          <p className="mt-2 max-w-xl text-sm text-indigo-100">
            Review doctor applications to keep the platform trustworthy. Rejections require a reason
            so doctors understand the outcome.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="card flex items-center justify-center py-24">
          <Spinner label="Loading applications..." />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load applications"
          message="Something went wrong while fetching pending doctor applications."
          onRetry={refetch}
        />
      ) : pending.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="All caught up"
          message="There are no doctor applications waiting for review."
          action={<Button variant="outline" onClick={refetch}>Refresh</Button>}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Doctor</th>
                  <th className="px-6 py-3.5">Specialization</th>
                  <th className="px-6 py-3.5">Submitted</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pending.map((d) => {
                  const status = d.verificationStatus ?? d.status ?? 'PENDING';
                  const submitted = d.createdAt ?? d.submittedAt ?? d.applicationDate;
                  return (
                    <tr key={d.id} className="transition hover:bg-slate-50/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={getDoctorName(d)} />
                          <div>
                            <p className="font-semibold text-slate-800">{getDoctorName(d)}</p>
                            <p className="text-xs text-slate-400">{getDoctorEmail(d)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge bg-indigo-50 text-indigo-700">{getDoctorSpec(d) || '—'}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{formatDate(submitted)}</td>
                      <td className="px-6 py-4">
                        <Badge status={status}>{status.replace('_', ' ')}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setViewTarget(d)}>
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            loading={approveMutation.isPending && approveMutation.variables === d.id}
                            onClick={() => handleApprove(d)}
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            disabled={rejectMutation.isPending}
                            onClick={() => { setRejectTarget(d); setRejectReason(''); }}
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="Doctor application" size="lg">
        {viewTarget && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar name={getDoctorName(viewTarget)} size="xl" />
              <div>
                <p className="text-lg font-bold text-slate-900">{getDoctorName(viewTarget)}</p>
                <p className="text-sm text-slate-500">
                  {getDoctorSpec(viewTarget)} · {getDoctorEmail(viewTarget)}
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <Detail label="Hospital / clinic" value={viewTarget.hospitalName ?? viewTarget.clinicAddress ?? '—'} />
              <Detail label="Experience" value={viewTarget.experienceYears ? `${viewTarget.experienceYears} years` : '—'} />
              <Detail label="License #" value={viewTarget.licenseNumber ?? viewTarget.license ?? '—'} />
              <Detail label="Consultation fee" value={viewTarget.consultationFee ? formatCurrency(viewTarget.consultationFee) : '—'} />
              <Detail label="Submitted" value={formatDate(viewTarget.createdAt ?? viewTarget.submittedAt ?? viewTarget.applicationDate)} />
              <Detail label="Status" value={(viewTarget.verificationStatus ?? viewTarget.status ?? 'PENDING').replace('_', ' ')} />
            </dl>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!rejectTarget}
        title="Reject doctor application"
        message={`Reject the application of ${rejectTarget ? getDoctorName(rejectTarget) : ''}? A reason is required so the applicant understands.`}
        confirmLabel="Reject application"
        loading={rejectMutation.isPending}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleReject}
      >
        <div className="mt-4">
          <TextArea
            label="Reason for rejection"
            placeholder="e.g. License number could not be verified..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
        </div>
      </ConfirmDialog>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-800">{value}</dd>
    </div>
  );
}