import {
  Home, Briefcase, Calendar, MessageCircle, Users, TrendingUp, Settings, User as UserIcon,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MessagingCenter from '../../components/messages/MessagingCenter.jsx';


const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/professional/dashboard' },
  { icon: Calendar, label: 'My Bookings', path: '/professional/bookings' },
  { icon: Briefcase, label: 'My Services', path: '/professional/services' },
  { icon: Users, label: 'My Groups', path: '/professional/groups' },
  { icon: MessageCircle, label: 'Messages', path: '/professional/messages' },
/*   { icon: TrendingUp, label: 'Analytics', path: '/professional/analytics' }, */
  { icon: UserIcon, label: 'Profile', path: '/professional/profile' },
  { icon: Settings, label: 'Settings', path: '/professional/settings' },
];

export default function ProfessionalMessages() {
  return (
    <MessagingCenter
      menuItems={menuItems}
      userType="professional"
      DashboardLayout={DashboardLayout}
    />
  );
}