import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { CalendarDays, ArrowLeft, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import SlotPicker from '@/components/doctors/SlotPicker';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import { useAuth } from '@/features/auth/useAuth';
import { formatCurrency } from '@/utils/formatCurrency';
import { getErrorStatus } from '@/utils/getErrorMessage';
import { useDoctorDetail } from '@/hooks/doctors/useDoctorDetail';
import { useDoctorSchedule } from '@/hooks/doctors/useDoctorSchedule';
import { useBookAppointment } from '@/hooks/appointments/useBookAppointment';

export default function BookAppointmentPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [reason, setReason] = useState('');
  const { user } = useAuth();
  const { mutateAsync: book, isPending } = useBookAppointment();

  const { data, isLoading, isError, refetch } = useDoctorDetail(doctorId);
  const {
    data: scheduleData,
    isLoading: scheduleLoading,
    isError: scheduleError,
    refetch: refetchSchedule,
  } = useDoctorSchedule(doctorId);

  const scheduleEntries = useMemo(() => {
    const schedule = scheduleData?.data ?? {};
    const entries = Array.isArray(schedule) ? schedule : schedule.schedules ?? schedule.slots ?? [];
    return entries;
  }, [scheduleData]);

  const availableSlots = useMemo(() => {
    if (!date || !scheduleEntries.length) return [];
    if (typeof scheduleEntries[0] === 'string') return scheduleEntries;
    const day = scheduleEntries.find((e) => e.date === date);
    return day ? day.slots ?? [day.time].filter(Boolean) : [];
  }, [date, scheduleEntries]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!date || !slot) {
      toast.error('Please pick a date and time slot');
      return;
    }
    try {
      const result = await book({ doctorId, date, timeSlot: slot, reason });
      navigate('/patient/appointments', { state: { booked: true } });
      return result;
    } catch (err) {
      if (getErrorStatus(err) === 409) {
        // Slot taken while booking — refresh the schedule so the picker updates live (§13.1).
        setSlot('');
        refetchSchedule();
      }
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl py-24 text-center">
        <Spinner label="Loading doctor details..." />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto max-w-3xl py-16">
        <ErrorState title="Could not load doctor" message="Please go back and try again." onRetry={refetch} />
      </div>
    );
  }

  const doctor = data.data;
  const specName = doctor.specialization?.name ?? doctor.specialization ?? 'General Practice';

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Book appointment"
        subtitle={`Booking with ${doctor.fullName} — ${specName}`}
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
            <p className="text-sm text-slate-500">
              {specName} · Consultation {formatCurrency(doctor.consultationFee)}
            </p>
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
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setDate(e.target.value);
                setSlot('');
              }}
            />
          </div>
        </div>

        <div>
          <label className="label">Available slots</label>
          {scheduleError ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
              <p className="text-sm text-rose-600">Could not load the doctor's schedule.</p>
              <button type="button" onClick={refetchSchedule} className="btn-outline px-3 py-1.5 text-xs">
                Retry
              </button>
            </div>
          ) : scheduleLoading && date ? (
            <div className="py-3">
              <Spinner size="sm" label="Loading schedule..." />
            </div>
          ) : availableSlots.length > 0 ? (
            <SlotPicker value={slot} onChange={setSlot} availableSlots={availableSlots} />
          ) : (
            <p className="text-sm text-slate-400">
              {date ? 'No slots available for this date. Try another day.' : 'Pick a date to see available slots.'}
            </p>
          )}
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

        <Button type="submit" size="lg" loading={isPending} className="w-full py-3.5">
          Confirm booking · {formatCurrency(doctor.consultationFee)}
        </Button>
      </form>
    </div>
  );
}
