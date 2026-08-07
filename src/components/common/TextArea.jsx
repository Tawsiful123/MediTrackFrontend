export default function TextArea({ label, error, className = '', id, hint, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={4}
        className={`input resize-y rounded-xl leading-relaxed ${
          error
            ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-100'
            : 'focus:border-indigo-500 focus:ring-indigo-100'
        } disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600" role="alert">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}
