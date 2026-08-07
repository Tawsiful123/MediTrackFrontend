import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 'md', label, fullScreen = false }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  const inner = (
    <div className="flex items-center justify-center gap-3 text-slate-500">
      <Loader2 className={`${sizes[size]} animate-spin text-indigo-600`} />
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
  return fullScreen ? <div className="flex min-h-[60vh] items-center justify-center">{inner}</div> : inner;
}