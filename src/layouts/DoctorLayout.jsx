import {
  LayoutDashboard, User, CalendarDays, MapPin,
  Users, Star, ListChecks,
} from 'lucide-react';
import PortalLayout from '@/layouts/PortalLayout';

const navItems = [
  { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { section: 'Practice' },
  { to: '/doctor/schedule', label: 'My Schedule', icon: CalendarDays },
  { to: '/doctor/clinic-location', label: 'Clinic Location', icon: MapPin },
  { to: '/doctor/queue', label: 'Queue', icon: ListChecks },
  { section: 'Patients' },
  { to: '/doctor/patients/today', label: "Today's Patients", icon: Users },
  { to: '/doctor/patients', label: 'All Patients', icon: Users },
  { section: 'Account' },
  { to: '/doctor/profile', label: 'Profile Settings', icon: User },
  { to: '/doctor/reviews', label: 'My Reviews', icon: Star },
];

export default function DoctorLayout() {
  return (
    <PortalLayout
      title="Doctor Portal"
      subtitle="Manage your practice and patients"
      navItems={navItems}
    />
  );
}
