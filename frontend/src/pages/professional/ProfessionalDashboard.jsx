import { useState, useEffect } from 'react';
import { Home, Briefcase, Calendar, MessageCircle, Users, TrendingUp, Settings, User as UserIcon } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ProfessionalDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/professional/dashboard' },
    { icon: Calendar, label: 'My Bookings', path: '/professional/bookings' },
    { icon: Briefcase, label: 'My Services', path: '/professional/services' },
    { icon: Users, label: 'My Groups', path: '/professional/groups' },
    { icon: MessageCircle, label: 'Messages', path: '/professional/messages' },
    { icon: TrendingUp, label: 'Analytics', path: '/professional/analytics' },
    { icon: UserIcon, label: 'Profile', path: '/professional/profile' },
    { icon: Settings, label: 'Settings', path: '/professional/settings' },
  ];

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/professional/dashboard');
      setDashboard(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout menuItems={menuItems} userType="professional">
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
      <DashboardLayout menuItems={menuItems} userType="professional">
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
      label: 'Total Earnings', 
      value: `₹${dashboard.earnings?.total?.toLocaleString() || 0}`, 
      change: `Available: ₹${dashboard.earnings?.available || 0}`, 
      color: 'green', 
      icon: '💰' 
    },
    { 
      label: 'Active Bookings', 
      value: dashboard.appointments?.upcoming || 0, 
      change: `${dashboard.stats?.pending_appointments || 0} pending`, 
      color: 'blue', 
      icon: '📅' 
    },
    { 
      label: 'Completed Jobs', 
      value: dashboard.stats?.total_appointments || 0, 
      change: `${dashboard.stats?.active_services || 0} active services`, 
      color: 'purple', 
      icon: '✅' 
    },
    { 
      label: 'Rating', 
      value: dashboard.rating?.average || '0.0', 
      change: `${dashboard.rating?.total || 0} reviews`, 
      color: 'yellow', 
      icon: '⭐' 
    },
  ];

  const upcomingJobs = dashboard.appointments?.data || [];
  const recentReviews = dashboard.reviews || [];

  return (
    <DashboardLayout menuItems={menuItems} userType="professional">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Professional'}! 💼
        </h1>
        <p className="text-gray-600">Manage your bookings and grow your business</p>
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
          {/* Upcoming Jobs */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Schedule</h2>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/professional/bookings'}>
                View All
              </Button>
            </div>
            {upcomingJobs.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No upcoming bookings</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="p-5 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                          {job.client_name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{job.service_name || 'Service'}</h3>
                          <p className="text-sm text-gray-600">Client: {job.client_name || 'Client'}</p>
                          <p className="text-xs text-gray-500 mt-1">📍 {job.location || 'Location TBD'}</p>
                        </div>
                      </div>
                      <Badge variant={job.status === 'confirmed' ? 'success' : 'warning'}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>🕐 {new Date(job.appointment_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>💵 ₹{job.total_price}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.location.href = '/professional/bookings'}>Details</Button>
                        {job.status === 'pending' && (
                          <Button variant="primary" size="sm">Confirm</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Earnings Chart */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Earnings Overview</h2>
              <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                <option>This Month</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Total Earnings</p>
                <p className="text-4xl font-bold text-gray-900 mb-4">
                  ₹{dashboard.earnings?.total?.toLocaleString() || 0}
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Available</p>
                    <p className="text-lg font-bold text-green-600">₹{dashboard.earnings?.available || 0}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Pending</p>
                    <p className="text-lg font-bold text-orange-600">₹{dashboard.earnings?.pending || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-start" onClick={() => window.location.href = '/professional/bookings'}>
                <Calendar className="w-5 h-5 mr-2" />
                View Bookings
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/professional/services'}>
                <Briefcase className="w-5 h-5 mr-2" />
                Manage Services
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/professional/messages'}>
                <MessageCircle className="w-5 h-5 mr-2" />
                Messages
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/professional/profile'}>
                <UserIcon className="w-5 h-5 mr-2" />
                Edit Profile
              </Button>
            </div>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Reviews</h2>
              <Badge variant="success">{dashboard.rating?.average || '0.0'} ⭐</Badge>
            </div>
            {recentReviews.length === 0 ? (
              <div className="text-center py-8">
                <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{review.client}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{review.comment}</p>
                    <span className="text-xs text-gray-400">{review.time}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Performance Tip */}
          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💡</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                <p className="text-sm opacity-90">
                  Respond to bookings within 1 hour to increase your rating and get more clients!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfessionalDashboard;