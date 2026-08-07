import { useState } from 'react';
import { Plus, Pencil, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { WEEKDAYS } from '@/utils/constants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleSchema } from '@/validations/scheduleValidation';

const MOCK = [
  { id: 1, weekday: 'MONDAY', startTime: '09:00', endTime: '12:00', slotDurationMinutes: 30, isAvailable: true },
  { id: 2, weekday: 'MONDAY', startTime: '14:00', endTime: '17:00', slotDurationMinutes: 30, isAvailable: true },
  { id: 3, weekday: 'WEDNESDAY', startTime: '10:00', endTime: '13:00', slotDurationMinutes: 30, isAvailable: true },
  { id: 4, weekday: 'FRIDAY', startTime: '09:00', endTime: '12:00', slotDurationMinutes: 30, isAvailable: false },
];

export default function DoctorSchedulePage() {
  const [schedules, setSchedules] = useState(MOCK);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(scheduleSchema) });

  const openCreate = () => {
    setEditing(null);
    reset({ isAvailable: true });
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    reset(s);
    setModalOpen(true);
  };

  const onSubmit = (values) => {
    if (editing) {
      setSchedules((list) => list.map((s) => (s.id === editing.id ? { ...s, ...values } : s)));
      toast.success('Schedule updated');
    } else {
      setSchedules((list) => [...list, { ...values, id: Date.now() }]);
      toast.success('Schedule created');
    }
    setModalOpen(false);
  };

  const onDelete = (id) => {
    setSchedules((list) => list.filter((s) => s.id !== id));
    toast.success('Schedule deleted');
  };

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
            {schedules.map((s) => (
              <tr key={s.id} className="transition hover:bg-slate-50/60">
                <td className="px-6 py-4 font-semibold text-slate-800">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    {s.weekday}
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
                    <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50" onClick={() => onDelete(s.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit schedule slot' : 'Add schedule slot'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="schedule-form">{editing ? 'Save changes' : 'Create slot'}</Button>
          </>
        }
      >
        <form id="schedule-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
    </div>
  );
}