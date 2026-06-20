import { useState, useEffect } from 'react';
import {
  ShoppingCart, Package, Clock, CheckCircle, XCircle, Truck,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import {
  Home, TrendingUp, MessageCircle, BarChart3, Settings, User as UserIcon, Star
} from 'lucide-react';

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

const STATUS_CONFIG = {
  pending:    { color: 'warning', Icon: Clock,       label: 'Pending' },
  processing: { color: 'info',    Icon: Package,     label: 'Processing' },
  shipped:    { color: 'primary', Icon: Truck,       label: 'Shipped' },
  delivered:  { color: 'success', Icon: CheckCircle, label: 'Delivered' },
  cancelled:  { color: 'danger',  Icon: XCircle,     label: 'Cancelled' },
};

function StatusBadge({ status }) {
  const { color, Icon, label } = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <Badge variant={color}>
      <div className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        <span className="capitalize">{label}</span>
      </div>
    </Badge>
  );
}

export default function BusinessOrders() {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeTab, setActiveTab]         = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating]           = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      await api.put(`/orders/${orderId}`, { status: newStatus });
      await fetchOrders();
      setSelectedOrder(null);
      alert(`Order marked as ${newStatus}!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  const TABS = [
    { id: 'all',        label: 'All' },
    { id: 'pending',    label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped',    label: 'Shipped' },
    { id: 'delivered',  label: 'Delivered' },
    { id: 'cancelled',  label: 'Cancelled' },
  ];

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter((o) => o.status === activeTab);

  const stats = [
    { label: 'Pending',    value: orders.filter(o => o.status === 'pending').length,    Icon: Clock,       bg: 'bg-orange-100', text: 'text-orange-600' },
    { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, Icon: Package,     bg: 'bg-blue-100',   text: 'text-blue-600' },
    { label: 'Shipped',    value: orders.filter(o => o.status === 'shipped').length,    Icon: Truck,       bg: 'bg-purple-100', text: 'text-purple-600' },
    { label: 'Delivered',  value: orders.filter(o => o.status === 'delivered').length,  Icon: CheckCircle, bg: 'bg-green-100',  text: 'text-green-600' },
  ];

  return (
    <DashboardLayout menuItems={menuItems} userType="business">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
        <p className="text-gray-600">Track and manage your customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, Icon, bg, text }) => (
          <Card key={label}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${text}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const count = tab.id === 'all' ? orders.length : orders.filter(o => o.status === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
                <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs
                  ${activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Orders */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="text-center py-16">
          <ShoppingCart className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-500">
            {activeTab === 'all'
              ? 'No orders yet. Orders will appear here when customers purchase your products.'
              : `No ${activeTab} orders.`}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card
              key={order.id}
              hover
              className="cursor-pointer p-0 overflow-hidden"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Product image */}
                <div className="sm:w-28 h-28 flex-shrink-0 bg-gray-100">
                  {order.product_photo ? (
                    <img src={order.product_photo} alt={order.product_name}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <h3 className="font-bold text-gray-900">{order.product_name}</h3>
                        <p className="text-sm text-gray-500">Customer: {order.customer}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm mt-3">
                      <div><span className="text-gray-500">Qty:</span> <span className="font-medium">{order.quantity}</span></div>
                      <div><span className="text-gray-500">Total:</span> <span className="font-medium">₹{Number(order.total).toLocaleString()}</span></div>
                      <div><span className="text-gray-500">Date:</span> <span className="font-medium">{order.date}</span></div>
                    </div>
                    {order.delivery_address && (
                      <p className="text-xs text-gray-400 mt-2 truncate">📍 {order.delivery_address}</p>
                    )}
                  </div>
                  <div className="text-right sm:min-w-[100px]">
                    <p className="text-xs text-gray-500">Order #{order.id}</p>
                    <p className="text-sm text-primary-600 mt-1 font-medium">Tap to manage →</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Order #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
              <span className="text-sm text-gray-600 font-medium">Current Status</span>
              <StatusBadge status={selectedOrder.status} />
            </div>

            {/* Product */}
            <div className="flex gap-4 p-4 border border-gray-200 rounded-xl mb-4">
              {selectedOrder.product_photo ? (
                <img src={selectedOrder.product_photo} alt={selectedOrder.product_name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Package className="w-8 h-8 text-gray-300" />
                </div>
              )}
              <div>
                <p className="font-bold text-gray-900">{selectedOrder.product_name}</p>
                <p className="text-sm text-gray-500">Qty: {selectedOrder.quantity}</p>
                <p className="text-lg font-bold text-primary-600 mt-1">
                  ₹{Number(selectedOrder.total).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Customer */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-1">Customer</p>
                <p className="font-semibold text-gray-900">{selectedOrder.customer}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-1">Phone</p>
                <p className="font-semibold text-gray-900">{selectedOrder.customer_phone || 'N/A'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-1">Order Date</p>
                <p className="font-semibold text-gray-900">{selectedOrder.date}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-1">Unit Price</p>
                <p className="font-semibold text-gray-900">₹{Number(selectedOrder.unit_price).toLocaleString()}</p>
              </div>
            </div>

            {selectedOrder.delivery_address && (
              <div className="p-3 bg-gray-50 rounded-lg mb-4 text-sm">
                <p className="text-gray-500 mb-1">Delivery Address</p>
                <p className="font-medium text-gray-900">{selectedOrder.delivery_address}</p>
              </div>
            )}

            {selectedOrder.notes && (
              <div className="p-3 bg-gray-50 rounded-lg mb-4 text-sm">
                <p className="text-gray-500 mb-1">Notes</p>
                <p className="font-medium text-gray-900">{selectedOrder.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 flex-wrap">
              {selectedOrder.status === 'pending' && (
                <>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'processing')}
                    loading={updating}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Start Processing
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'cancelled')}
                    loading={updating}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
              {selectedOrder.status === 'processing' && (
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => handleStatusUpdate(selectedOrder.id, 'shipped')}
                  loading={updating}
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Mark as Shipped
                </Button>
              )}
              {selectedOrder.status === 'shipped' && (
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => handleStatusUpdate(selectedOrder.id, 'delivered')}
                  loading={updating}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Delivered
                </Button>
              )}
              {['delivered', 'cancelled'].includes(selectedOrder.status) && (
                <Button variant="outline" className="flex-1" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}