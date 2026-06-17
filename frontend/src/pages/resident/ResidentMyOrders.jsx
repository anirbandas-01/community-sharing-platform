import { Home, Users, Briefcase, Calendar, MessageCircle, Settings, User as UserIcon, Star, ShoppingBag } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MyOrders from '../shared/MyOrders';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/resident/dashboard' },
  { icon: Users, label: 'My Communities', path: '/resident/communities' },
  { icon: Briefcase, label: 'Find Professionals', path: '/resident/professionals' },
  { icon: Users, label: 'Find Residents', path: '/resident/find-residents' },
  { icon: ShoppingBag, label: 'Shop', path: '/resident/shop' },
  { icon: ShoppingBag, label: 'My Orders', path: '/resident/my-orders' },
  { icon: Calendar, label: 'My Bookings', path: '/resident/bookings' },
  { icon: Star, label: 'My Reviews', path: '/resident/reviews' },
  { icon: MessageCircle, label: 'Messages', path: '/resident/messages' },
  { icon: UserIcon, label: 'Profile', path: '/resident/profile' },
  { icon: Settings, label: 'Settings', path: '/resident/settings' },
];

export default function ResidentMyOrders() {
  return (
    <MyOrders
      menuItems={menuItems}
      userType="resident"
      DashboardLayout={DashboardLayout}
    />
  );
}