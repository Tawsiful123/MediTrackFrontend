import { Link } from 'react-router-dom';
import { HeartPulse, ArrowLeft } from 'lucide-react';

const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };

export default function AuthLayout({
  icon: Icon = HeartPulse,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'md',
  alert,
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-gradient px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.16),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(20,184,166,0.18),transparent_55%)]" />
      <div className={`animate-zoom-in relative w-full ${widths[maxWidth]}`}>
        <div className="card p-8 shadow-2xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg shadow-indigo-200">
              <Icon className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            {alert && <div className="mt-4 w-full">{alert}</div>}
          </div>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 border-t border-slate-100 pt-5">{footer}</div>}
        </div>
        <p className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-100 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60 rounded-lg px-2 py-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to MediTrack
          </Link>
        </p>
      </div>
    </div>
  );
}
