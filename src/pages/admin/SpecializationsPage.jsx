import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
});

const initial = [
  { id: 1, name: 'Cardiology', description: 'Heart and vascular care', doctors: 42 },
  { id: 2, name: 'Dermatology', description: 'Skin, hair and nails', doctors: 28 },
  { id: 3, name: 'Neurology', description: 'Nervous system disorders', doctors: 19 },
  { id: 4, name: 'Pediatrics', description: 'Care for infants and children', doctors: 35 },
];

export default function SpecializationsPage() {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const openCreate = () => {
    setEditing(null);
    reset({});
    setOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    reset(s);
    setOpen(true);
  };

  const onSubmit = (values) => {
    if (editing) {
      setItems((list) => list.map((s) => (s.id === editing.id ? { ...s, ...values } : s)));
      toast.success('Specialization updated');
    } else {
      setItems((list) => [...list, { ...values, id: Date.now(), doctors: 0 }]);
      toast.success('Specialization created');
    }
    setOpen(false);
  };

  const onDelete = (id) => {
    setItems((list) => list.filter((s) => s.id !== id));
    toast.success('Specialization deleted');
  };

  return (
    <div>
      <PageHeader
        title="Specializations"
        subtitle="Manage the medical specialties on the platform."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add specialization
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <div key={s.id} className="card group p-5 transition hover:shadow-lg">
            <div className="flex items-start justify-between">
              <span className="badge bg-indigo-100 text-indigo-700">{s.doctors} doctors</span>
              <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => onDelete(s.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <h3 className="mt-3 font-bold text-slate-900">{s.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{s.description || 'No description'}</p>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit specialization' : 'Add specialization'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="spec-form">{editing ? 'Save' : 'Create'}</Button>
          </>
        }
      >
        <form id="spec-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Name" placeholder="e.g. Cardiology" error={errors.name?.message} {...register('name')} />
          <Input label="Description (optional)" placeholder="Short description" {...register('description')} />
        </form>
      </Modal>
    </div>
  );
}