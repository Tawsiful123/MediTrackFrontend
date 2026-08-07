import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import StarRating from '@/components/common/StarRating';
import Spinner from '@/components/common/Spinner';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Pagination from '@/components/common/Pagination';
import { useDoctorReviews } from '@/hooks/doctors/useDoctorReviews';

const LIMIT = 5;

export default function ReviewList({ doctorId }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useDoctorReviews(doctorId, { page, limit: LIMIT });

  const result = data?.data ?? {};
  const reviews = result.reviews ?? result.items ?? result.data ?? [];
  const meta = result.meta;

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner label="Loading reviews..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load reviews"
        message="Something went wrong while fetching patient reviews."
        onRetry={refetch}
      />
    );
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No reviews yet"
        message="Be the first to review this doctor after your visit."
      />
    );
  }

  const pageLabel = meta?.page ?? page;
  const totalPages = meta?.totalPages ?? (meta?.limit > 0 ? Math.ceil((meta?.total ?? 0) / meta.limit) : 1);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Patient reviews
            <span className="ml-2 text-sm font-semibold text-slate-400">
              Page {pageLabel}{totalPages > 1 && ` of ${totalPages}`}
            </span>
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {reviews.map((r) => {
          const author = r.patient?.fullName ?? r.author ?? 'Anonymous';
          return (
            <div key={r.id ?? r._id} className="card p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar name={author} size="sm" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{author}</p>
                    <p className="text-xs text-slate-400">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
                <StarRating value={r.rating} />
              </div>
              {r.comment && <p className="mt-3 text-sm leading-relaxed text-slate-600">{r.comment}</p>}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination meta={meta} page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}