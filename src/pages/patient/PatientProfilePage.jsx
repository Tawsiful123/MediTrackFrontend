import { useState } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import TextArea from '@/components/common/TextArea';
import { GENDER } from '@/utils/constants';

export default function PatientProfilePage() {
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    // TODO: wire to PATCH /patients/me (useUpdatePatientProfile)
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile updated');
    }, 900);
  };

  return (
    <div>
      <PageHeader title="My profile" subtitle="Manage your personal and medical information." />

      <div className="card mb-6 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <Avatar name="Rahul Verma" size="lg" className="h-20 w-20 text-2xl" />
        <div className="flex-1">
          <p className="text-lg font-bold text-slate-900">Rahul Verma</p>
          <p className="text-sm text-slate-500">rahul@example.com</p>
        </div>
        <span className="badge bg-emerald-100 text-emerald-700">Account verified</span>
      </div>

      <form className="card grid gap-6 p-6 sm:grid-cols-2 sm:p-8" onSubmit={handleSubmit}>
        <div className="sm:col-span-2">
          <h3 className="text-base font-bold text-slate-900">Personal details</h3>
        </div>

        <Input label="Full name" defaultValue="Rahul Verma" />
        <Input label="Email" type="email" defaultValue="rahul@example.com" />
        <Input label="Phone" defaultValue="+1 555 010 2233" />
        <Select label="Gender" defaultValue="MALE" options={GENDER} placeholder="Select gender" />
        <Input label="Date of birth" type="date" defaultValue="1992-04-18" />

        <div className="sm:col-span-2">
          <Input label="Address" defaultValue="42 Rosewood Lane, Springfield" />
        </div>

        <div className="sm:col-span-2 mt-2">
          <h3 className="text-base font-bold text-slate-900">Medical information</h3>
          <p className="mt-1 text-xs text-slate-400">Only visible to doctors you consult.</p>
        </div>

        <Input label="Blood group" defaultValue="O+" placeholder="e.g. O+" />
        <Input label="Emergency contact" defaultValue="Meera Verma" />
        <Input label="Emergency phone" defaultValue="+1 555 010 9988" />

        <div className="sm:col-span-2">
          <TextArea label="Allergies" rows={2} defaultValue="Penicillin" placeholder="List any allergies" />
        </div>
        <div className="sm:col-span-2">
          <TextArea label="Medical history" rows={3} placeholder="Chronic conditions, past surgeries..." />
        </div>

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
        <p>
          Your medical information is encrypted and only shared with doctors you book appointments
          with. You can request deletion at any time.
        </p>
      </div>
    </div>
  );
}