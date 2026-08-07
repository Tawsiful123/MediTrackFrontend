import { AlertTriangle, HeartPulse, Info, ShieldAlert } from 'lucide-react';

const LEVELS = {
  low: { label: 'Low', classes: 'bg-emerald-100 text-emerald-800 ring-emerald-200', Icon: Info },
  mild: { label: 'Mild', classes: 'bg-lime-50 text-lime-700 ring-lime-200', Icon: Info },
  moderate: { label: 'Moderate', classes: 'bg-amber-100 text-amber-800 ring-amber-200', Icon: AlertTriangle },
  high: { label: 'High', classes: 'bg-orange-100 text-orange-800 ring-orange-200', Icon: ShieldAlert },
  severe: { label: 'Severe', classes: 'bg-rose-100 text-rose-800 ring-rose-200', Icon: HeartPulse },
  emergency: {
    label: 'Emergency',
    classes: 'bg-red-600 text-white ring-red-500',
    Icon: HeartPulse,
  },
};

export default function UrgencyBadge({ urgencyLevel, className = '' }) {
  if (!urgencyLevel) return null;

  const key = String(urgencyLevel).toLowerCase();
  const config =
    LEVELS[key] ?? {
      label: String(urgencyLevel),
      classes: 'bg-slate-100 text-slate-700 ring-slate-200',
      Icon: Info,
    };
  const { label, classes, Icon } = config;
  const isEmergency = key === 'emergency';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${classes} ${
        isEmergency ? 'animate-pulse' : ''
      } ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label} urgency
    </span>
  );
}