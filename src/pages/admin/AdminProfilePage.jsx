import { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import Input from '@/components/common/Input';

export default function AdminProfilePage() {
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    // TODO: wire to PATCH /admin/me (useAdminProfile)
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile updated');
    }, 900);
  };

  return (
    <div>
      <PageHeader title="My profile" subtitle="Manage your administrator account." />

      <div className="card mb-6 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <Avatar name="Admin MediTrack" size="lg" className="h-20 w-20 text-2xl" />
        <div className="flex-1">
          <p className="text-lg font-bold text-slate-900">Platform Administrator</p>
          <p className="text-sm text-slate-500">admin@meditrack.com · ADMIN</p>
        </div>
        <span className="badge bg-rose-100 text-rose-700">Administrator</span>
      </div>

      <form className="card grid gap-6 p-6 sm:grid-cols-2 sm:p-8" onSubmit={handleSubmit}>
        <Input label="Full name" defaultValue="Platform Administrator" />
        <Input label="Email" type="email" defaultValue="admin@meditrack.com" />
        <Input label="Phone" defaultValue="+1 555 010 0000" />

        <div className="flex justify-end gap-3 sm:col-span-2">
          <Button variant="ghost" type="button">Cancel</Button>
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" />
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}