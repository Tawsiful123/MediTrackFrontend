import {
  LayoutDashboard, User, Stethoscope, Inbox,
  ClipboardList, ListChecks,
} from 'lucide-react';
import PortalLayout from '@/layouts/PortalLayout';

const navItems = [
  { to: '/assistant/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { section: 'Clinic' },
  { to: '/assistant/doctor', label: 'Assigned Doctor', icon: Stethoscope },
  { to: '/assistant/requests', label: 'Appointment Requests', icon: Inbox },
  { to: '/assistant/appointments', label: 'All Appointments', icon: ClipboardList },
  { to: '/assistant/queue', label: 'Queue Management', icon: ListChecks },
  { section: 'Account' },
  { to: '/assistant/profile', label: 'My Profile', icon: User },
];

export default function AssistantLayout() {
  return (
    <PortalLayout
      title="Assistant Portal"
      subtitle="Keep the clinic running smoothly"
      navItems={navItems}
    />
  );
}
