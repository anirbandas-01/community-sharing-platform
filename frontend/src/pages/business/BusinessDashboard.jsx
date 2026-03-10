import { useState, useEffect } from 'react';
import { Home, Package, ShoppingCart, TrendingUp, MessageCircle, Settings, User as UserIcon, BarChart3 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/business/dashboard');
      setDashboard(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout menuItems={menuItems} userType="business">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboard) {
    return (
      <DashboardLayout menuItems={menuItems} userType="business">
        <Card className="text-center py-12">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h3>
          <p className="text-gray-600 mb-6">Please try again</p>
          <Button variant="primary" onClick={fetchDashboard}>Retry</Button>
        </Card>
      </DashboardLayout>
    );
  }

  const stats = [
    { label: 'Total Revenue', value: `₹${dashboard.revenue?.total?.toLocaleString() || 0}`, change: dashboard.revenue?.change || '', icon: '💰' },
    { label: 'Pending Orders', value: dashboard.orders?.pending || 0, change: dashboard.orders?.new_today ? `${dashboard.orders.new_today} new today` : '', icon: '📦' },
    { label: 'Products Listed', value: dashboard.products?.total || 0, change: dashboard.products?.low_stock ? `${dashboard.products.low_stock} low stock` : '', icon: '🏪' },
    { label: 'Total Customers', value: dashboard.customers?.total || 0, change: dashboard.customers?.new_month ? `+${dashboard.customers.new_month} this month` : '', icon: '👥' },
  ];

  const recentOrders = dashboard.orders?.recent || [];
  const topProducts = dashboard.products?.top || [];
  const lowStockItems = dashboard.products?.low_stock_items || [];

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Business Owner'}! 🏪
        </h1>
        <p className="text-gray-600">Manage your inventory and track your sales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx} hover className="relative overflow-hidden">
            <div className="absolute top-0 right-0 text-6xl opacity-10">{stat.icon}</div>
            <div className="relative">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/business/orders'}>View All</Button>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No recent orders</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{order.customer}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">₹{order.total}</td>
                        <td className="px-4 py-4"><Badge variant={getStatusColor(order.status)}>{order.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Selling Products</h2>
            {topProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No sales data yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                      #{idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>Sold: {product.sold}</span>
                        <span className="font-medium text-green-600">₹{product.revenue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-start" onClick={() => window.location.href = '/business/inventory'}>
                <Package className="w-5 h-5 mr-2" />
                Add Product
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/business/orders'}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                View Orders
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/business/sales'}>
                <TrendingUp className="w-5 h-5 mr-2" />
                Sales Report
              </Button>
            </div>
          </Card>

          {lowStockItems.length > 0 && (
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
                      <Badge variant="danger" size="sm">Low</Badge>
                    </div>
                    <div className="text-xs text-gray-600">{item.current}/{item.minimum} units</div>
                  </div>
                ))}
              </div>
              <Button variant="danger" size="sm" className="w-full mt-4" onClick={() => window.location.href = '/business/inventory'}>
                Restock Items
              </Button>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BusinessDashboard;