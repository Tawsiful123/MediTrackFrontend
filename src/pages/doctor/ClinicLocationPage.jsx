import { useEffect } from 'react';
import { MapPin, ExternalLink, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import TextArea from '@/components/common/TextArea';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import { clinicLocationSchema } from '@/validations/doctorValidation';
import { useDoctorProfile } from '@/hooks/doctorSelf/useDoctorProfile';
import { useUpdateClinicLocation } from '@/hooks/doctorSelf/useUpdateClinicLocation';

export default function ClinicLocationPage() {
  const { data, isLoading, isError, refetch } = useDoctorProfile();
  const { mutateAsync: saveLocation, isPending: saving } = useUpdateClinicLocation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(clinicLocationSchema) });

  const doctor = data?.data ?? {};
  const clinic = doctor.clinicLocation ?? {};

  useEffect(() => {
    if (data?.data) {
      reset({
        clinicAddress: doctor.clinicAddress ?? '',
        latitude: clinic.latitude ?? '',
        longitude: clinic.longitude ?? '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSubmit = async (values) => {
    try {
      await saveLocation({
        clinicAddress: values.clinicAddress,
        latitude: values.latitude == null || values.latitude === '' ? undefined : Number(values.latitude),
        longitude: values.longitude == null || values.longitude === '' ? undefined : Number(values.longitude),
      });
      toast.success('Clinic location updated.');
    } catch {
      // toast handled in the mutation layer
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading clinic details..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load clinic details"
        message="Something went wrong while fetching your location."
        onRetry={refetch}
      />
    );
  }

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
            {clinic.latitude && clinic.longitude
              ? `${clinic.latitude}, ${clinic.longitude}`
              : 'Set coordinates below to show yourself on the nearby doctors map'}
          </p>
          {clinic.latitude && clinic.longitude && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${clinic.latitude},${clinic.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-12 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-indigo-700"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open in Maps
            </a>
          )}
        </div>

        <form className="card space-y-5 p-6 lg:col-span-2" onSubmit={handleSubmit(onSubmit)} noValidate>
          <h3 className="text-base font-bold text-slate-900">Location details</h3>

          <TextArea label="Clinic address" rows={3} error={errors.clinicAddress?.message} {...register('clinicAddress')} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Latitude" type="number" step="any" error={errors.latitude?.message} {...register('latitude')} />
            <Input label="Longitude" type="number" step="any" error={errors.longitude?.message} {...register('longitude')} />
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