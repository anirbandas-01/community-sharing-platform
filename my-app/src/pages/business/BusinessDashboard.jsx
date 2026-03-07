import { Home, Package, ShoppingCart, TrendingUp, MessageCircle, Settings, User as UserIcon, BarChart3 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const BusinessDashboard = () => {
  const { user } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/business/dashboard' },
    { icon: Package, label: 'Inventory', path: '/business/inventory', badge: '45' },
    { icon: ShoppingCart, label: 'Orders', path: '/business/orders', badge: '12' },
    { icon: TrendingUp, label: 'Sales', path: '/business/sales' },
    { icon: MessageCircle, label: 'Messages', path: '/business/messages', badge: '8' },
    { icon: BarChart3, label: 'Analytics', path: '/business/analytics' },
    { icon: UserIcon, label: 'Profile', path: '/business/profile' },
    { icon: Settings, label: 'Settings', path: '/business/settings' },
  ];

  const stats = [
    { label: 'Total Revenue', value: '₹1,24,500', change: '+18% from last month', color: 'green', icon: '💰' },
    { label: 'Pending Orders', value: '12', change: '8 new today', color: 'orange', icon: '📦' },
    { label: 'Products Listed', value: '45', change: '5 low stock', color: 'blue', icon: '🏪' },
    { label: 'Total Customers', value: '286', change: '+32 this month', color: 'purple', icon: '👥' },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'Sarah Wilson', items: 3, total: '₹2,450', status: 'processing', time: '10 mins ago' },
    { id: '#ORD-002', customer: 'David Brown', items: 1, total: '₹1,200', status: 'shipped', time: '1 hour ago' },
    { id: '#ORD-003', customer: 'Lisa Anderson', items: 5, total: '₹4,800', status: 'delivered', time: '3 hours ago' },
    { id: '#ORD-004', customer: 'Mike Johnson', items: 2, total: '₹1,850', status: 'pending', time: '5 hours ago' },
  ];

  const topProducts = [
    { name: 'Organic Rice (5kg)', sold: 45, revenue: '₹13,500', stock: 23, trend: 'up' },
    { name: 'Fresh Vegetables Pack', sold: 38, revenue: '₹11,400', stock: 15, trend: 'up' },
    { name: 'Dairy Products Combo', sold: 32, revenue: '₹9,600', stock: 8, trend: 'down' },
    { name: 'Cooking Oil (2L)', sold: 28, revenue: '₹8,400', stock: 45, trend: 'up' },
  ];

  const lowStockItems = [
    { name: 'Dairy Products Combo', current: 8, minimum: 15, urgency: 'high' },
    { name: 'Fresh Vegetables Pack', current: 15, minimum: 20, urgency: 'medium' },
    { name: 'Bread Loaves', current: 12, minimum: 18, urgency: 'medium' },
  ];

  const salesData = [
    { day: 'Mon', amount: 15000 },
    { day: 'Tue', amount: 18000 },
    { day: 'Wed', amount: 22000 },
    { day: 'Thu', amount: 19000 },
    { day: 'Fri', amount: 25000 },
    { day: 'Sat', amount: 28000 },
    { day: 'Sun', amount: 20000 },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
    };
    return colors[status] || 'default';
  };

  return (
    <DashboardLayout menuItems={menuItems} userType="business">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Business Owner'}! 🏪
        </h1>
        <p className="text-gray-600">Manage your inventory and track your sales</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx} hover className="relative overflow-hidden">
            <div className="absolute top-0 right-0 text-6xl opacity-10">
              {stat.icon}
            </div>
            <div className="relative">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Orders */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.items}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.total}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Sales Chart */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Weekly Sales</h2>
              <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="flex items-end gap-3 h-64">
              {salesData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-orange-500 to-red-500 rounded-t-lg relative" style={{ height: `${(item.amount / 30000) * 100}%` }}>
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-900 whitespace-nowrap">
                      ₹{(item.amount / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{item.day}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Products */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Selling Products</h2>
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">Sold: {product.sold}</span>
                      <span className="text-sm font-medium text-green-600">{product.revenue}</span>
                      <span className={`text-sm ${product.stock < 10 ? 'text-red-600' : 'text-gray-600'}`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                  <div className={`text-2xl ${product.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {product.trend === 'up' ? '📈' : '📉'}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-start">
                <Package className="w-5 h-5 mr-2" />
                Add Product
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ShoppingCart className="w-5 h-5 mr-2" />
                View Orders
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-5 h-5 mr-2" />
                Sales Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-5 h-5 mr-2" />
                Messages
              </Button>
            </div>
          </Card>

          {/* Low Stock Alert */}
          <Card className="border-2 border-red-200 bg-red-50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Low Stock Alert</h2>
            </div>
            <div className="space-y-3">
              {lowStockItems.map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    <Badge variant="danger" size="sm">{item.urgency}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(item.current / item.minimum) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{item.current}/{item.minimum}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="danger" size="sm" className="w-full mt-4">
              Restock Items
            </Button>
          </Card>

          {/* Business Insights */}
          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📊</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Business Insight</h3>
                <p className="text-sm opacity-90 mb-3">
                  Your sales increased by 18% this month! Weekend sales are particularly strong.
                </p>
                <Button variant="secondary" size="sm" className="bg-white text-orange-600 hover:bg-gray-100">
                  View Analytics
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BusinessDashboard;