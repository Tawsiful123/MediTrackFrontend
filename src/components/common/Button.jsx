import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

const iconSizes = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };

const iconOnlySizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };

export default function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  icon: Icon,
  className = '',
  children,
  disabled,
  ...props
}) {
  const iconOnly = !children;
  return (
    <button
      type={type}
      className={`${variants[variant]} ${sizes[size]} ${iconOnly ? `px-0 ${iconOnlySizes[size]}` : ''} whitespace-nowrap focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : Icon ? (
        <Icon className={iconSizes[size]} />
      ) : null}
      {children}
    </button>
  );
}
