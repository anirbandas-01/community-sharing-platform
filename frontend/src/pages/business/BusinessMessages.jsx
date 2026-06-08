import {
  Home, Package, ShoppingCart, TrendingUp, MessageCircle, BarChart3, Settings, User as UserIcon,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MessagingCenter from '../../components/messages/MessagingCenter.jsx';


const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/business/dashboard' },
  { icon: Package, label: 'Inventory', path: '/business/inventory' },
  { icon: ShoppingCart, label: 'Orders', path: '/business/orders' },
  { icon: TrendingUp, label: 'Sales', path: '/business/sales' },
  { icon: MessageCircle, label: 'Messages', path: '/business/messages' },
  { icon: BarChart3, label: 'Analytics', path: '/business/analytics' },
  { icon: UserIcon, label: 'Profile', path: '/business/profile' },
  { icon: Settings, label: 'Settings', path: '/business/settings' },
];

export default function BusinessMessages() {
  return (
    <MessagingCenter
      menuItems={menuItems}
      userType="business"
      DashboardLayout={DashboardLayout}
    />
  );
}