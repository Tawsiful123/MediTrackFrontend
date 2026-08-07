import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, LayoutDashboard, User, MapPin, ClipboardList, ListChecks, Star, Bot, History } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import NotificationBell from '@/components/layout/NotificationBell';
import { useLogout } from '@/hooks/auth/useLogout';

const navItems = [
  { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/patient/profile', label: 'My Profile', icon: User },
  { to: '/patient/doctors/nearby', label: 'Nearby Doctors', icon: MapPin },
  { to: '/patient/appointments', label: 'My Appointments', icon: ClipboardList },
  { to: '/patient/queue', label: 'My Queue', icon: ListChecks },
  { to: '/patient/reviews', label: 'My Reviews', icon: Star },
  { to: '/patient/chatbot', label: 'Health Assistant', icon: Bot },
  { to: '/patient/chatbot/history', label: 'Chat History', icon: History },
];

export default function PatientLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
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
            <h1 className="text-lg font-bold text-slate-900">Patient Portal</h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}