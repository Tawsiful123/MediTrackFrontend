import { useEffect } from 'react';
import { Star, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import Input from '@/components/common/Input';
import TextArea from '@/components/common/TextArea';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import { doctorProfileSchema } from '@/validations/doctorValidation';
import { useDoctorProfile } from '@/hooks/doctorSelf/useDoctorProfile';
import { useUpdateDoctorProfile } from '@/hooks/doctorSelf/useUpdateDoctorProfile';

export default function DoctorProfileSettingsPage() {
  const { data, isLoading, isError, refetch } = useDoctorProfile();
  const { mutateAsync: saveProfile, isPending: saving } = useUpdateDoctorProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(doctorProfileSchema) });

  const doctor = data?.data ?? {};

  useEffect(() => {
    if (data?.data) {
      reset({
        fullName: doctor.fullName ?? '',
        email: doctor.email ?? '',
        phone: doctor.phone ?? '',
        specializationId: doctor.specializationId ?? doctor.specialization?._id ?? '',
        hospitalName: doctor.hospitalName ?? '',
        clinicAddress: doctor.clinicAddress ?? '',
        consultationFee: doctor.consultationFee ?? '',
        experienceYears: doctor.experienceYears ?? '',
        bio: doctor.bio ?? '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSubmit = async (values) => {
    try {
      await saveProfile({
        ...values,
        consultationFee: values.consultationFee == null ? undefined : Number(values.consultationFee),
        experienceYears: values.experienceYears == null ? undefined : Number(values.experienceYears),
      });
      toast.success('Profile updated.');
    } catch {
      // toast handled in the mutation layer
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading your profile..." />
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

  const specName =
    typeof doctor.specialization === 'string'
      ? doctor.specialization
      : doctor.specialization?.name ?? 'Specialist';

  return (
    <div>
      <PageHeader title="Profile settings" subtitle="Keep your professional information current." />

      <div className="card mb-6 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <Avatar name={`Dr. ${doctor.fullName ?? 'Doctor'}`} size="lg" className="h-20 w-20 text-2xl" />
        <div className="flex-1">
          <p className="text-lg font-bold text-slate-900">Dr. {doctor.fullName ?? 'Doctor'}</p>
          <p className="text-sm text-slate-500">
            {[specName, doctor.experienceYears && `${doctor.experienceYears} years experience`].filter(Boolean).join(' · ')}
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-amber-500">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {doctor.averageRating ? Number(doctor.averageRating).toFixed(1) : 'New'}
            {doctor.reviewCount > 0 && ` (${doctor.reviewCount} reviews)`}
          </p>
        </div>
      </div>

      <form className="card grid gap-6 p-6 sm:grid-cols-2 sm:p-8" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="sm:col-span-2">
          <h3 className="text-base font-bold text-slate-900">Contact & practice</h3>
        </div>

        <Input label="Full name" error={errors.fullName?.message} {...register('fullName')} />
        <Input label="Email" type="email" disabled error={errors.email?.message} {...register('email')} />
        <div className="sm:col-span-2">
          <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
        </div>

        <Input label="Consultation fee ($)" type="number" step="0.01" error={errors.consultationFee?.message} {...register('consultationFee')} />
        <Input label="Experience (years)" type="number" error={errors.experienceYears?.message} {...register('experienceYears')} />

        <Input label="Hospital name" error={errors.hospitalName?.message} {...register('hospitalName')} />
        <div className="sm:col-span-2">
          <Input label="Clinic address" error={errors.clinicAddress?.message} {...register('clinicAddress')} />
        </div>

        <div className="sm:col-span-2">
          <TextArea label="Bio" rows={4} error={errors.bio?.message} {...register('bio')} placeholder="Tell patients about your practice, credentials and approach." />
        </div>

        <div className="flex justify-end gap-3 sm:col-span-2">
          <Button variant="ghost" type="button" onClick={() => reset()}>
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