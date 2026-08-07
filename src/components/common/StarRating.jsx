import { Star } from 'lucide-react';

const starClass = (size) => (size === 'lg' ? 'h-6 w-6' : 'h-5 w-5');

function FilledStar({ className }) {
  return <Star className={`fill-amber-400 text-amber-400 ${className}`} />;
}

function EmptyStar({ className }) {
  return <Star className={`text-slate-300 ${className}`} />;
}

export default function StarRating({ value = 0, onChange, readOnly = true, size = 'md', showValue = false }) {
  const sizeClass = starClass(size);

  if (readOnly) {
    const fraction = Math.max(0, Math.min(5, value));
    const full = Math.floor(fraction);
    const partial = fraction - full;
    return (
      <div className="flex items-center gap-1.5">
        <div
          className="flex items-center gap-0.5"
          role="img"
          aria-label={`Rated ${Number(fraction).toFixed(1)} out of 5 stars`}
        >
          {[1, 2, 3, 4, 5].map((i) => {
            if (i <= full) return <FilledStar key={i} className={sizeClass} />;
            if (i === full + 1 && partial > 0) {
              return (
                <span key={i} className="relative inline-flex">
                  <EmptyStar className={sizeClass} />
                  <span
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${partial * 100}%` }}
                    aria-hidden="true"
                  >
                    <FilledStar className={sizeClass} />
                  </span>
                </span>
              );
            }
            return <EmptyStar key={i} className={sizeClass} />;
          })}
        </div>
        {showValue && <span className="text-sm font-bold text-slate-700">{Number(fraction).toFixed(1)}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rate this item">
      {[1, 2, 3, 4, 5].map((i) => {
        const active = i <= value;
        return (
          <button
            type="button"
            key={i}
            onClick={() => onChange?.(i)}
            role="radio"
            aria-checked={active}
            aria-label={`${i} star${i > 1 ? 's' : ''}`}
            className="rounded-md p-0.5 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1"
          >
            {active ? <FilledStar className={sizeClass} /> : <EmptyStar className={sizeClass} />}
          </button>
        );
      })}
    </div>
  );
}
