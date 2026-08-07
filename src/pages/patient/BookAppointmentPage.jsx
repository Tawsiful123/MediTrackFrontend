import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { CalendarDays, ArrowLeft, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import SlotPicker from '@/components/doctors/SlotPicker';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuth } from '@/features/auth/useAuth';

const doctor = {
  fullName: 'Dr. Ayesha Siddiqui',
  specialization: { name: 'Cardiology' },
  consultationFee: 60,
};

export default function BookAppointmentPage() {
  const { doctorId } = useParams();
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [reason, setReason] = useState('');
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!date || !slot) {
      toast.error('Please pick a date and time slot');
      return;
    }
    setSubmitting(true);
    // TODO: wire to POST /appointments (useBookAppointment)
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Appointment requested! Awaiting confirmation.');
    }, 900);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Book appointment"
        subtitle={`Booking with ${doctor.fullName} — ${doctor.specialization.name}`}
        action={
          <Link to={`/doctors/${doctorId}`} className="btn-outline">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        }
      />

      <form className="card space-y-6 p-6 sm:p-8" onSubmit={onSubmit}>
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
            <Stethoscope className="h-6 w-6" />
          </span>
          <div>
            <p className="text-lg font-bold text-slate-900">{doctor.fullName}</p>
            <p className="text-sm text-slate-500">{doctor.specialization.name} · Consultation ${doctor.consultationFee}</p>
          </div>
        </div>

        <div>
          <label className="label">Patient</label>
          <Input value={user?.fullName ?? 'You'} disabled />
        </div>

        <div>
          <label className="label">Pick a date</label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              className="input pl-9"
              value={date}
              min="2026-08-08"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">Available slots</label>
          <SlotPicker value={slot} onChange={setSlot} />
        </div>

        <div>
          <label className="label">Reason (optional)</label>
          <textarea
            className="input resize-y"
            rows={3}
            placeholder="Briefly describe why you're visiting..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <Button type="submit" size="lg" loading={submitting} className="w-full py-3.5">
          Confirm booking · ${doctor.consultationFee}
        </Button>
      </form>
    </div>
  );
}