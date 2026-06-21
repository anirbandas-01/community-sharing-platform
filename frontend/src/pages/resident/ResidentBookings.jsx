import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Star, Filter, Search,
  MessageCircle, RefreshCw, CheckCircle, XCircle,
  AlertCircle, Home, Users, Briefcase, Settings, User as UserIcon, Store,ShoppingCart
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

const statusConfig = {
  pending:   { variant: 'warning',  icon: AlertCircle,   label: 'Pending' },
  confirmed: { variant: 'primary',  icon: CheckCircle,   label: 'Confirmed' },
  completed: { variant: 'success',  icon: CheckCircle,   label: 'Completed' },
  cancelled: { variant: 'danger',   icon: XCircle,       label: 'Cancelled' },
  rejected:  { variant: 'danger',   icon: XCircle,       label: 'Rejected' },
};

const ResidentBookings = () => {
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [activeTab, setActiveTab]     = useState('all');
  const [searchTerm, setSearchTerm]   = useState('');
  const [reviewModal, setReviewModal] = useState({ open: false, booking: null });
  const [reviewData, setReviewData]   = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home,        label: 'Dashboard',         path: '/resident/dashboard' },
    { icon: Users,       label: 'My Communities',    path: '/resident/communities' },
    { icon: Briefcase,   label: 'Find Professionals',path: '/resident/professionals' },
    { icon: Users,       label: 'Find Residents',    path: '/resident/find-residents' },
    { icon: Store, label: 'Shop', path: '/resident/shop' },
    { icon: ShoppingCart, label: 'My Orders', path: '/resident/my-orders' },
    { icon: Calendar,    label: 'My Bookings',       path: '/resident/bookings' },
    { icon: Star,        label: 'My Reviews',        path: '/resident/reviews' },
    { icon: MessageCircle, label: 'Messages',        path: '/resident/messages' },
    { icon: UserIcon,    label: 'Profile',           path: '/resident/profile' },
    { icon: Settings,    label: 'Settings',          path: '/resident/settings' },
  ];

  const tabs = [
    { id: 'all',       label: 'All Bookings' },
    { id: 'pending',   label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/user/bookings');
      setBookings(response.data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesTab    = activeTab === 'all' || b.status === activeTab;
    const matchesSearch = searchTerm === '' ||
      b.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.professional?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  /* ---------- actions ---------- */

  // FIX: Book Again now navigates to professional's detail page
  const handleBookAgain = (booking) => {
    if (booking.professional?.id) {
      navigate(`/resident/professionals/${booking.professional.id}`);
    } else {
      navigate('/resident/professionals');
    }
  };

  // FIX: Message button navigates to messages
  const handleMessage = async (booking) => {
    try {
      await api.post('/messages/start', { recipient_id: booking.professional?.id });
      navigate('/resident/messages');
    } catch {
      navigate('/resident/messages');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      setBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
      );
    } catch (err) {
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewModal.booking) return;
    try {
      setSubmittingReview(true);
      await api.post('/reviews', {
        review_type:     'professional',
        appointment_id:  reviewModal.booking.id,
        professional_id: reviewModal.booking.professional?.id,
        rating:          reviewData.rating,
        comment:         reviewData.comment,
      });
      setBookings(prev =>
        prev.map(b => b.id === reviewModal.booking.id ? { ...b, reviewed: true } : b)
      );
      setReviewModal({ open: false, booking: null });
      setReviewData({ rating: 5, comment: '' });
    } catch (err) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  /* ---------- stats ---------- */
  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Track and manage all your service bookings</p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-sm text-red-700">{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchBookings}>Retry</Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total',     value: stats.total,     color: 'blue' },
          { label: 'Pending',   value: stats.pending,   color: 'yellow' },
          { label: 'Confirmed', value: stats.confirmed, color: 'purple' },
          { label: 'Completed', value: stats.completed, color: 'green' },
        ].map((s) => (
          <Card key={s.label} className="text-center py-4">
            <p className={`text-3xl font-bold text-${s.color}-600 mb-1`}>{s.value}</p>
            <p className="text-sm text-gray-600">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all text-sm
                ${activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                }`}
            >
              {tab.label}
              {tab.id !== 'all' && stats[tab.id] > 0 && (
                <span className="ml-2 bg-white bg-opacity-20 text-inherit text-xs px-1.5 py-0.5 rounded-full">
                  {stats[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        <Input
          icon={Search}
          placeholder="Search by service or professional name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Booking list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'all' ? "You haven't made any bookings yet." : `No ${activeTab} bookings.`}
          </p>
          <Button variant="primary" onClick={() => navigate('/resident/professionals')}>
            Find a Professional
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const cfg = statusConfig[booking.status] || statusConfig.pending;
            const StatusIcon = cfg.icon;

            return (
              <Card key={booking.id} hover className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Professional info */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={booking.professional?.image || '/default-avatar.png'}
                      alt={booking.professional?.name}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{booking.service}</h3>
                          <p className="text-gray-600">
                            with <span className="font-medium">{booking.professional?.name}</span>
                          </p>
                        </div>
                        <Badge variant={cfg.variant} className="flex items-center gap-1 flex-shrink-0">
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />{booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />{booking.time}
                        </span>
                        {booking.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />{booking.location}
                          </span>
                        )}
                      </div>

                      {booking.notes && (
                        <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded p-2">{booking.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Price + actions */}
                  <div className="flex flex-col gap-2 lg:items-end lg:min-w-[160px]">
                    {booking.total_price && (
                      <p className="text-2xl font-bold text-primary-600">{booking.total_price}</p>
                    )}

                    {/* FIX: Book Again navigates to professional page */}
                    {(booking.status === 'completed' || booking.status === 'cancelled') && (
                      <Button variant="primary" size="sm" className="w-full lg:w-auto" onClick={() => handleBookAgain(booking)}>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Book Again
                      </Button>
                    )}

                    {/* Leave review for completed, unreviewed bookings */}
                    {booking.status === 'completed' && !booking.has_review && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full lg:w-auto"
                        onClick={() => setReviewModal({ open: true, booking })}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Leave Review
                      </Button>
                    )}

                    {booking.status === 'completed' && booking.has_review && (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Reviewed
                      </span>
                    )}

                    {/* Message professional */}
                    {['pending', 'confirmed'].includes(booking.status) && (
                      <Button variant="outline" size="sm" className="w-full lg:w-auto" onClick={() => handleMessage(booking)}>
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    )}

                    {/* Cancel */}
                    {['pending', 'confirmed'].includes(booking.status) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full lg:w-auto text-red-600 hover:bg-red-50"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Leave a Review</h2>
            <p className="text-gray-600 mb-6">
              How was your experience with{' '}
              <span className="font-medium">{reviewModal.booking?.professional?.name}</span>?
            </p>

            {/* Star rating */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= reviewData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Share your experience (optional)..."
              value={reviewData.comment}
              onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setReviewModal({ open: false, booking: null })}
                disabled={submittingReview}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSubmitReview}
                disabled={submittingReview}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ResidentBookings;