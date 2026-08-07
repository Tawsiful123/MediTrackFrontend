import { Pencil, Trash2, MessageSquare, ShieldCheck } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import StarRating from '@/components/common/StarRating';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';

function getName(value, fallback) {
  if (!value) return fallback;
  return typeof value === 'string' ? value : value.fullName ?? fallback;
}

function getSpecialization(r) {
  const s = r.specialization ?? r.doctor?.specialization;
  if (!s) return '';
  return typeof s === 'string' ? s : s.name ?? '';
}

export default function ReviewCard({ review, onEdit, onDelete, showActions = true, loading = false }) {
  const doctorName = getName(review.doctor, 'Doctor');
  const patientName = getName(review.patient, review.author ?? 'Anonymous');
  const comment = review.comment ?? '';
  const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const isPatientReview = Boolean(review.patient ?? review.author ?? review.patientName);

  return (
    <article className="card overflow-hidden transition hover:shadow-lg">
      <div className="bg-brand-gradient px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-white">
            <Avatar name={isPatientReview ? patientName : doctorName} size="sm" className="border-2 border-white/40" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{isPatientReview ? patientName : doctorName}</p>
              <p className="truncate text-xs text-indigo-100">
                {isPatientReview ? `Reviewed ${doctorName}` : 'Your review'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {review.status && review.status !== 'ACTIVE' && (
              <Badge status={review.status === 'FLAGGED' ? 'REJECTED' : review.status}>{review.status}</Badge>
            )}
            <StarRating value={review.rating} />
          </div>
        </div>
      </div>

      <div className="p-5">
        {getSpecialization(review) && (
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">{getSpecialization(review)}</p>
        )}

        {comment ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{comment}</p>
        ) : (
          <p className="mt-2 flex items-center gap-2 text-sm italic text-slate-400">
            <MessageSquare className="h-4 w-4" /> No comment left — rating only.
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-400">{date}</p>
          <div className="flex gap-2">
            {showActions && onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(review)} disabled={loading}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant={showActions ? 'ghost' : 'danger'}
                size="sm"
                className={showActions ? 'text-rose-600 hover:bg-rose-50' : ''}
                onClick={() => onDelete(review)}
                disabled={loading}
              >
                <Trash2 className="h-3.5 w-3.5" /> {showActions ? 'Delete' : 'Remove'}
              </Button>
            )}
            {!onDelete && review.status === 'ACTIVE' && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <ShieldCheck className="h-4 w-4" /> Approved
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}