import EmptyState from '@/components/common/EmptyState';
import PageHeader from '@/components/common/PageHeader';
import { Construction } from 'lucide-react';

export default function UnderConstruction({ title = 'Page', subtitle }) {
  return (
    <div>
      <PageHeader title={`${title}`} subtitle={subtitle ?? `${title} is coming soon.`} />
      <EmptyState
        title={`${title} — coming soon`}
        message="This module is scaffolded and ready. The feature will appear here once it's wired up to the API."
        action={
          <span className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-400">
            <Construction className="h-4 w-4" />
            Under construction
          </span>
        }
      />
    </div>
  );
}