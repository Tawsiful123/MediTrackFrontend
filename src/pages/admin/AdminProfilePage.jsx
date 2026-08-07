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
import { useAdminProfile, useUpdateAdminProfile } from '@/hooks/admin/useAdminProfile';
import { useAuth } from '@/features/auth/useAuth';

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
});

export default function AdminProfilePage() {
  const { user } = useAuth();
  const { data: profileData, isLoading, isError, refetch } = useAdminProfile();
  const updateMutation = useUpdateAdminProfile();

  const profile = profileData?.data ?? {};
  const displayName = profile.fullName ?? user?.fullName ?? 'Administrator';
  const displayEmail = profile.email ?? user?.email ?? '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    values: {
      fullName: profile.fullName ?? user?.fullName ?? '',
      phone: profile.phone ?? '',
    },
  });

  const onSubmit = (values) => {
    updateMutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My profile" subtitle="Manage your administrator account." />

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <span className="badge bg-white/20 text-white">
            <ShieldCheck className="mr-1 h-3.5 w-3.5" />
            Administrator
          </span>
          <div className="mt-4 flex items-center gap-4">
            <Avatar name={displayName} size="xl" className="ring-4 ring-white/30" />
            <div>
              <p className="text-xl font-extrabold sm:text-2xl">{displayName}</p>
              <p className="mt-1 text-sm text-indigo-100">{displayEmail} · ADMIN</p>
            </div>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="card flex items-center justify-center py-16">
          <Spinner label="Loading profile..." />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load profile"
          message="Something went wrong while fetching your profile."
          onRetry={refetch}
        />
      ) : (
        <form className="card grid gap-6 p-6 sm:grid-cols-2 sm:p-8" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input label="Full name" placeholder="Your full name" error={errors.fullName?.message} {...register('fullName')} />
          </div>
          <Input label="Email" value={displayEmail} disabled hint="Contact support to change your email." />
          <Input label="Phone (optional)" placeholder="+1 555 010 0000" {...register('phone')} />

          <div className="flex justify-end gap-3 sm:col-span-2">
            <Button variant="outline" type="button" onClick={() => reset()} disabled={updateMutation.isPending}>
              Reset
            </Button>
            <Button type="submit" loading={updateMutation.isPending}>
              <Save className="h-4 w-4" />
              Save changes
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}