import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import StarRating from '@/components/common/StarRating';
import Modal from '@/components/common/Modal';
import TextArea from '@/components/common/TextArea';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import EmptyState from '@/components/common/EmptyState';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import Pagination from '@/components/common/Pagination';
import { useMyReviews } from '@/hooks/reviews/useMyReviews';
import { useCreateReview } from '@/hooks/reviews/useCreateReview';
import { useUpdateReview } from '@/hooks/reviews/useUpdateReview';
import { useDeleteReview } from '@/hooks/reviews/useDeleteReview';

function getDoctorName(r) {
  if (!r.doctor) return 'Doctor';
  return typeof r.doctor === 'string' ? r.doctor : r.doctor.fullName ?? 'Doctor';
}

export default function MyReviewsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useMyReviews({ page, limit: 10 });
  const { mutateAsync: createReview, isPending: creating } = useCreateReview();
  const { mutateAsync: updateReview, isPending: updating } = useUpdateReview();
  const { mutateAsync: deleteReview, isPending: deleting } = useDeleteReview();

  const result = data?.data ?? {};
  const reviews = result.reviews ?? result.items ?? result.data ?? [];

  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const openCreate = () => {
    setEditing(null);
    setRating(5);
    setComment('');
    setModalOpen(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setRating(r.rating);
    setComment(r.comment ?? '');
    setModalOpen(true);
  };

  const submit = async () => {
    if (editing) {
      await updateReview({ id: editing.id, rating, comment });
    } else {
      await createReview({ rating, comment, doctorId: editing?.doctorId });
    }
    setModalOpen(false);
  };

  const confirmDelete = async () => {
    await deleteReview(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading reviews..." />
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
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Write a review
          </Button>
        }
      />

      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          message="After a completed appointment, you can rate and review the doctor."
          action={<Button onClick={openCreate}>Write your first review</Button>}
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={getDoctorName(r)} />
                  <div>
                    <p className="font-bold text-slate-900">{getDoctorName(r)}</p>
                    <p className="text-xs text-slate-400">
                      {r.specialization?.name ?? ''}
                      {r.createdAt ? ` · ${new Date(r.createdAt).toLocaleDateString()}` : ''}
                    </p>
                  </div>
                </div>
                <StarRating value={r.rating} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{r.comment}</p>
              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                <Button variant="outline" size="sm" onClick={() => openEdit(r)}>
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50" onClick={() => setDeleteTarget(r)}>
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && reviews.length > 0 && (
        <div className="mt-8">
          <Pagination meta={result.meta} page={page} onChange={setPage} />
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit review' : 'Write a review'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={submit} loading={creating || updating} disabled={rating < 1}>
              {editing ? 'Save' : 'Submit'}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Your rating</p>
            <StarRating value={rating} onChange={setRating} readOnly={false} />
          </div>
          <div>
            <label className="label">Comment (optional)</label>
            <TextArea value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} placeholder="How was your experience?" />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete review"
        message="This review will be permanently removed."
        confirmLabel="Delete"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
