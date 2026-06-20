// frontend/src/pages/business/BusinessReviews.jsx
import { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, Package, Store } from 'lucide-react';
import {
  Home, ShoppingCart, TrendingUp, MessageCircle, BarChart3,
  Settings, User as UserIcon,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';

const menuItems = [
  { icon: Home,          label: 'Dashboard', path: '/business/dashboard' },
  { icon: Package,       label: 'Inventory',  path: '/business/inventory' },
  { icon: ShoppingCart,  label: 'Orders',     path: '/business/orders' },
  { icon: TrendingUp,    label: 'Sales',      path: '/business/sales' },
  { icon: Star,          label: 'Reviews',    path: '/business/reviews' },
  { icon: MessageCircle, label: 'Messages',   path: '/business/messages' },
  { icon: BarChart3,     label: 'Analytics',  path: '/business/analytics' },
  { icon: UserIcon,      label: 'Profile',    path: '/business/profile' },
  { icon: Settings,      label: 'Settings',   path: '/business/settings' },
];

export default function BusinessReviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [counts, setCounts] = useState({ product: 0, store: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | product | store
  const [respondingTo, setRespondingTo] = useState(null);
  const [response, setResponse] = useState('');

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/business/reviews');
      setReviews(res.data.reviews || []);
      setStats(res.data.stats || null);
      setCounts({
        product: res.data.product_count || 0,
        store: res.data.store_count || 0,
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (reviewId) => {
    if (!response.trim() || response.trim().length < 10) {
      alert('Response must be at least 10 characters long');
      return;
    }
    try {
      await api.post(`/reviews/${reviewId}/respond`, { response: response.trim() });
      setRespondingTo(null);
      setResponse('');
      fetchReviews();
    } catch (error) {
      console.error('Error responding to review:', error);
      alert(error.response?.data?.message || 'Failed to submit response');
    }
  };

  const filteredReviews = filter === 'all'
    ? reviews
    : reviews.filter((r) => r.review_type === filter);

  return (
    <DashboardLayout menuItems={menuItems} userType="business">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600 mt-2">
          Feedback from customers on your products and store
        </p>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {stats.average_rating?.toFixed(1) || '0.0'}
              </div>
              <div className="flex items-center justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(stats.average_rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">{stats.total_reviews}</div>
              <div className="text-sm text-gray-600 mt-3">Total Reviews</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-1">{counts.product}</div>
              <div className="text-sm text-gray-600 mt-3">Product Reviews</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-1">{counts.store}</div>
              <div className="text-sm text-gray-600 mt-3">Store Reviews</div>
            </div>
          </Card>
        </div>
      )}

      {/* Filter tabs */}
      <div className="mb-6 flex gap-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'product', label: 'Product Reviews' },
          { id: 'store', label: 'Store Reviews' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${filter === f.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <Card className="text-center py-12">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
          <p className="text-gray-600">
            Reviews from customers about your products and store will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  {review.user?.avatar ? (
                    <img src={review.user.avatar} alt={review.user.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <UserIcon className="w-6 h-6 text-blue-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                      {review.review_type === 'product' ? (
                        <Badge variant="info" size="sm">
                          <Package className="w-3 h-3 mr-1 inline" />
                          {review.product?.name || 'Product'}
                        </Badge>
                      ) : (
                        <Badge variant="primary" size="sm">
                          <Store className="w-3 h-3 mr-1 inline" />
                          Store Review
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

                  {review.professional_response ? (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-900">Your Response</span>
                      </div>
                      <p className="text-sm text-gray-700">{review.professional_response}</p>
                    </div>
                  ) : respondingTo === review.id ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                        placeholder="Write your response... (minimum 10 characters)"
                        maxLength={500}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{response.length}/500 characters</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setRespondingTo(null); setResponse(''); }}>
                            Cancel
                          </Button>
                          <Button variant="primary" size="sm" onClick={() => handleRespond(review.id)}>
                            <Send className="w-4 h-4 mr-2" />
                            Send Response
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setRespondingTo(review.id)}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Respond to Review
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}