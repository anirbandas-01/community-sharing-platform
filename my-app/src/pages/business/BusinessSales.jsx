import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Calendar, Download } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { Home, Package, ShoppingCart, MessageCircle, BarChart3, Settings, User as UserIcon } from 'lucide-react';

const BusinessSales = () => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');

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
    fetchSalesData();
  }, [period]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/business/sales?period=${period}`);
      setSalesData(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
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
            <p className="text-gray-600">Loading sales data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!salesData) {
    return (
      <DashboardLayout menuItems={menuItems} userType="business">
        <Card className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sales Data</h3>
          <p className="text-gray-600 mb-6">Unable to load sales data</p>
          <Button variant="primary" onClick={fetchSalesData}>Retry</Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems} userType="business">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Report</h1>
          <p className="text-gray-600">Track your revenue and performance</p>
        </div>
        <Button variant="outline" onClick={() => alert('Export feature coming soon!')}>
          <Download className="w-5 h-5 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="mb-6 flex gap-2">
        {['week', 'month', 'year'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize
              ${period === p ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            This {p}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{salesData.revenue?.total?.toLocaleString() || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{salesData.orders?.total || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{salesData.avg_order_value || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Growth</p>
              <p className="text-2xl font-bold text-green-600">+{salesData.growth || 0}%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Overview</h2>
          {salesData.daily_sales?.length > 0 ? (
            <div className="space-y-3">
              {salesData.daily_sales.map((day, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{day.date}</p>
                    <p className="text-sm text-gray-600">{day.orders} orders</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">₹{day.revenue}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No sales data for this period</p>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Products</h2>
          {salesData.top_products?.length > 0 ? (
            <div className="space-y-3">
              {salesData.top_products.map((product, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.units} units sold</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">₹{product.revenue}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No product sales yet</p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BusinessSales;