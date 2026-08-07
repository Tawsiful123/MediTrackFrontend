import { useState } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import Input from '@/components/common/Input';

export default function AssistantProfilePage() {
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    // TODO: wire to PATCH /assistant/me (useUpdateAssistantProfile)
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile updated');
    }, 900);
  };

  return (
    <div>
      <PageHeader title="My profile" subtitle="Manage your account information." />

      <div className="card mb-6 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <Avatar name="Nadia Khan" size="lg" className="h-20 w-20 text-2xl" />
        <div className="flex-1">
          <p className="text-lg font-bold text-slate-900">Nadia Khan</p>
          <p className="text-sm text-slate-500">nadia@meditrack.com · Doctor Assistant</p>
        </div>
        <span className="badge bg-emerald-100 text-emerald-700">Assigned to Dr. Siddiqui</span>
      </div>

      <form className="card grid gap-6 p-6 sm:grid-cols-2 sm:p-8" onSubmit={handleSubmit}>
        <Input label="Full name" defaultValue="Nadia Khan" />
        <Input label="Email" type="email" defaultValue="nadia@meditrack.com" />
        <Input label="Phone" defaultValue="+1 555 010 7788" />

        <div className="flex justify-end gap-3 sm:col-span-2">
          <Button variant="ghost" type="button">Cancel</Button>
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" />
            Save changes
          </Button>
        </div>
      </form>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <p>Your account access is managed by the practice administrator.</p>
      </div>
    </div>
  );
}