import {
  LayoutDashboard, User, MapPin, ClipboardList, ListChecks, Star, Bot, History,
} from 'lucide-react';
import PortalLayout from '@/layouts/PortalLayout';

const navItems = [
  { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/patient/profile', label: 'My Profile', icon: User },
  { to: '/patient/doctors/nearby', label: 'Nearby Doctors', icon: MapPin },
  { to: '/patient/appointments', label: 'My Appointments', icon: ClipboardList },
  { to: '/patient/queue', label: 'My Queue', icon: ListChecks },
  { to: '/patient/reviews', label: 'My Reviews', icon: Star },
  { section: 'AI Assistant' },
  { to: '/patient/chatbot', label: 'Health Assistant', icon: Bot },
  { to: '/patient/chatbot/history', label: 'Chat History', icon: History },
];

export default function PatientLayout() {
  return (
    <PortalLayout
      title="Patient Portal"
      subtitle="Manage appointments, queue and reviews"
      navItems={navItems}
    />
  );
}
