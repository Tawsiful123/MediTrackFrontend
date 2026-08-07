import { useState } from 'react';
import { ThumbsUp, Inbox } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Avatar from '@/components/common/Avatar';
import StarRating from '@/components/common/StarRating';
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { useDoctorReviews } from '@/hooks/doctorSelf/useDoctorReviews';
import { formatDate } from '@/utils/formatDate';

const LIMIT = 9;

export default function DoctorReviewsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useDoctorReviews({ page, limit: LIMIT });

  const result = data?.data ?? {};
  const reviews = result.reviews ?? result.items ?? result.data ?? [];

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
        message="Something went wrong while fetching patient feedback."
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="My reviews"
        subtitle="How patients rate their experience with you."
      />

      {reviews.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No reviews yet"
          message="Patient feedback will appear here after consultations."
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => {
              const author = r.patient?.fullName ?? r.author ?? 'Anonymous';
              const helpful = r.helpfulCount ?? r.helpful ?? 0;
              return (
                <div key={r.id ?? r._id} className="card flex flex-col p-5">
                  <div className="flex items-center gap-3">
                    <Avatar name={author} size="sm" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{author}</p>
                      <p className="text-xs text-slate-400">{formatDate(r.createdAt)}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <StarRating value={r.rating} />
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {r.comment || 'No comment.'}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" /> {helpful} helpful</span>
                    <span className="badge bg-green-100 text-green-800">Verified visit</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <Pagination meta={result.meta} page={page} onChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}