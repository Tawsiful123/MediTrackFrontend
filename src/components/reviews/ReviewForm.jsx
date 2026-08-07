import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import Button from '@/components/common/Button';
import TextArea from '@/components/common/TextArea';
import StarRating from '@/components/common/StarRating';
import { reviewSchema } from '@/validations/reviewValidation';

function getDoctorName(a) {
  if (!a?.doctor) return 'Doctor';
  return typeof a.doctor === 'string' ? a.doctor : a.doctor?.fullName ?? 'Doctor';
}

function appointmentLabel(a) {
  const date = a.date ?? '';
  const time = a.time ?? a.slot ?? '';
  const when = [date, time].filter(Boolean).join(' · ');
  return when ? `${when} — ${getDoctorName(a)}` : getDoctorName(a);
}

export default function ReviewForm({
  appointments = [],
  defaultValues,
  submitLabel = 'Submit review',
  loading = false,
  onSubmit,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      appointmentId: defaultValues?.appointmentId ?? '',
      rating: Number(defaultValues?.rating) || 5,
      comment: defaultValues?.comment ?? '',
    },
  });

  const currentRating = useWatch({ control, name: 'rating' });
  const commentText = useWatch({ control, name: 'comment' });
  const commentLength = (commentText ?? '').length;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-5">
        {appointments.length > 0 && (
          <div>
            <label htmlFor="review-appointment" className="label">
              Appointment
            </label>
            <select
              id="review-appointment"
              className={`input ${errors.appointmentId ? 'accent-rose-500' : 'accent-brand-500'}`}
              {...register('appointmentId')}
            >
              <option value="">Select an appointment</option>
              {appointments.map((a) => (
                <option key={a.id ?? a._id} value={a.id ?? a._id}>
                  {appointmentLabel(a)}
                </option>
              ))}
            </select>
            {errors.appointmentId && (
              <p className="mt-1.5 text-xs font-medium text-rose-600" role="alert">
                {errors.appointmentId.message}
              </p>
            )}
          </div>
        )}

        {defaultValues?.appointmentId && (
          <input type="hidden" {...register('appointmentId')} />
        )}

        <div>
          <p className="label">Your rating</p>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <StarRating value={field.value} onChange={field.onChange} readOnly={false} size="lg" />
            )}
          />
          {errors.rating && (
            <p className="mt-1.5 text-xs font-medium text-rose-600" role="alert">
              {errors.rating.message}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-brand-600">{currentRating || 0}</span>
            <span className="text-xs font-semibold text-slate-400">out of 5</span>
          </div>
        </div>

        <TextArea
          label="Comment (optional)"
          placeholder="How was your experience? Kind staff, short wait, clear diagnosis..."
          maxLength={500}
          hint={`${commentLength}/500 characters`}
          error={errors.comment?.message}
          {...register('comment')}
        />
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={loading} icon={Send}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}