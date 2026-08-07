export default function Input({
  label,
  error,
  icon: Icon,
  className = '',
  id,
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
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          id={id}
          className={`${Icon ? 'pl-9' : ''} input ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}