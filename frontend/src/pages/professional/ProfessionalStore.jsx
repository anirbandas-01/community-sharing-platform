import { Home, Briefcase, Calendar, MessageCircle, Users, Settings, User as UserIcon, ShoppingBag } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProductStore from '../shared/ProductStore';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/professional/dashboard' },
  { icon: Calendar, label: 'My Bookings', path: '/professional/bookings' },
  { icon: Briefcase, label: 'My Services', path: '/professional/services' },
  { icon: ShoppingBag, label: 'Shop', path: '/professional/shop' },
  { icon: ShoppingBag, label: 'My Orders', path: '/professional/my-orders' },
  { icon: Users, label: 'My Groups', path: '/professional/groups' },
  { icon: MessageCircle, label: 'Messages', path: '/professional/messages' },
  { icon: UserIcon, label: 'Profile', path: '/professional/profile' },
  { icon: Settings, label: 'Settings', path: '/professional/settings' },
];

export default function ProfessionalStore() {
  return (
    <ProductStore
      menuItems={menuItems}
      userType="professional"
      DashboardLayout={DashboardLayout}
    />
  );
}