import { getInitials } from '@/utils/getInitials';

const gradient = [
  'from-indigo-500 to-purple-500',
  'from-teal-500 to-emerald-500',
  'from-rose-500 to-orange-400',
  'from-blue-500 to-cyan-400',
  'from-amber-500 to-yellow-400',
];

const sizes = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-24 w-24 text-3xl',
};

export default function Avatar({ name = '', src, size = 'md', className = '', ring = false }) {
  const hash = [...(name || '')].reduce((a, c) => a + c.charCodeAt(0), 0);
  const g = gradient[hash % gradient.length];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} shrink-0 rounded-full object-cover ${
          ring ? 'ring-4 ring-indigo-100' : ''
        } ${className}`}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${g} font-bold text-white shadow-sm ${
        ring ? 'ring-4 ring-indigo-100' : ''
      } ${className}`}
    >
      {getInitials(name) || '?'}
    </div>
  );
}
