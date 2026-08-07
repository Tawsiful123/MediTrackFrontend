import { useState } from 'react';
import { Plus, Pencil, Trash2, Stethoscope } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import TextArea from '@/components/common/TextArea';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useSpecializations } from '@/hooks/specializations/useSpecializations';
import { useCreateSpecialization } from '@/hooks/specializations/useCreateSpecialization';
import { useUpdateSpecialization } from '@/hooks/specializations/useUpdateSpecialization';
import { useDeleteSpecialization } from '@/hooks/specializations/useDeleteSpecialization';

const schema = z.object({
  name: z.string().min(2, 'Name is required (min 2 characters)'),
  description: z.string().optional(),
});

export default function SpecializationsPage() {
  const { data, isLoading, isError, refetch } = useSpecializations();
  const createMutation = useCreateSpecialization();
  const updateMutation = useUpdateSpecialization();
  const deleteMutation = useDeleteSpecialization();

  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { name: '', description: '' } });

  const result = data?.data;
  const specializations =
    result?.specializations ?? result?.items ?? (Array.isArray(result) ? result : []);

  const openCreate = () => {
    setEditingId(null);
    reset({ name: '', description: '' });
    setOpen(true);
  };

  const openEdit = (s) => {
    setEditingId(s.id);
    reset({ name: s.name ?? '', description: s.description ?? '' });
    setOpen(true);
  };

  const onSubmit = (values) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...values }, { onSuccess: () => setOpen(false) });
    } else {
      createMutation.mutate(values, { onSuccess: () => setOpen(false) });
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  const busy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="badge bg-white/20 text-white">
              <Stethoscope className="mr-1 h-3.5 w-3.5" />
              Medical directory
            </span>
            <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">Specializations</h1>
            <p className="mt-2 max-w-xl text-sm text-indigo-100">
              Manage the medical specialties used across doctor profiles and filters.
            </p>
          </div>
          <Button onClick={openCreate} className="bg-white text-indigo-700 shadow-md hover:bg-indigo-50">
            <Plus className="h-4 w-4" />
            Add specialization
          </Button>
        </div>
      </section>

      {isLoading ? (
        <div className="card flex items-center justify-center py-20">
          <Spinner label="Loading specializations..." />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load specializations"
          message="Something went wrong while fetching the specializations."
          onRetry={refetch}
        />
      ) : specializations.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No specializations yet"
          message="Add your first specialization to help patients filter doctors."
          action={<Button onClick={openCreate}><Plus className="h-4 w-4" />Add specialization</Button>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {specializations.map((s) => {
            const doctorCount = Number(s.doctorCount ?? s.doctors ?? 0);
            return (
              <div key={s.id} className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <span className="badge bg-indigo-100 text-indigo-700">
                    {doctorCount} {doctorCount === 1 ? 'doctor' : 'doctors'}
                  </span>
                  <div className="flex gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                    <button
                      onClick={() => openEdit(s)}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={`Edit ${s.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(s)}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      aria-label={`Delete ${s.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h3 className="mt-3 font-bold text-slate-900">{s.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{s.description || 'No description'}</p>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? 'Edit specialization' : 'Add specialization'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={isSubmitting || busy}>
              Cancel
            </Button>
            <Button type="submit" form="spec-form" loading={isSubmitting || busy}>
              {editingId ? 'Save changes' : 'Create'}
            </Button>
          </>
        }
      >
        <form id="spec-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Name" placeholder="e.g. Cardiology" error={errors.name?.message} {...register('name')} />
          <TextArea label="Description (optional)" placeholder="Short description" {...register('description')} />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete specialization"
        message={`Delete "${deleteTarget?.name ?? ''}"? Doctors linked to it will appear without a specialty.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}