import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, Phone, Stethoscope, CalendarClock } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import SlotPicker from '@/components/doctors/SlotPicker';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAppointmentDetail } from '@/hooks/appointments/useAppointmentDetail';
import { useRescheduleAppointment } from '@/hooks/appointments/useRescheduleAppointment';
import { useCancelByStaff } from '@/hooks/appointments/useCancelByStaff';
import { useUpdateAppointmentStatus } from '@/hooks/appointments/useUpdateAppointmentStatus';

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useAppointmentDetail(id);
  const { mutateAsync: reschedule, isPending: rescheduling } = useRescheduleAppointment();
  const { mutateAsync: cancelByStaff, isPending: cancelling } = useCancelByStaff();
  const { mutateAsync: updateStatus, isPending: updating } = useUpdateAppointmentStatus();

  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
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
  const patientName = typeof appointment.patient === 'string' ? appointment.patient : appointment.patient?.fullName ?? 'Patient';
  const patientPhone = appointment.patient?.phone ?? '';
  const doctorName = typeof appointment.doctor === 'string' ? appointment.doctor : appointment.doctor?.fullName ?? 'Doctor';
  const spec = appointment.specialization?.name ?? appointment.doctor?.specialization?.name ?? '';
  const location = appointment.clinicName ?? appointment.doctor?.hospitalName ?? 'Clinic';

  const handleReschedule = async () => {
    if (!newDate || !newSlot) return;
    await reschedule({ id, date: newDate, timeSlot: newSlot });
    setRescheduleOpen(false);
    setNewDate('');
    setNewSlot('');
  };

  const handleCancel = async () => {
    await cancelByStaff(id);
    setCancelOpen(false);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Appointment details"
        subtitle={`Reference #${id}`}
        action={
          <Link to="/assistant/appointments" className="btn-outline">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="bg-brand-gradient px-6 py-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">Appointment</p>
              <h2 className="mt-1 text-2xl font-extrabold">
                {appointment.date} {appointment.time && `· ${appointment.time}`}
              </h2>
            </div>
            <Badge status={appointment.status} className="bg-white/90">{appointment.status}</Badge>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Patient</p>
            <div className="mt-2 flex items-center gap-3">
              <Avatar name={patientName} />
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-900">{patientName}</p>
                {patientPhone && (
                  <p className="flex items-center gap-1 text-sm text-slate-500">
                    <Phone className="h-3.5 w-3.5" /> {patientPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Doctor</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-900">{doctorName}</p>
                {spec && <p className="truncate text-sm text-slate-500">{spec}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <CalendarDays className="h-4 w-4" /> Reason
            </p>
            <p className="mt-2 text-sm text-slate-700">{appointment.reason ?? 'No reason provided.'}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <MapPin className="h-4 w-4" /> Location
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {appointment.clinicAddress ?? appointment.doctor?.clinicAddress ?? location}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 sm:px-8">
          <p className="text-sm text-slate-500">
            Consultation fee:{' '}
            <span className="font-bold text-slate-900">{formatCurrency(appointment.consultationFee)}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {appointment.status === 'PENDING' && (
              <Button
                size="sm"
                loading={updating}
                onClick={() => updateStatus({ id, status: 'CONFIRMED' })}
              >
                Confirm
              </Button>
            )}
            {['PENDING', 'CONFIRMED'].includes(appointment.status) && (
              <>
                <Button size="sm" variant="outline" onClick={() => setRescheduleOpen(true)}>
                  <CalendarClock className="h-4 w-4" /> Reschedule
                </Button>
                <Button size="sm" variant="danger" onClick={() => setCancelOpen(true)}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

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

      <ConfirmDialog
        open={cancelOpen}
        title="Cancel appointment"
        message="This appointment will be cancelled. The patient will be notified."
        confirmLabel="Cancel appointment"
        loading={cancelling}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
      />
    </div>
  );
}