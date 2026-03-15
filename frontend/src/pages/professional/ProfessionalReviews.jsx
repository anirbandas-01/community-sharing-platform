import { useState, useEffect } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import { Home, Calendar, Briefcase, DollarSign, MessageCircle, User as UserIcon, Users, Settings } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ProfessionalReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState(null);
  const [response, setResponse] = useState('');

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/professional/dashboard' },
    { icon: Briefcase, label: 'My Services', path: '/professional/services' },
    { icon: Calendar, label: 'Bookings', path: '/professional/bookings' },
    { icon: DollarSign, label: 'Earnings', path: '/professional/earnings' },
    { icon: Star, label: 'Reviews', path: '/professional/reviews' },
    { icon: MessageCircle, label: 'Messages', path: '/professional/messages' },
    { icon: Users, label: 'Groups', path: '/professional/groups' },
    { icon: UserIcon, label: 'Profile', path: '/professional/profile' },
    { icon: Settings, label: 'Settings', path: '/professional/settings' },
  ];

  useEffect(() => {
    if (user?.id) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/professionals/${user.id}/reviews`);
      setReviews(response.data.reviews || []);
      setStats(response.data.stats || null);
    } catch (error) {
      console.error('Error fetching reviews:', error);
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
      await api.post(`/reviews/${reviewId}/respond`, {
        response: response.trim()
      });
      
      setRespondingTo(null);
      setResponse('');
      fetchReviews();
    } catch (error) {
      console.error('Error responding to review:', error);
      alert('Failed to submit response');
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} userType="professional">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600 mt-2">
          See what your clients are saying about you
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
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {stats.total_reviews}
              </div>
              <div className="text-sm text-gray-600 mt-3">Total Reviews</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-1">
                {stats.rating_breakdown?.[5] || 0}
              </div>
              <div className="text-sm text-gray-600 mt-3">5-Star Reviews</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-1">
                {stats.rating_breakdown?.[4] || 0}
              </div>
              <div className="text-sm text-gray-600 mt-3">4-Star Reviews</div>
            </div>
          </Card>
        </div>
      )}

      {/* Rating Breakdown */}
      {stats && (
        <Card className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.rating_breakdown?.[rating] || 0;
              const percentage = stats.total_reviews > 0 
                ? (count / stats.total_reviews) * 100 
                : 0;
              
              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-8">{rating} ⭐</span>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Card className="text-center py-12">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-600">
            You'll see reviews from your clients here once they start rating your services.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  {review.user?.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {review.user?.name || 'Anonymous'}
                    </h4>
                    <span className="text-sm text-gray-500">{review.created_at}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

                  {/* Existing Response */}
                  {review.professional_response ? (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-900">
                          Your Response
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{review.professional_response}</p>
                    </div>
                  ) : (
                    /* Response Form */
                    respondingTo === review.id ? (
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
                          <span className="text-sm text-gray-500">
                            {response.length}/500 characters
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setRespondingTo(null);
                                setResponse('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleRespond(review.id)}
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Send Response
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRespondingTo(review.id)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Respond to Review
                      </Button>
                    )
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