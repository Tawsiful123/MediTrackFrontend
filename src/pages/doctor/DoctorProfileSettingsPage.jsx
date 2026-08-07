import { useState } from 'react';
import { Star, UploadCloud, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import Input from '@/components/common/Input';
import TextArea from '@/components/common/TextArea';

export default function DoctorProfileSettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    // TODO: wire to PATCH /doctor/me (useUpdateDoctorProfile)
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile updated');
    }, 900);
  };

  return (
    <div>
      <PageHeader title="Profile settings" subtitle="Keep your professional information current." />

      <div className="card mb-6 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <Avatar name="Dr. Ayesha Siddiqui" size="lg" className="h-20 w-20 text-2xl" />
        <div className="flex-1">
          <p className="text-lg font-bold text-slate-900">Dr. Ayesha Siddiqui</p>
          <p className="text-sm text-slate-500">Cardiologist · 12 years experience</p>
          <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-amber-500">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.8 (214 reviews)
          </p>
        </div>
        <Button variant="outline">
          <UploadCloud className="h-4 w-4" />
          Change photo
        </Button>
      </div>

      <form className="card grid gap-6 p-6 sm:grid-cols-2 sm:p-8" onSubmit={handleSubmit}>
        <div className="sm:col-span-2">
          <h3 className="text-base font-bold text-slate-900">Contact & practice</h3>
        </div>

        <Input label="Full name" defaultValue="Dr. Ayesha Siddiqui" />
        <Input label="Email" type="email" defaultValue="ayesha@meditrack.com" />
        <div className="sm:col-span-2">
          <Input label="Phone" defaultValue="+1 555 010 2030" />
        </div>

        <Input label="Specialization" defaultValue="Cardiology" />
        <Input label="Consultation fee ($)" type="number" defaultValue={60} />

        <Input label="Hospital name" defaultValue="City General Hospital" />
        <Input label="Experience (years)" type="number" defaultValue={12} />

        <div className="sm:col-span-2">
          <Input label="Clinic address" defaultValue="134 Heartbeat Avenue, Springfield" />
        </div>

        <div className="sm:col-span-2">
          <TextArea label="Bio" rows={4} defaultValue="Board-certified cardiologist committed to compassionate, evidence-based care." />
        </div>

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