import { useState } from 'react';
import { Check, X, Clock, Inbox } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import EmptyState from '@/components/common/EmptyState';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import { useAppointmentRequests } from '@/hooks/appointments/useAppointmentRequests';
import { useAcceptRequest } from '@/hooks/appointments/useAcceptRequest';
import { useRejectRequest } from '@/hooks/appointments/useRejectRequest';

export default function AppointmentRequestsPage() {
  const { data, isLoading, isError, refetch } = useAppointmentRequests({ limit: 50 });
  const { mutateAsync: accept, isPending: acceptingId } = useAcceptRequest();
  const { mutateAsync: reject, isPending: rejectingId } = useRejectRequest();

  const [rejectTarget, setRejectTarget] = useState(null);

  const result = data?.data ?? {};
  const requests = result.requests ?? result.items ?? result.data ?? [];
  const pending = requests.filter((r) => r.status === 'PENDING');

  const handleAccept = async (id) => {
    await accept(id);
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    await reject({ id: rejectTarget.id ?? rejectTarget._id });
    setRejectTarget(null);
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading requests..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load requests"
        message="Something went wrong while fetching appointment requests."
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <PageHeader title="Appointment requests" subtitle="Review patient booking requests for your doctor." />

      {pending.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No pending requests"
          message="You're all caught up — new booking requests will appear here."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pending.map((r) => {
            const patientName = typeof r.patient === 'string' ? r.patient : r.patient?.fullName ?? r.name ?? 'Patient';
            const doctorName = typeof r.doctor === 'string' ? r.doctor : r.doctor?.fullName ?? '';
            const time = r.date ?? r.slot ?? r.time ?? '—';
            const id = r.id ?? r._id;
            return (
              <div key={id} className="card flex flex-col p-5 transition hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <Avatar name={patientName} />
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">{patientName}</p>
                    {doctorName && <p className="truncate text-xs text-slate-500">for {doctorName}</p>}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <span className="truncate">{time}</span>
                </div>

                {r.reason && (
                  <p className="mt-3 line-clamp-2 text-sm text-slate-500">"{r.reason}"</p>
                )}

                <Badge status={r.status} className="mt-3 self-start">{r.status}</Badge>

                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                  <Button
                    size="sm"
                    className="flex-1"
                    loading={acceptingId === id}
                    disabled={Boolean(acceptingId) || Boolean(rejectingId)}
                    onClick={() => handleAccept(id)}
                  >
                    <Check className="h-4 w-4" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="flex-1"
                    loading={rejectingId === id}
                    disabled={Boolean(acceptingId) || Boolean(rejectingId)}
                    onClick={() => setRejectTarget(r)}
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(rejectTarget)}
        title="Reject appointment request"
        message="The patient will be notified that this appointment request was not accepted."
        confirmLabel="Reject request"
        loading={Boolean(rejectingId)}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleReject}
      />
    </div>
  );
}