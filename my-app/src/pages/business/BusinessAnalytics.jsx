import { BarChart3 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Home, Package, ShoppingCart, TrendingUp, MessageCircle, Settings, User as UserIcon } from 'lucide-react';

const BusinessAnalytics = () => {
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
      <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
        <Card className="max-w-2xl text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-12 h-12 text-white" />
          </div>
          <Badge variant="info" size="lg" className="mb-4">Coming Soon</Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Advanced Analytics Dashboard</h1>
          <p className="text-gray-600 text-lg mb-8">
            Get deep insights into your business performance with powerful analytics tools, detailed reports, and data visualizations.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Sales Analytics</h3>
              <p className="text-sm text-gray-600">Track revenue trends and performance metrics</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">📈 Customer Insights</h3>
              <p className="text-sm text-gray-600">Understand your customer behavior patterns</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">📦 Inventory Reports</h3>
              <p className="text-sm text-gray-600">Optimize stock levels with smart analytics</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">💰 Financial Dashboard</h3>
              <p className="text-sm text-gray-600">Comprehensive financial reporting tools</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BusinessAnalytics;