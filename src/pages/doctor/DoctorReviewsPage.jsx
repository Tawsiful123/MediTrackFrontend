import { ThumbsUp, Flag } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Avatar from '@/components/common/Avatar';
import StarRating from '@/components/common/StarRating';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';

const reviews = [
  { id: 1, author: 'Rahul Verma', date: 'Mar 12, 2026', rating: 5, comment: 'Explained everything clearly. Highly recommended!', helpful: 12 },
  { id: 2, author: 'Fatima Rahman', date: 'Feb 28, 2026', rating: 4, comment: 'Very professional and caring during consultation.', helpful: 8 },
  { id: 3, author: 'David Chen', date: 'Feb 10, 2026', rating: 5, comment: 'Listened patiently and prescribed effective treatment.', helpful: 15 },
];

export default function DoctorReviewsPage() {
  const reviewsList = reviews;

  const report = (author) => {
    toast.success(`Reported review by ${author}`);
  };

  return (
    <div>
      <PageHeader
        title="My reviews"
        subtitle="How patients rate their experience with you."
        action={<Button variant="outline"><Flag className="h-4 w-4" /> Replying</Button>}
      />

      {reviewsList.length === 0 ? (
        <EmptyState title="No reviews yet" message="Patient feedback will appear here." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviewsList.map((r) => (
            <div key={r.id} className="card flex flex-col p-5">
              <div className="flex items-center gap-3">
                <Avatar name={r.author} size="sm" />
                <div>
                  <p className="text-sm font-bold text-slate-800">{r.author}</p>
                  <p className="text-xs text-slate-400">{r.date}</p>
                </div>
              </div>
              <div className="mt-3">
                <StarRating value={r.rating} />
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{r.comment}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" /> {r.helpful} helpful</span>
                <button onClick={() => report(r.author)} className="flex items-center gap-1 hover:text-rose-600">
                  <Flag className="h-4 w-4" /> Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}