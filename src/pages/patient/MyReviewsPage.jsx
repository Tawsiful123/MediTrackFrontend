import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import StarRating from '@/components/common/StarRating';
import Modal from '@/components/common/Modal';
import TextArea from '@/components/common/TextArea';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import EmptyState from '@/components/common/EmptyState';

const initial = [
  { id: 1, doctor: 'Dr. Ayesha Siddiqui', spec: 'Cardiology', date: 'Mar 12, 2026', rating: 5, comment: 'Excellent doctor, very thorough and kind.' },
  { id: 2, doctor: 'Dr. John Carter', spec: 'Dermatology', date: 'Jan 05, 2026', rating: 4, comment: 'Good experience overall.' },
];

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState(initial);
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
    setComment(r.comment);
    setModalOpen(true);
  };

  const submit = () => {
    if (editing) {
      setReviews((list) => list.map((r) => (r.id === editing.id ? { ...r, rating, comment } : r)));
      toast.success('Review updated');
    } else {
      toast.success('Review submitted');
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    setReviews((list) => list.filter((r) => r.id !== deleteTarget.id));
    toast.success('Review deleted');
    setDeleteTarget(null);
  };

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
                  <Avatar name={r.doctor} />
                  <div>
                    <p className="font-bold text-slate-900">{r.doctor}</p>
                    <p className="text-xs text-slate-400">{r.spec} · {r.date}</p>
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit review' : 'Write a review'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={submit}>{editing ? 'Save' : 'Submit'}</Button>
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
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}