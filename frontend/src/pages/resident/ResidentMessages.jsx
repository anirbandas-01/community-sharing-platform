import {
  Home, Users, Briefcase, Calendar, MessageCircle,
  Settings, User as UserIcon, Star, Store, ShoppingCart
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MessagingCenter from '../../components/messages/MessagingCenter';
import { useLocation } from 'react-router-dom';

const menuItems = [
  { icon: Home,          label: 'Dashboard',          path: '/resident/dashboard' },
  { icon: Users,         label: 'My Communities',     path: '/resident/communities' },
  { icon: Briefcase,     label: 'Find Professionals', path: '/resident/professionals' },
  { icon: Users,         label: 'Find Residents',     path: '/resident/find-residents' },
  { icon: Store,         label: 'Shop',               path: '/resident/shop' },
  { icon: ShoppingCart,  label: 'My Orders',          path: '/resident/my-orders' },
  { icon: Calendar,      label: 'My Bookings',        path: '/resident/bookings' },
  { icon: Star,          label: 'My Reviews',         path: '/resident/reviews' },
  { icon: MessageCircle, label: 'Messages',           path: '/resident/messages' },
  { icon: UserIcon,      label: 'Profile',            path: '/resident/profile' },
  { icon: Settings,      label: 'Settings',           path: '/resident/settings' },
];

export default function ResidentMessages() {
  const location = useLocation();
  return (
    <MessagingCenter
      menuItems={menuItems}
      userType="resident"
      DashboardLayout={DashboardLayout}
      initialTab={location.state?.tab}
      initialCommunityId={location.state?.communityId}
    />
  );
}