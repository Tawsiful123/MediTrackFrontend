import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock, MapPin, Stethoscope, CalendarClock } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import SlotPicker from '@/components/doctors/SlotPicker';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAppointmentDetail } from '@/hooks/appointments/useAppointmentDetail';
import { useCancelAppointment } from '@/hooks/appointments/useCancelAppointment';
import { useRescheduleAppointment } from '@/hooks/appointments/useRescheduleAppointment';

const CANCELABLE = ['PENDING', 'CONFIRMED'];

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useAppointmentDetail(id);
  const { mutateAsync: cancel, isPending: cancelling } = useCancelAppointment();
  const { mutateAsync: reschedule, isPending: rescheduling } = useRescheduleAppointment();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl py-24 text-center">
        <Spinner label="Loading appointment..." />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto max-w-3xl py-16">
        <ErrorState title="Could not load appointment" message="It may have been removed or the service is unavailable." onRetry={refetch} />
      </div>
    );
  }

  const appointment = data.data;
  const doctorName = typeof appointment.doctor === 'string'
    ? appointment.doctor
    : appointment.doctor?.fullName ?? 'Doctor';
  const spec = appointment.specialization?.name ?? appointment.doctor?.specialization?.name ?? '';
  const clinic = appointment.clinicName ?? appointment.doctor?.hospitalName ?? 'Clinic';
  const address = appointment.clinicAddress ?? appointment.doctor?.clinicAddress ?? '';

  const handleCancel = async () => {
    await cancel(id);
    setConfirmOpen(false);
  };

  const handleReschedule = async () => {
    if (!newDate || !newSlot) return;
    await reschedule({ id, date: newDate, timeSlot: newSlot });
    setRescheduleOpen(false);
    setNewDate('');
    setNewSlot('');
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Appointment details"
        subtitle={`Booking reference #${appointment.id ?? id}`}
        action={
          <Link to="/patient/appointments" className="btn-outline">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="bg-brand-gradient px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">Your appointment</p>
              <h2 className="mt-1 text-2xl font-extrabold">
                {appointment.date} {appointment.time && `· ${appointment.time}`}
              </h2>
            </div>
            <Badge status={appointment.status} className="bg-white/90">{appointment.status}</Badge>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Doctor</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-slate-900">{doctorName}</p>
                <p className="text-sm text-slate-500">{spec}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</p>
            <div className="mt-2 flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-slate-900">{clinic}</p>
                <p className="text-sm text-slate-500">{address}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <CalendarDays className="h-4 w-4" /> Date & time
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              {appointment.date} {appointment.time && `· ${appointment.time}`}
            </p>
            {appointment.reason && <p className="mt-2 text-xs text-slate-500">Reason: {appointment.reason}</p>}
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <Clock className="h-4 w-4" /> Fee
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              {appointment.consultationFee > 0 ? formatCurrency(appointment.consultationFee) : '—'}
            </p>
          </div>
        </div>

        {CANCELABLE.includes(appointment.status) && (
          <div className="flex flex-wrap gap-3 border-t border-slate-100 px-6 py-4 sm:px-8">
            <Button variant="outline" size="sm" onClick={() => setRescheduleOpen(true)}>
              <CalendarClock className="h-4 w-4" /> Reschedule
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
              Cancel appointment
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Cancel appointment"
        message="This appointment will be cancelled. You can book a new one anytime."
        confirmLabel="Cancel appointment"
        loading={cancelling}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleCancel}
      />

      <Modal
        open={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        title="Reschedule appointment"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRescheduleOpen(false)}>Close</Button>
            <Button onClick={handleReschedule} loading={rescheduling} disabled={!newDate || !newSlot}>
              Confirm new slot
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <label className="label">New date</label>
            <input
              type="date"
              className="input"
              value={newDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setNewDate(e.target.value);
                setNewSlot('');
              }}
            />
          </div>
          <div>
            <label className="label">New time slot</label>
            <SlotPicker value={newSlot} onChange={setNewSlot} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
