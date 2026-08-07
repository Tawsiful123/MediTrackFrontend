import { getStatusColor } from '@/utils/constants';

const colors = {
  yellow: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
  blue: 'bg-blue-100 text-blue-800 ring-blue-200',
  green: 'bg-green-100 text-green-800 ring-green-200',
  gray: 'bg-slate-200 text-slate-700 ring-slate-300',
  red: 'bg-rose-100 text-rose-800 ring-rose-200',
  purple: 'bg-purple-100 text-purple-800 ring-purple-200',
  teal: 'bg-teal-100 text-teal-800 ring-teal-200',
};

const dots = {
  yellow: 'bg-yellow-500',
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  gray: 'bg-slate-400',
  red: 'bg-rose-500',
  purple: 'bg-purple-500',
  teal: 'bg-teal-500',
};

export default function Badge({ status = '', className = '', children, size = 'md', dot = false }) {
  const key = getStatusColor(status);
  const color = colors[key] ?? colors.gray;
  const base = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';
  return (
    <span className={`badge ${color} ring-1 ring-inset ${base} ${className}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dots[key] ?? dots.gray}`} aria-hidden="true" />}
      {children || status}
    </span>
  );
}
