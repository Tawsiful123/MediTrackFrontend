import { useState } from 'react';
import { MapPin, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import TextArea from '@/components/common/TextArea';

export default function ClinicLocationPage() {
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    // TODO: wire to PATCH /doctor/me/clinic-location (useUpdateClinicLocation)
    setTimeout(() => {
      setSaving(false);
      toast.success('Clinic location updated');
    }, 900);
  };

  return (
    <div>
      <PageHeader title="Clinic location" subtitle="Share your clinic's location so patients can find you." />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card relative h-[360px] overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-teal-50 lg:col-span-3">
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute h-24 w-24 animate-ping rounded-full bg-indigo-400/30" />
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-white shadow-lg">
              <MapPin className="h-6 w-6" />
            </div>
          </div>
          <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium text-slate-500 shadow backdrop-blur">
            Connect Google Maps in .env (VITE_GOOGLE_MAPS_API_KEY)
          </p>
        </div>

        <form className="card space-y-5 p-6 lg:col-span-2" onSubmit={handleSubmit}>
          <h3 className="text-base font-bold text-slate-900">Location details</h3>

          <TextArea label="Clinic address" rows={3} defaultValue="134 Heartbeat Avenue, Springfield, USA" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Latitude" type="number" step="any" defaultValue={24.8607} />
            <Input label="Longitude" type="number" step="any" defaultValue={67.0011} />
          </div>

          <div className="rounded-xl bg-indigo-50 p-4 text-xs text-indigo-700">
            Coordinates are used to show you in the "nearby doctors" map to patients. They're saved
            separately from your address.
          </div>

          <Button type="submit" loading={saving} className="w-full">
            <Save className="h-4 w-4" />
            Save location
          </Button>
        </form>
      </div>
    </div>
  );
}