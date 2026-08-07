import {
  LayoutDashboard, ShieldCheck, Users, UserCog,
  MessageSquare, Tags, BarChart3, User,
} from 'lucide-react';
import PortalLayout from '@/layouts/PortalLayout';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { section: 'Moderation' },
  { to: '/admin/doctors/pending', label: 'Pending Doctors', icon: ShieldCheck },
  { to: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { section: 'Directory' },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/assistants', label: 'Assistants', icon: UserCog },
  { to: '/admin/specializations', label: 'Specializations', icon: Tags },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { section: 'Account' },
  { to: '/admin/profile', label: 'My Profile', icon: User },
];

export default function AdminLayout() {
  return (
    <PortalLayout
      title="Admin Portal"
      subtitle="Oversee the entire platform"
      navItems={navItems}
    />
  );
}
