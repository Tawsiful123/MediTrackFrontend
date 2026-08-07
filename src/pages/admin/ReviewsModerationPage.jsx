import { useEffect, useState } from 'react';
import { MessageSquare, ShieldAlert, Star } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import SearchBar from '@/components/common/SearchBar';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import EmptyState from '@/components/common/EmptyState';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import Pagination from '@/components/common/Pagination';
import ReviewCard from '@/components/reviews/ReviewCard';
import { useAllReviews } from '@/hooks/reviews/useAllReviews';
import { useDeleteReview } from '@/hooks/reviews/useDeleteReview';

const LIMIT = 10;

function getId(r) {
  return r?.id ?? r?._id;
}

export default function ReviewsModerationPage() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { mutateAsync: deleteReview, isPending: deleting } = useDeleteReview();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const { data, isLoading, isError, refetch } = useAllReviews({
    search: debounced || undefined,
    page,
    limit: LIMIT,
  });

  const result = data?.data ?? {};
  const reviews = result.reviews ?? result.items ?? result.data ?? [];
  const meta = result.meta;

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + Number(r.rating ?? 0), 0) / reviews.length).toFixed(1)
    : '0.0';
  const flaggedCount = reviews.filter((r) => r.status === 'FLAGGED').length;

  const confirmDelete = async () => {
    await deleteReview(getId(deleteTarget));
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
        message="Something went wrong while fetching the review queue."
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Reviews moderation"
        subtitle="Review and remove inappropriate content to keep the community healthy."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card relative overflow-hidden p-5">
          <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-brand-100/60" aria-hidden="true" />
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <MessageSquare className="h-4 w-4 text-brand-500" /> Showing
          </p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{reviews.length}</p>
        </div>
        <div className="card relative overflow-hidden p-5">
          <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-gradient-to-br from-amber-100 to-orange-100/70" aria-hidden="true" />
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Star className="h-4 w-4 text-amber-400" /> Avg rating
          </p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">
            {average}
            <span className="text-sm font-semibold text-slate-400"> / 5</span>
          </p>
        </div>
        <div className="card relative overflow-hidden p-5">
          <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-gradient-to-br from-rose-100 to-rose-200/70" aria-hidden="true" />
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <ShieldAlert className="h-4 w-4 text-rose-500" /> Flagged
          </p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{flaggedCount}</p>
        </div>
      </div>

      <div className="mb-6 max-w-sm">
        <SearchBar value={search} onChange={onSearchChange} placeholder="Search by patient or doctor..." />
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No reviews found"
          message="Try adjusting your search, or check back when patients share feedback."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {reviews.map((r) => (
            <ReviewCard
              key={getId(r)}
              review={r}
              showActions={false}
              onDelete={setDeleteTarget}
              loading={Boolean(deleting)}
            />
          ))}
        </div>
      )}

      {reviews.length > 0 && (
        <div className="mt-8">
          <Pagination meta={meta} page={page} onChange={setPage} />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Remove review"
        message="This review will be deleted immediately and can't be restored."
        confirmLabel="Remove review"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}