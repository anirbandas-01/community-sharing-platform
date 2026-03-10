import { useState } from 'react';
import { MessageCircle, Send, Search, User } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { Home, Package, ShoppingCart, TrendingUp, BarChart3, Settings, User as UserIcon } from 'lucide-react';

const BusinessMessages = () => {
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <DashboardLayout menuItems={menuItems} userType="business">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Communicate with your customers</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 250px)' }}>
        <Card className="lg:col-span-1 flex flex-col">
          <div className="mb-4">
            <Input
              icon={Search}
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messages Yet</h3>
              <p className="text-sm text-gray-600">Your customer conversations will appear here</p>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Conversation Selected</h3>
              <p className="text-gray-600 mb-6">Select a conversation to start messaging</p>
              <Badge variant="info">Messaging feature coming soon</Badge>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BusinessMessages;