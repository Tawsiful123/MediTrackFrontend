import { getInitials } from '@/utils/getInitials';

const gradient = [
  'from-indigo-500 to-purple-500',
  'from-teal-500 to-emerald-500',
  'from-rose-500 to-orange-400',
  'from-blue-500 to-cyan-400',
  'from-amber-500 to-yellow-400',
];

export default function Avatar({ name = '', src, size = 'md', className = '' }) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg' };
  const hash = [...(name || '')].reduce((a, c) => a + c.charCodeAt(0), 0);
  const g = gradient[hash % gradient.length];

  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ${className}`} />;
  }
  return (
    <div
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-gradient-to-br ${g} font-bold text-white ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}