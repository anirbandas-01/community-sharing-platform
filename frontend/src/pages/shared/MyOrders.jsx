import { useState, useEffect } from 'react';
import {
  ShoppingBag, Package, Clock, CheckCircle, XCircle,
  Truck, AlertCircle, X,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';

// ─── Status helpers ───────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:    { color: 'warning', Icon: Clock,        label: 'Pending' },
  processing: { color: 'info',    Icon: Package,      label: 'Processing' },
  shipped:    { color: 'primary', Icon: Truck,        label: 'Shipped' },
  delivered:  { color: 'success', Icon: CheckCircle,  label: 'Delivered' },
  cancelled:  { color: 'danger',  Icon: XCircle,      label: 'Cancelled' },
};

function StatusBadge({ status }) {
  const { color, Icon, label } = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <Badge variant={color}>
      <div className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        <span>{label}</span>
      </div>
    </Badge>
  );
}

// ─── Cancel Confirm Modal ─────────────────────────────────────────────────────
function CancelModal({ order, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Cancel Order?</h3>
        </div>
        <p className="text-gray-600 mb-2 text-sm">
          Are you sure you want to cancel your order for{' '}
          <span className="font-semibold text-gray-900">{order.product_name}</span>?
        </p>
        <p className="text-xs text-gray-400 mb-6">
          Stock will be restored. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            Keep Order
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} loading={loading}>
            Yes, Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MyOrders — shared for resident & professional
// ═══════════════════════════════════════════════════════════════════════════════
export default function MyOrders({ menuItems, userType, DashboardLayout: Layout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/store/my-orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      setCancelling(true);
      await api.post(`/store/orders/${cancelTarget.id}/cancel`);
      setCancelTarget(null);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  // ── Tab filtering ───────────────────────────────────────────────────────────
  const TABS = [
    { id: 'all',        label: 'All Orders' },
    { id: 'pending',    label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped',    label: 'Shipped' },
    { id: 'delivered',  label: 'Delivered' },
    { id: 'cancelled',  label: 'Cancelled' },
  ];

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter((o) => o.status === activeTab);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const totalSpent = orders
    .filter((o) => ['delivered', 'shipped', 'processing'].includes(o.status))
    .reduce((sum, o) => sum + Number(o.total_price), 0);

  return (
    <Layout menuItems={menuItems} userType={userType}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track all your product orders</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders',  value: orders.length,                                         color: 'bg-blue-100 text-blue-600' },
          { label: 'Pending',       value: orders.filter(o => o.status === 'pending').length,     color: 'bg-yellow-100 text-yellow-600' },
          { label: 'Delivered',     value: orders.filter(o => o.status === 'delivered').length,   color: 'bg-green-100 text-green-600' },
          { label: 'Total Spent',   value: `₹${totalSpent.toLocaleString()}`,                    color: 'bg-purple-100 text-purple-600' },
        ].map((s, i) => (
          <Card key={i}>
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <ShoppingBag className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const count = tab.id === 'all'
              ? orders.length
              : orders.filter(o => o.status === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
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

      {/* Orders list */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="text-center py-16">
          <ShoppingBag className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-500">
            {activeTab === 'all'
              ? "You haven't placed any orders yet."
              : `No ${activeTab} orders.`}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} hover className="p-0 overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Product image */}
                <div className="sm:w-32 h-32 flex-shrink-0 bg-gray-100">
                  {order.product_photo ? (
                    <img
                      src={order.product_photo}
                      alt={order.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">
                          {order.product_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          from {order.business_name}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mt-3">
                      <div>
                        <span className="text-gray-500">Qty:</span>
                        <span className="ml-1 font-medium text-gray-900">{order.quantity}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Unit price:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          ₹{Number(order.unit_price).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Order date:</span>
                        <span className="ml-1 font-medium text-gray-900">{order.date}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Order #:</span>
                        <span className="ml-1 font-medium text-gray-900">#{order.id}</span>
                      </div>
                    </div>

                    {order.notes && (
                      <p className="mt-2 text-xs text-gray-500 italic">Note: {order.notes}</p>
                    )}
                  </div>

                  {/* Right: total + action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-3 sm:min-w-[120px]">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{Number(order.total_price).toLocaleString()}
                      </p>
                    </div>
                    {order.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 border border-red-200"
                        onClick={() => setCancelTarget(order)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {cancelTarget && (
        <CancelModal
          order={cancelTarget}
          onConfirm={handleCancel}
          onClose={() => setCancelTarget(null)}
          loading={cancelling}
        />
      )}
    </Layout>
  );
}