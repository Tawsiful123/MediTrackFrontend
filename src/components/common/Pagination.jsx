import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import Button from './Button';

function getWindow(pages, current, max = 5) {
  if (pages.length <= max) return pages;
  const start = Math.max(0, Math.min(current - 1 - Math.floor(max / 2), pages.length - max));
  return pages.slice(start, start + max);
}

/**
 * Pagination reads meta.page / meta.limit / meta.total from the API envelope
 * (api-doc.md section 18): { data: [...], meta: { page, limit, total } }.
 * For backwards compatibility, `page` and `totalPages` props are also accepted.
 */
export default function Pagination({ meta, page, totalPages, onChange, className = '', showSummary = true }) {
  const current = meta?.page ?? page ?? 1;
  const total = meta?.total ?? 0;
  const limit = meta?.limit ?? 0;
  const pagesCount = totalPages ?? (limit > 0 ? Math.ceil(total / limit) : 0);

  if (pagesCount <= 1) return null;

  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);
  const window = getWindow(pages, current);
  const from = (current - 1) * limit + 1;
  const to = Math.min(current * limit, total);

  return (
    <nav className={`flex flex-col items-center gap-3 ${className}`} aria-label="Pagination">
      {showSummary && total > 0 && (
        <p className="text-xs font-medium text-slate-400">
          Showing <span className="font-semibold text-slate-600">{from}–{to}</span> of{' '}
          <span className="font-semibold text-slate-600">{total}</span> results
        </p>
      )}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={current <= 1}
          onClick={() => onChange(current - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Prev</span>
        </Button>

        {window[0] > 1 && (
          <>
            <PageButton page={1} current={current} onClick={onChange} />
            {window[0] > 2 && <Ellipsis />}
          </>
        )}
        {window.map((p) => (
          <PageButton key={p} page={p} current={current} onClick={onChange} />
        ))}
        {window[window.length - 1] < pagesCount && (
          <>
            {window[window.length - 1] < pagesCount - 1 && <Ellipsis />}
            <PageButton page={pagesCount} current={current} onClick={onChange} />
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={current >= pagesCount}
          onClick={() => onChange(current + 1)}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}

function PageButton({ page, current, onClick }) {
  const active = page === current;
  return (
    <button
      onClick={() => onClick(page)}
      aria-current={active ? 'page' : undefined}
      aria-label={`Page ${page}`}
      className={`h-9 min-w-9 rounded-xl px-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        active
          ? 'bg-brand-gradient text-white shadow-md shadow-indigo-200'
          : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
      }`}
    >
      {page}
    </button>
  );
}

function Ellipsis() {
  return (
    <span className="flex h-9 w-9 items-center justify-center text-slate-400">
      <MoreHorizontal className="h-4 w-4" />
    </span>
  );
}
