import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import SearchBar from '@/components/common/SearchBar';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const initial = [
  { id: 1, author: 'Rahul Verma', doctor: 'Dr. Ayesha Siddiqui', rating: 5, comment: 'Excellent doctor, highly recommended!', status: 'ACTIVE' },
  { id: 2, author: 'David Chen', doctor: 'Dr. John Carter', rating: 2, comment: 'Rude staff and long wait times. Would not recommend.', status: 'FLAGGED' },
];

export default function ReviewsModerationPage() {
  const [reviews, setReviews] = useState(initial);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = reviews.filter(
    (r) =>
      r.author.toLowerCase().includes(search.toLowerCase()) ||
      r.doctor.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = () => {
    setReviews((list) => list.filter((r) => r.id !== deleteTarget.id));
    toast.success('Review removed');
    setDeleteTarget(null);
  };

  return (
    <div>
      <PageHeader title="Reviews moderation" subtitle="Review and remove inappropriate content." />

      <div className="mb-5 max-w-sm">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reviews..." />
      </div>

      <div className="space-y-4">
        {filtered.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={r.author} size="sm" />
                <div>
                  <p className="text-sm font-bold text-slate-800">{r.author}</p>
                  <p className="text-xs text-slate-400">Reviewed {r.doctor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                  ★ {r.rating}
                </span>
                <Badge status={r.status === 'FLAGGED' ? 'REJECTED' : 'ACTIVE'}>{r.status}</Badge>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{r.comment}</p>
            <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
              <Button size="sm" variant="danger" onClick={() => setDeleteTarget(r)}>
                <Trash2 className="h-4 w-4" /> Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove review"
        message="This review will be deleted immediately."
        confirmLabel="Remove"
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}