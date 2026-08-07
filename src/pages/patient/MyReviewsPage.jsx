import { useState } from 'react';
import { Plus, Star, Inbox } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import EmptyState from '@/components/common/EmptyState';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import Pagination from '@/components/common/Pagination';
import ReviewCard from '@/components/reviews/ReviewCard';
import ReviewForm from '@/components/reviews/ReviewForm';
import { useMyReviews } from '@/hooks/reviews/useMyReviews';
import { useCreateReview } from '@/hooks/reviews/useCreateReview';
import { useUpdateReview } from '@/hooks/reviews/useUpdateReview';
import { useDeleteReview } from '@/hooks/reviews/useDeleteReview';
import { useMyAppointments } from '@/hooks/appointments/useMyAppointments';

const LIMIT = 10;

function getId(r) {
  return r?.id ?? r?._id;
}

export default function MyReviewsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useMyReviews({ page, limit: LIMIT });
  const { data: appointmentsData } = useMyAppointments({ status: 'COMPLETED', limit: 50 });
  const { mutateAsync: createReview, isPending: creating } = useCreateReview();
  const { mutateAsync: updateReview, isPending: updating } = useUpdateReview();
  const { mutateAsync: deleteReview, isPending: deleting } = useDeleteReview();

  const result = data?.data ?? {};
  const reviews = result.reviews ?? result.items ?? result.data ?? [];
  const meta = result.meta;

  const completed = appointmentsData?.data?.appointments ?? appointmentsData?.data?.items ?? appointmentsData?.data?.data ?? [];
  const reviewedAppointmentIds = new Set(reviews.map((r) => getId(r) ?? r.appointmentId).filter(Boolean));
  const reviewable = completed.filter((a) => !reviewedAppointmentIds.has(getId(a)));

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setFormOpen(true);
  };

  const handleSubmit = async (values) => {
    const payload = {
      appointmentId: values.appointmentId,
      rating: Number(values.rating),
      comment: (values.comment ?? '').trim(),
    };
    if (editing) {
      await updateReview({ id: getId(editing), ...payload });
    } else {
      await createReview(payload);
    }
    setFormOpen(false);
    setEditing(null);
  };

  const confirmDelete = async () => {
    await deleteReview(getId(deleteTarget));
    setDeleteTarget(null);
  };

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + Number(r.rating ?? 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading your reviews..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load reviews"
        message="Something went wrong while fetching your reviews."
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="My reviews"
        subtitle="Share feedback on the doctors you've visited."
        action={
          <Button onClick={openCreate} icon={Plus}>
            Write a review
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="card relative overflow-hidden p-6">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-brand-100/60" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total reviews</p>
          <p className="mt-2 flex items-center gap-2 text-3xl font-extrabold text-slate-900">
            <Inbox className="h-7 w-7 text-brand-500" />
            {reviews.length}
          </p>
        </div>
        <div className="card relative overflow-hidden p-6">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100/70" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Your average rating</p>
          <p className="mt-2 flex items-center gap-2 text-3xl font-extrabold text-slate-900">
            <Star size={24} className="text-amber-400" />
            {average}
            <span className="text-sm font-semibold text-slate-400">/ 5</span>
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          message="After a completed appointment, you can rate and review the doctor."
          action={
            <Button onClick={openCreate} icon={Plus}>
              Write your first review
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {reviews.map((r) => (
            <ReviewCard
              key={getId(r)}
              review={r}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              loading={Boolean(deleting) || Boolean(updating)}
            />
          ))}
        </div>
      )}

      {reviews.length > 0 && (
        <div className="mt-8">
          <Pagination meta={meta} page={page} onChange={setPage} />
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        size={editing ? 'sm' : 'md'}
        title={editing ? 'Edit review' : 'Write a review'}
      >
        {editing ? (
          <ReviewForm
            defaultValues={{ appointmentId: editing.appointment ?? editing.appointmentId, rating: editing.rating, comment: editing.comment }}
            submitLabel="Save changes"
            loading={updating}
            onSubmit={handleSubmit}
            onCancel={() => {
              setFormOpen(false);
              setEditing(null);
            }}
          />
        ) : reviewable.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-slate-500">
              You have no completed appointments (or un-reviewed one) available to review yet.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setFormOpen(false)}>
              Done
            </Button>
          </div>
        ) : (
          <ReviewForm
            appointments={reviewable}
            submitLabel="Submit review"
            loading={creating}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete review"
        message="This review will be permanently removed and the doctor's rating will be updated."
        confirmLabel="Delete review"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}