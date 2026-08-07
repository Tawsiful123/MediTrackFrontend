import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, readOnly = true, size = 'md' }) {
  const starClass = `star-icon ${size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'}`;

  if (readOnly) {
    return (
      <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${starClass} ${i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          type="button"
          key={i}
          onClick={() => onChange(i)}
          className="transition hover:scale-110"
          aria-label={`Rate ${i} stars`}
        >
          <Star className={`${starClass} ${i <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
        </button>
      ))}
    </div>
  );
}