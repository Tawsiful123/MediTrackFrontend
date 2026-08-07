import { ChevronDown } from 'lucide-react';

export default function Select({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
  className = '',
  id,
  children,
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
        <select
          id={id}
          className={`input appearance-none rounded-xl pr-10 ${
            error
              ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-100'
              : 'focus:border-indigo-500 focus:ring-indigo-100'
          } disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => {
            const value = typeof opt === 'object' ? opt.value : opt;
            const labelText = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={value} value={value}>
                {labelText}
              </option>
            );
          })}
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-rose-600" role="alert">{error}</p>
      )}
    </div>
  );
}
