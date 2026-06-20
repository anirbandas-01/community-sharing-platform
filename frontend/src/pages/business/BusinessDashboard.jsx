import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Home, Package, ShoppingCart, TrendingUp, MessageCircle,
  Settings, User as UserIcon, BarChart3,
  Clock, XCircle, Building2, ArrowRight, CheckCircle2, Star
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const menuItems = [
  { icon: Home,          label: 'Dashboard', path: '/business/dashboard' },
  { icon: Package,       label: 'Inventory',  path: '/business/inventory' },
  { icon: ShoppingCart,  label: 'Orders',     path: '/business/orders' },
  { icon: TrendingUp,    label: 'Sales',      path: '/business/sales' },
  { icon: MessageCircle, label: 'Messages',   path: '/business/messages' },
  { icon: BarChart3,     label: 'Analytics',  path: '/business/analytics' },
  { icon: UserIcon,      label: 'Profile',    path: '/business/profile' },
  { icon: Settings,      label: 'Settings',   path: '/business/settings' },
  { icon: Star, label: 'Reviews', path: '/business/reviews' },
];

// ─── Enterprise gate screens (shown instead of dashboard) ──────────────────

function NoEnterpriseScreen({ navigate, userName }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">

      {/* Illustration / icon */}
      <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
        <Building2 className="w-12 h-12 text-primary-600" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">
        Welcome, {userName}! 👋
      </h1>
      <p className="text-gray-500 text-center max-w-md mb-10">
        You're registered as a business user but haven't added your business yet.
        Register your enterprise to unlock inventory, orders, sales, and more.
      </p>

      {/* Steps */}
      <div className="w-full max-w-lg bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          How it works
        </p>
        <div className="space-y-4">
          {[
            { step: '1', title: 'Register your business',   desc: 'Fill in your company details and submit for review.' },
            { step: '2', title: 'Wait for admin approval',  desc: 'Our team reviews your application within 1–2 business days.' },
            { step: '3', title: 'Get full dashboard access',desc: 'Inventory, orders, sales, messages — everything unlocks.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {step}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="primary"
        className="px-8 py-3 text-base"
        onClick={() => navigate('/business/enterprise/register')}
      >
        <Building2 className="w-5 h-5 mr-2" />
        Add Your Business
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}

function PendingScreen({ userName }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
        <Clock className="w-12 h-12 text-yellow-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">
        Verification Pending
      </h1>
      <p className="text-gray-500 text-center max-w-md mb-8">
        Hey {userName}, your enterprise application has been submitted and is currently
        under review by our admin team. You'll get full access once it's approved.
      </p>

      <div className="w-full max-w-lg bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-yellow-600" />
          <p className="font-semibold text-yellow-800">What happens next?</p>
        </div>
        <ul className="space-y-2 text-sm text-yellow-800">
          <li>• Our team will review your submitted documents.</li>
          <li>• This typically takes <strong>1–2 business days</strong>.</li>
          <li>• You'll have full access to your dashboard once approved.</li>
        </ul>
      </div>

      <Badge variant="warning" size="lg">⏳ Awaiting Admin Approval</Badge>
    </div>
  );
}

function RejectedScreen({ navigate }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <XCircle className="w-12 h-12 text-red-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">
        Verification Rejected
      </h1>
      <p className="text-gray-500 text-center max-w-md mb-8">
        Unfortunately your enterprise application was not approved. You can
        review your details and re-apply, or contact our support team for help.
      </p>

      <div className="w-full max-w-lg bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
        <p className="font-semibold text-red-800 mb-2">Common rejection reasons:</p>
        <ul className="space-y-1 text-sm text-red-700">
          <li>• Invalid or unverifiable registration number</li>
          <li>• Incomplete or mismatched business details</li>
          <li>• Unclear or incorrect business photo</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.location.href = 'mailto:support@CommunitySharing.com'}>
          Contact Support
        </Button>
        <Button variant="primary" onClick={() => navigate('/business/enterprise/register')}>
          Re-apply
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
         style={{ animation: 'slideDown .25s ease-out' }}>
      <div className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold whitespace-nowrap">
        <span className="text-yellow-400 text-lg">🔒</span>
        {message}
      </div>
      <style>{`
        @keyframes slideDown {
          from { opacity:0; transform:translateX(-50%) translateY(-12px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [dashboard, setDashboard]             = useState(null);
  const [dashLoading, setDashLoading]         = useState(true);
  const [enterpriseStatus, setEnterpriseStatus] = useState(null); // null = loading
  const [toast, setToast]                     = useState('');

  const firstName = user?.name?.split(' ')[0] || 'Business Owner';

  // ── Check enterprise status
  useEffect(() => {
    api.get('/business/profile')
      .then(res => setEnterpriseStatus(res.data.enterprise?.status ?? 'none'))
      .catch(() => setEnterpriseStatus('none'));
  }, []);

  // ── Fetch dashboard data only if approved
  useEffect(() => {
    if (enterpriseStatus === 'approved') fetchDashboard();
    else if (enterpriseStatus !== null) setDashLoading(false);
  }, [enterpriseStatus]);

  // ── Toast from redirect (EnterpriseProtectedRoute passes ?blocked=true&status=...)
  useEffect(() => {
    if (searchParams.get('blocked') === 'true') {
      const s = searchParams.get('status');
      const msgs = {
        none:     'Please add your business first to access this section.',
        pending:  'Your business is pending approval. Access unlocks after verification.',
        rejected: 'Your enterprise verification was rejected. Please re-apply.',
      };
      setToast(msgs[s] ?? 'Enterprise verification required.');
      setSearchParams({}, { replace: true });
    }
  }, []);

  const fetchDashboard = async () => {
    try {
      setDashLoading(true);
      const res = await api.get('/business/dashboard');
      setDashboard(res.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setDashLoading(false);
    }
  };

  // ── Loading state (waiting for enterprise status check)
  if (enterpriseStatus === null) {
    return (
      <DashboardLayout menuItems={menuItems} userType="business">
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  // ── Gate screens
  if (enterpriseStatus === 'none') {
    return (
      <DashboardLayout menuItems={menuItems} userType="business">
        {toast && <Toast message={toast} onClose={() => setToast('')} />}
        <NoEnterpriseScreen navigate={navigate} userName={firstName} />
      </DashboardLayout>
    );
  }

  if (enterpriseStatus === 'pending') {
    return (
      <DashboardLayout menuItems={menuItems} userType="business">
        {toast && <Toast message={toast} onClose={() => setToast('')} />}
        <PendingScreen userName={firstName} />
      </DashboardLayout>
    );
  }

  if (enterpriseStatus === 'rejected') {
    return (
      <DashboardLayout menuItems={menuItems} userType="business">
        {toast && <Toast message={toast} onClose={() => setToast('')} />}
        <RejectedScreen navigate={navigate} />
      </DashboardLayout>
    );
  }

  // ── Approved: normal dashboard
  if (dashLoading) {
    return (
      <DashboardLayout menuItems={menuItems} userType="business">
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
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
    {
      label: 'Total Revenue',
      value: `₹${(dashboard.revenue?.total || 0).toLocaleString()}`,
      change: dashboard.revenue?.change || '',
      icon: '💰',
    },
    {
      label: 'Pending Orders',
      value: dashboard.orders?.pending || 0,
      change: dashboard.orders?.new_today ? `${dashboard.orders.new_today} new today` : '',
      icon: '📦',
    },
    {
      label: 'Products Listed',
      value: dashboard.products?.total || 0,
      change: dashboard.products?.low_stock ? `${dashboard.products.low_stock} low stock` : '',
      icon: '🏪',
    },
    {
      label: 'Total Customers',
      value: dashboard.customers?.total || 0,
      change: dashboard.customers?.new_month ? `+${dashboard.customers.new_month} this month` : '',
      icon: '👥',
    },
  ];

  const recentOrders  = dashboard.orders?.recent || [];
  const topProducts   = dashboard.products?.top || [];
  const lowStockItems = dashboard.products?.low_stock_items || [];

  const getStatusColor = (status) =>
    ({ pending: 'warning', processing: 'info', shipped: 'primary', delivered: 'success' }[status] || 'default');

  return (
    <DashboardLayout menuItems={menuItems} userType="business">

      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {firstName}! 🏪
        </h1>
        <p className="text-gray-600">Manage your inventory and track your sales</p>
      </div>

      {/* Stats */}
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
          {/* Recent Orders */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/business/orders')}>View All</Button>
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
                        <td className="px-4 py-4">
                          <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Top Products */}
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
          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-start" onClick={() => navigate('/business/inventory/add')}>
                <Package className="w-5 h-5 mr-2" /> Add Product
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/business/orders')}>
                <ShoppingCart className="w-5 h-5 mr-2" /> View Orders
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/business/sales')}>
                <TrendingUp className="w-5 h-5 mr-2" /> Sales Report
              </Button>
            </div>
          </Card>

          {/* Low Stock */}
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
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      <Badge variant="danger" size="sm">Low</Badge>
                    </div>
                    <div className="text-xs text-gray-600">{item.current}/{item.minimum} units</div>
                  </div>
                ))}
              </div>
              <Button variant="danger" size="sm" className="w-full mt-4" onClick={() => navigate('/business/inventory')}>
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