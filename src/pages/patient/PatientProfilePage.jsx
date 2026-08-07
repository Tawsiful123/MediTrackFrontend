import { useState } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import TextArea from '@/components/common/TextArea';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import { GENDER } from '@/utils/constants';
import { usePatientProfile } from '@/hooks/patient/usePatientProfile';
import { useUpdatePatientProfile } from '@/hooks/patient/useUpdatePatientProfile';

function formFrom(profile) {
  return {
    fullName: profile.fullName ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
    gender: profile.gender ?? '',
    dateOfBirth: profile.dateOfBirth ?? '',
    address: profile.address ?? '',
    bloodGroup: profile.bloodGroup ?? '',
    emergencyContact: profile.emergencyContact ?? '',
    emergencyPhone: profile.emergencyPhone ?? '',
    allergies: profile.allergies ?? '',
    medicalHistory: profile.medicalHistory ?? '',
  };
}

export default function PatientProfilePage() {
  const { data, isLoading, isError, refetch } = usePatientProfile();
  const { mutateAsync: saveProfile, isPending: saving } = useUpdatePatientProfile();

  const profile = data?.data ?? {};

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading profile..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load your profile"
        message="Something went wrong while fetching your details."
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <PageHeader title="My profile" subtitle="Manage your personal and medical information." />
      <ProfileForm profile={profile} saving={saving} onSave={saveProfile} />

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

function ProfileForm({ profile, saving, onSave }) {
  const [form, setForm] = useState(() => formFrom(profile));

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <div>
      <div className="card mb-6 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <Avatar name={form.fullName || 'Patient'} size="lg" className="h-20 w-20 text-2xl" />
        <div className="flex-1">
          <p className="text-lg font-bold text-slate-900">{form.fullName || 'Patient'}</p>
          <p className="text-sm text-slate-500">{form.email}</p>
        </div>
        <span className="badge bg-emerald-100 text-emerald-700">Account verified</span>
      </div>

      <form className="card grid gap-6 p-6 sm:grid-cols-2 sm:p-8" onSubmit={handleSubmit}>
        <div className="sm:col-span-2">
          <h3 className="text-base font-bold text-slate-900">Personal details</h3>
        </div>

        <Input label="Full name" value={form.fullName} onChange={set('fullName')} />
        <Input label="Email" type="email" value={form.email} onChange={set('email')} disabled />
        <Input label="Phone" value={form.phone} onChange={set('phone')} />
        <Select label="Gender" value={form.gender} onChange={set('gender')} options={GENDER} placeholder="Select gender" />
        <Input label="Date of birth" type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} />

        <div className="sm:col-span-2">
          <Input label="Address" value={form.address} onChange={set('address')} />
        </div>

        <div className="sm:col-span-2 mt-2">
          <h3 className="text-base font-bold text-slate-900">Medical information</h3>
          <p className="mt-1 text-xs text-slate-400">Only visible to doctors you consult.</p>
        </div>

        <Input label="Blood group" value={form.bloodGroup} onChange={set('bloodGroup')} placeholder="e.g. O+" />
        <Input label="Emergency contact" value={form.emergencyContact} onChange={set('emergencyContact')} />
        <Input label="Emergency phone" value={form.emergencyPhone} onChange={set('emergencyPhone')} />

        <div className="sm:col-span-2">
          <TextArea label="Allergies" rows={2} value={form.allergies} onChange={set('allergies')} placeholder="List any allergies" />
        </div>
        <div className="sm:col-span-2">
          <TextArea label="Medical history" rows={3} value={form.medicalHistory} onChange={set('medicalHistory')} placeholder="Chronic conditions, past surgeries..." />
        </div>

        <div className="flex justify-end gap-3 sm:col-span-2">
          <Button variant="ghost" type="button" onClick={() => setForm(formFrom(profile))}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" />
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
