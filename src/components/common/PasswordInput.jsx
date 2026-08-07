import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function PasswordInput({
  label = 'Password',
  error,
  icon: Icon = Lock,
  className = '',
  ...props
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="label" htmlFor={props.id}>
          {label}
        </label>
      )}
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type={visible ? 'text' : 'password'}
          className={`input rounded-xl pl-10 pr-11 ${
            error
              ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-100'
              : 'focus:border-indigo-500 focus:ring-indigo-100'
          } ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-rose-600" role="alert">{error}</p>
      )}
    </div>
  );
}
