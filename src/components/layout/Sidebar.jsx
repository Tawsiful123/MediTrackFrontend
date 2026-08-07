import { NavLink } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { useAuth } from '@/features/auth/useAuth';
import Avatar from '@/components/common/Avatar';

export default function Sidebar({ items = [], open, onClose, onLogout, loggingOut = false }) {
  const { user } = useAuth();
  const roleLabel = (user?.role ?? 'USER').toLowerCase().replace('_', ' ');

  return (
    <>
      {open && (
        <div
          className="animate-fade-in fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="text-lg font-extrabold tracking-tight">
            Medi<span className="bg-brand-gradient bg-clip-text text-transparent">Track</span>
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((item) => {
            if (item.section) {
              return (
                <p
                  key={item.section}
                  className="mt-5 px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 first:mt-0"
                >
                  {item.section}
                </p>
              );
            }
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                    isActive
                      ? 'bg-brand-gradient text-white shadow-md shadow-indigo-200'
                      : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full transition ${
                        isActive ? 'bg-white' : 'bg-transparent group-hover:bg-indigo-200'
                      }`}
                    />
                    <Icon className={`h-5 w-5 shrink-0 ${isActive ? '' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 bg-slate-50/60 p-4">
          <div className="mb-3 flex items-center gap-3 px-1">
            <Avatar name={user?.fullName ?? 'User'} size="sm" ring />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{user?.fullName ?? 'User'}</p>
              <p className="truncate text-xs text-slate-400">{roleLabel}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:opacity-60"
          >
            <LogOut className="h-5 w-5" />
            {loggingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </aside>
    </>
  );
}
