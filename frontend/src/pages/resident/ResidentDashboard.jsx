import { useState, useEffect } from 'react';
import { Home, Users, Briefcase, MessageCircle, Calendar, Settings, User as UserIcon, Star } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ResidentDashboard = () => {
  const { user } = useAuth();

  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [featuredProfessionals, setFeaturedProfessionals] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingProfessionals, setLoadingProfessionals] = useState(true);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [error, setError] = useState(null);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/resident/dashboard' },
    { icon: Users, label: 'My Communities', path: '/resident/communities' },
    { icon: Briefcase, label: 'Find Professionals', path: '/resident/professionals' },
    { icon: Users, label: 'Find Residents', path: '/resident/find-residents' },
    { icon: Calendar, label: 'My Bookings', path: '/resident/bookings' },
    { icon: Star, label: 'My Reviews', path: '/resident/reviews' },
    { icon: MessageCircle, label: 'Messages', path: '/resident/messages' },
    { icon: UserIcon, label: 'Profile', path: '/resident/profile' },
    { icon: Settings, label: 'Settings', path: '/resident/settings' },
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        const response = await api.get('/user/bookings');
        const bookings = response.data.bookings || [];
        setAllBookings(bookings);
        setUpcomingBookings(
          bookings
            .filter(b => ['pending', 'confirmed'].includes(b.status))
            .slice(0, 3)
        );
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load some data. Please refresh.');
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoadingProfessionals(true);
        const response = await api.get('/professionals');
        setFeaturedProfessionals((response.data.professionals || []).slice(0, 3));
      } catch (error) {
        console.error('Error fetching professionals:', error);
      } finally {
        setLoadingProfessionals(false);
      }
    };
    fetchProfessionals();
  }, []);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoadingCommunities(true);
        const response = await api.get('/user/communities');
        setMyCommunities(response.data.communities || []);
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setLoadingCommunities(false);
      }
    };
    fetchCommunities();
  }, []);

  const pendingBookings = allBookings.filter(b => b.status === 'pending').length;
  const stats = [
    {
      label: 'Active Communities',
      value: loadingCommunities ? '—' : myCommunities.length,
      change: loadingCommunities ? '' : `${myCommunities.length} joined`,
      color: 'primary',
    },
    {
      label: 'Total Bookings',
      value: loadingBookings ? '—' : allBookings.length,
      change: loadingBookings ? '' : `${pendingBookings} pending`,
      color: 'secondary',
    },
    {
      label: 'Upcoming',
      value: loadingBookings ? '—' : upcomingBookings.length,
      change: loadingBookings ? '' : upcomingBookings.length === 0 ? 'None scheduled' : 'Scheduled',
      color: 'success',
    },
    {
      label: 'Completed',
      value: loadingBookings ? '—' : allBookings.filter(b => b.status === 'completed').length,
      change: '',
      color: 'warning',
    },
  ];

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Resident'}! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening in your community today</p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-sm text-red-700">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx} hover className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-50 rounded-full -mr-16 -mt-16 opacity-50`}></div>
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
          {/* Upcoming Bookings */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Bookings</h2>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/resident/bookings'}>
                View All
              </Button>
            </div>

            {loadingBookings ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No upcoming bookings</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => window.location.href = '/resident/professionals'}
                >
                  Find a Professional
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {booking.date?.split(' ')[1] || '?'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{booking.service || 'Service'}</h3>
                      <p className="text-sm text-gray-600">with {booking.professional?.name || 'Professional'}</p>
                      <p className="text-xs text-gray-500 mt-1">{booking.date} at {booking.time}</p>
                    </div>
                    <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'}>
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Featured Professionals */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Featured Professionals</h2>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/resident/professionals'}>
                Browse All
              </Button>
            </div>

            {loadingProfessionals ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              </div>
            ) : featuredProfessionals.length === 0 ? (
              <div className="text-center py-8">
                {/* FIX: Briefcase now properly imported */}
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No professionals available</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {featuredProfessionals.map((pro) => (
                  <div
                    key={pro.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={pro.image}
                        alt={pro.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{pro.name}</h3>
                        <p className="text-sm text-gray-600">{pro.profession}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">{pro.rating ?? 'New'}</span>
                        {pro.rating && (
                          <span className="text-xs text-gray-500">
                            ({pro.total_reviews || pro.reviews_count || 0})
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-primary-600">{pro.price}</span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => window.location.href = `/resident/professionals/${pro.id}`}
                    >
                      Book Now
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-start" onClick={() => window.location.href = '/resident/professionals'}>
                <Briefcase className="w-5 h-5 mr-2" />
                Find Professional
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/resident/find-residents'}>
                <Users className="w-5 h-5 mr-2" />
                Find Residents
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/resident/communities'}>
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/resident/messages'}>
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chat
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/resident/bookings'}>
                <Calendar className="w-5 h-5 mr-2" />
                View Bookings
              </Button>
            </div>
          </Card>

          {/* My Communities summary */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Communities</h2>
            {loadingCommunities ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-6 h-6 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              </div>
            ) : myCommunities.length === 0 ? (
              <div className="text-center py-6">
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-3">No communities joined yet</p>
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/resident/communities'}>
                  Browse Communities
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myCommunities.slice(0, 3).map((community) => (
                  <div key={community.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {community.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{community.name}</p>
                      <p className="text-xs text-gray-500">{community.member_count} members</p>
                    </div>
                  </div>
                ))}
                {myCommunities.length > 3 && (
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => window.location.href = '/resident/communities'}>
                    View all {myCommunities.length} communities
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResidentDashboard;