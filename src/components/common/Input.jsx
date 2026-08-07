export default function Input({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  hint,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          id={id}
          className={`${Icon ? 'pl-10' : ''} input rounded-xl ${
            error
              ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-100'
              : 'focus:border-indigo-500 focus:ring-indigo-100'
          } disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600" role="alert">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}
