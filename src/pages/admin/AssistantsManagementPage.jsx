import { useState } from 'react';
import { UserCog, UserMinus, Ban, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import Modal from '@/components/common/Modal';
import Select from '@/components/common/Select';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Pagination from '@/components/common/Pagination';
import { useAssistantsList } from '@/hooks/admin/useAssistantsList';
import { useDoctorsList } from '@/hooks/doctors/useDoctorsList';
import { useAssignAssistantDoctor } from '@/hooks/admin/useAssignAssistantDoctor';
import { useSuspendAssistant } from '@/hooks/admin/useSuspendAssistant';

const getName = (a) => a.fullName ?? a.name ?? 'Assistant';
const getEmail = (a) => a.email ?? a.user?.email ?? '';
const getId = (a) => a.id ?? a._id;

export default function AssistantsManagementPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useAssistantsList({ page, limit: 10 });

  const { data: doctorsData } = useDoctorsList({ limit: 100 });
  const assignMutation = useAssignAssistantDoctor();
  const suspendMutation = useSuspendAssistant();

  const [assignTarget, setAssignTarget] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [suspensionTarget, setSuspensionTarget] = useState(null);

  const result = data?.data ?? {};
  const assistants = Array.isArray(result)
    ? result
    : result.assistants ?? result.items ?? result.data ?? [];

  const doctorOptions = (doctorsData?.data?.doctors ?? doctorsData?.data?.items ?? doctorsData?.data ?? [])
    .map((d) => ({ value: d.id, label: d.fullName ?? d.name }))
    .filter((d) => d.label);

  const submitAssign = () => {
    if (!selectedDoctor) return;
    assignMutation.mutate(
      { assistantId: getId(assignTarget), doctorId: selectedDoctor },
      {
        onSuccess: () => {
          toast.success('Assistant assigned to the doctor.');
          setAssignTarget(null);
          setSelectedDoctor('');
        },
      },
    );
  };

  const unassign = (assistant) => {
    assignMutation.mutate(
      { assistantId: getId(assistant), doctorId: null },
      { onSuccess: () => toast.success('Assistant unassigned.') },
    );
  };

  const busy = assignMutation.isPending || suspendMutation.isPending;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <span className="badge bg-white/20 text-white">
            <UserPlus className="mr-1 h-3.5 w-3.5" />
            Practice team
          </span>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">Assistants management</h1>
          <p className="mt-2 max-w-xl text-sm text-indigo-100">
            Assign doctor assistants to practices so they can manage bookings and the queue.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="card flex items-center justify-center py-20">
          <Spinner label="Loading assistants..." />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load assistants"
          message="Something went wrong while fetching assistant accounts."
          onRetry={refetch}
        />
      ) : assistants.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No assistants yet"
          message="Assistant accounts will appear here once they register."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Assistant</th>
                  <th className="px-6 py-3.5">Designation</th>
                  <th className="px-6 py-3.5">Assigned doctor</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assistants.map((a) => {
                  const assignedDoctor =
                    a.assignedDoctor?.fullName ??
                    a.assignedDoctor?.name ??
                    a.doctor?.fullName ??
                    a.doctorName ??
                    '';
                  const designation = a.designation ?? a.user?.designation ?? '';
                  return (
                    <tr key={a.id ?? a._id} className="transition hover:bg-slate-50/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={getName(a)} />
                          <div>
                            <p className="font-semibold text-slate-800">{getName(a)}</p>
                            <p className="text-xs text-slate-400">{getEmail(a)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{designation || '—'}</td>
                      <td className="px-6 py-4">
                        {assignedDoctor ? (
                          <span className="badge bg-purple-50 text-purple-700">
                            <UserCog className="mr-1 h-3 w-3" />
                            {assignedDoctor}
                          </span>
                        ) : (
                          <span className="text-slate-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={a.status}>{a.status}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() => {
                              setAssignTarget(a);
                              setSelectedDoctor(a.doctorId ?? a.assignedDoctorId ?? '');
                            }}
                          >
                            <UserCog className="h-4 w-4" />
                            Assign
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={busy || !assignedDoctor}
                            className="text-amber-600 hover:bg-amber-50"
                            title="Unassign"
                            onClick={() => unassign(a)}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={busy}
                            className="text-rose-600 hover:bg-rose-50"
                            title="Suspend assistant"
                            onClick={() => setSuspensionTarget(a)}
                          >
                            <Ban className="h-4 w-4" />
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

      {!isLoading && !isError && assistants.length > 0 && (
        <div className="flex justify-center">
          <Pagination meta={result.meta} page={page} onChange={setPage} />
        </div>
      )}

      <Modal
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        title={`Assign ${assignTarget ? getName(assignTarget) : ''}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setAssignTarget(null)} disabled={assignMutation.isPending}>
              Cancel
            </Button>
            <Button loading={assignMutation.isPending} disabled={!selectedDoctor} onClick={submitAssign}>
              Assign assistant
            </Button>
          </>
        }
      >
        {doctorsData === undefined ? (
          <Spinner label="Loading doctors..." />
        ) : (
          <Select
            label="Doctor"
            options={doctorOptions}
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            placeholder="Select a doctor"
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!suspensionTarget}
        title="Suspend assistant"
        message={`Suspend ${suspensionTarget ? getName(suspensionTarget) : ''}? They will lose access until reactivated.`}
        confirmLabel="Suspend"
        loading={suspendMutation.isPending}
        onClose={() => setSuspensionTarget(null)}
        onConfirm={() => {
          if (suspensionTarget) suspendMutation.mutate(getId(suspensionTarget), { onSuccess: () => setSuspensionTarget(null) });
        }}
      />
    </div>
  );
}