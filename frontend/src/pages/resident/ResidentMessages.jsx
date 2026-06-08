import {
  Home, Users, Briefcase, Calendar, MessageCircle, Settings, User as UserIcon,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MessagingCenter from '../../components/messages/MessagingCenter.jsx';


const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/resident/dashboard' },
  { icon: Users, label: 'My Communities', path: '/resident/communities' },
  { icon: Briefcase, label: 'Find Professionals', path: '/resident/professionals' },
  { icon: Calendar, label: 'My Bookings', path: '/resident/bookings' },
  { icon: MessageCircle, label: 'Messages', path: '/resident/messages' },
  { icon: UserIcon, label: 'Profile', path: '/resident/profile' },
  { icon: Settings, label: 'Settings', path: '/resident/settings' },
];

export default function ResidentMessages() {
  return (
    <MessagingCenter
      menuItems={menuItems}
      userType="resident"
      DashboardLayout={DashboardLayout}
    />
  );
}