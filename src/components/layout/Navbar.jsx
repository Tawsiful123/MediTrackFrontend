import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HeartPulse, Menu, X } from 'lucide-react';
import { useAuth } from '@/features/auth/useAuth';
import { roleRedirect } from '@/utils/roleRedirect';

const links = [
  { to: '/', label: 'Home' },
  { to: '/doctors', label: 'Find Doctors' },
];

export default function Navbar() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardPath = roleRedirect[role] ?? '/login';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Medi<span className="bg-brand-gradient bg-clip-text text-transparent">Track</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'bg-indigo-50 text-indigo-700' : ''}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <button
              onClick={() => navigate(dashboardPath)}
              className="btn-primary"
            >
              Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Sign in
              </Link>
              <Link to="/register/patient" className="btn-primary">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
            >
              {l.label}
            </NavLink>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
            {isAuthenticated ? (
              <button onClick={() => navigate(dashboardPath)} className="btn-primary w-full">
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline w-full">
                  Sign in
                </Link>
                <Link to="/register/patient" onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}