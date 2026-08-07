import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HeartPulse, Menu, X, ChevronDown, LayoutDashboard, LogOut, KeyRound } from 'lucide-react';
import { useAuth } from '@/features/auth/useAuth';
import { useLogout } from '@/hooks/auth/useLogout';
import { getRedirectPath } from '@/utils/roleRedirect';
import Avatar from '@/components/common/Avatar';
import NotificationBell from '@/components/layout/NotificationBell';

const links = [
  { to: '/', label: 'Home' },
  { to: '/doctors', label: 'Find Doctors' },
];

export default function Navbar() {
  const { isAuthenticated, role, user } = useAuth();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const dashboardPath = getRedirectPath(role) === '/' ? '/login' : getRedirectPath(role);

  const handleLogout = () => {
    setUserOpen(false);
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md shadow-indigo-200">
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
                `nav-link focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                  isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : ''
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <div className="relative">
                <button
                  onClick={() => setUserOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl p-1.5 pr-2.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-haspopup="menu"
                  aria-expanded={userOpen}
                >
                  <Avatar name={user?.fullName ?? 'User'} size="sm" />
                  <span className="hidden text-sm font-semibold text-slate-700 lg:block">
                    {user?.fullName?.split(' ')[0] ?? 'User'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition ${userOpen ? 'rotate-180' : ''}`} />
                </button>
                {userOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />
                    <div
                      role="menu"
                      className="animate-zoom-in absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl"
                    >
                      <div className="border-b border-slate-100 px-4 py-3">
                        <p className="truncate text-sm font-bold text-slate-900">{user?.fullName}</p>
                        <p className="truncate text-xs text-slate-400">{user?.email}</p>
                      </div>
                      <button
                        role="menuitem"
                        onClick={() => {
                          setUserOpen(false);
                          navigate(dashboardPath);
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:bg-indigo-50"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </button>
                      <button
                        role="menuitem"
                        onClick={() => {
                          setUserOpen(false);
                          navigate('/change-password');
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:bg-indigo-50"
                      >
                        <KeyRound className="h-4 w-4" />
                        Change password
                      </button>
                      <button
                        role="menuitem"
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1">
                Sign in
              </Link>
              <Link to="/register/patient" className="btn-primary">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="animate-fade-in border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-1 py-1">
                  <Avatar name={user?.fullName ?? 'User'} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{user?.fullName}</p>
                    <p className="truncate text-xs text-slate-400">{user?.email}</p>
                  </div>
                </div>
                <button onClick={() => navigate(dashboardPath)} className="btn-primary w-full">
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/change-password');
                  }}
                  className="btn-outline w-full"
                >
                  <KeyRound className="h-4 w-4" />
                  Change password
                </button>
                <button onClick={handleLogout} className="btn-outline w-full text-rose-600">
                  Sign out
                </button>
              </>
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
