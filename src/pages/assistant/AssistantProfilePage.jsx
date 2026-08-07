import { useEffect } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import Input from '@/components/common/Input';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import { useAssistantProfile } from '@/hooks/assistant/useAssistantProfile';
import { useUpdateAssistantProfile } from '@/hooks/assistant/useUpdateAssistantProfile';
import { useAssignedDoctor } from '@/hooks/assistant/useAssignedDoctor';

const assistantProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
});

export default function AssistantProfilePage() {
  const { data, isLoading, isError, refetch } = useAssistantProfile();
  const { data: doctorData } = useAssignedDoctor();
  const { mutateAsync: saveProfile, isPending: saving } = useUpdateAssistantProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(assistantProfileSchema) });

  const profile = data?.data ?? {};

  useEffect(() => {
    if (data?.data) {
      reset({
        fullName: profile.fullName ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSubmit = async (values) => {
    await saveProfile(values);
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

  const doctor = doctorData?.data ?? {};
  const doctorName = typeof doctor === 'string' ? doctor : doctor.fullName;

  return (
    <div>
      <PageHeader title="My profile" subtitle="Manage your account information." />

      <div className="card mb-6 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <Avatar name={profile.fullName ?? 'Assistant'} size="lg" className="h-20 w-20 text-2xl" />
        <div className="flex-1">
          <p className="text-lg font-bold text-slate-900">{profile.fullName ?? 'Assistant'}</p>
          <p className="text-sm text-slate-500">{profile.email ?? ''} · Doctor Assistant</p>
        </div>
        <span className="badge bg-emerald-100 text-emerald-700">
          {doctorName ? `Assigned to ${doctorName}` : 'No doctor assigned yet'}
        </span>
      </div>

      <form className="card grid gap-6 p-6 sm:grid-cols-2 sm:p-8" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input label="Full name" error={errors.fullName?.message} {...register('fullName')} />
        <Input label="Email" type="email" disabled error={errors.email?.message} {...register('email')} />
        <Input label="Phone" error={errors.phone?.message} {...register('phone')} />

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

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <p>Your account access is managed by the practice administrator.</p>
      </div>
    </div>
  );
}