import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Menu, LayoutDashboard, User, Stethoscope, Inbox,
  ClipboardList, ListChecks,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import NotificationBell from '@/components/layout/NotificationBell';
import { useAuth } from '@/features/auth/useAuth';

const navItems = [
  { to: '/assistant/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/assistant/doctor', label: 'Assigned Doctor', icon: Stethoscope },
  { to: '/assistant/requests', label: 'Appointment Requests', icon: Inbox },
  { to: '/assistant/appointments', label: 'All Appointments', icon: ClipboardList },
  { to: '/assistant/queue', label: 'Queue Management', icon: ListChecks },
  { to: '/assistant/profile', label: 'My Profile', icon: User },
];

export default function AssistantLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        items={navItems}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-lg sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">Assistant Portal</h1>
          </div>
          <NotificationBell />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}