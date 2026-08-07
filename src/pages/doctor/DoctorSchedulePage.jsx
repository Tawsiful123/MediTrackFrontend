import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { WEEKDAYS } from '@/utils/constants';
import { scheduleSchema } from '@/validations/scheduleValidation';
import { useDoctorSchedules } from '@/hooks/doctorSelf/useDoctorSchedules';
import { useCreateSchedule } from '@/hooks/doctorSelf/useCreateSchedule';
import { useUpdateSchedule } from '@/hooks/doctorSelf/useUpdateSchedule';
import { useDeleteSchedule } from '@/hooks/doctorSelf/useDeleteSchedule';

export default function DoctorSchedulePage() {
  const { data, isLoading, isError, refetch } = useDoctorSchedules();
  const { mutateAsync: createSchedule, isPending: creating } = useCreateSchedule();
  const { mutateAsync: updateSchedule, isPending: updating } = useUpdateSchedule();
  const { mutateAsync: deleteSchedule, isPending: deleting } = useDeleteSchedule();

  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(scheduleSchema) });

  useEffect(() => {
    if (editing) {
      reset({
        weekday: editing.weekday ?? editing.dayOfWeek ?? '',
        startTime: editing.startTime ?? '',
        endTime: editing.endTime ?? '',
        slotDurationMinutes: editing.slotDurationMinutes ?? 30,
        isAvailable: editing.isAvailable ?? true,
      });
    }
  }, [editing, reset]);

  const schedules = data?.data ?? [];
  const list = Array.isArray(schedules) ? schedules : schedules.schedules ?? schedules.slots ?? [];

  const openCreate = () => {
    setEditing(null);
    reset({ isAvailable: true, slotDurationMinutes: 30 });
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setModalOpen(true);
  };

  const onSubmit = (values) => {
    const payload = {
      weekday: values.weekday,
      startTime: values.startTime,
      endTime: values.endTime,
      slotDurationMinutes: Number(values.slotDurationMinutes),
      isAvailable: values.isAvailable,
    };
    if (editing) {
      updateSchedule({ id: editing.id ?? editing._id, ...payload }, { onSuccess: () => setModalOpen(false) });
    } else {
      createSchedule(payload, { onSuccess: () => setModalOpen(false) });
    }
  };

  const confirmDelete = (id, onSuccess) => {
    deleteSchedule(id, { onSuccess });
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading your schedule..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load your schedule"
        message="Something went wrong while fetching your weekly slots."
        onRetry={refetch}
      />
    );
  }

  const saving = creating || updating;

  return (
    <div>
      <PageHeader
        title="My schedule"
        subtitle="Manage your weekly availability slots."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add slot
          </Button>
        }
      />

      {list.length === 0 ? (
        <EmptyState
          title="No schedule slots yet"
          message="Add your availability so patients can book appointments."
          action={<Button onClick={openCreate}><Plus className="h-4 w-4" />Add your first slot</Button>}
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Day</th>
                <th className="px-6 py-3.5">Start</th>
                <th className="px-6 py-3.5">End</th>
                <th className="px-6 py-3.5">Duration</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((s) => (
                <tr key={s.id ?? s._id} className="transition hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-semibold capitalize text-slate-800">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-indigo-500" />
                      {(s.weekday ?? s.dayOfWeek ?? '').toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">{s.startTime}</td>
                  <td className="px-6 py-4">{s.endTime}</td>
                  <td className="px-6 py-4">{s.slotDurationMinutes} min</td>
                  <td className="px-6 py-4">
                    {s.isAvailable ? <Badge status="ACTIVE">Available</Badge> : <Badge status="CANCELLED">Off</Badge>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(s)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50"
                        onClick={() => setDeletingId(s.id ?? s._id)}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit schedule slot' : 'Add schedule slot'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="schedule-form" loading={saving}>
              {editing ? 'Save changes' : 'Create slot'}
            </Button>
          </>
        }
      >
        <form id="schedule-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Select
            label="Weekday"
            options={WEEKDAYS}
            error={errors.weekday?.message}
            {...register('weekday')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start time" type="time" error={errors.startTime?.message} {...register('startTime')} />
            <Input label="End time" type="time" error={errors.endTime?.message} {...register('endTime')} />
          </div>
          <Input
            label="Slot duration (minutes)"
            type="number"
            min="5"
            max="120"
            error={errors.slotDurationMinutes?.message}
            {...register('slotDurationMinutes')}
          />
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" {...register('isAvailable')} />
            Available for booking
          </label>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingId)}
        title="Delete schedule slot"
        message="This weekly availability slot will be removed. Patients won't be able to book it."
        confirmLabel="Delete slot"
        loading={deleting}
        onClose={() => setDeletingId(null)}
        onConfirm={() => confirmDelete(deletingId, () => setDeletingId(null))}
      />
    </div>
  );
}