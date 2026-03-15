import { useState, useEffect } from 'react'; // ← ADD THIS
import { Home, Users, Briefcase, MessageCircle, Calendar, Settings, User as UserIcon } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api'; // ← ADD THIS

const ResidentDashboard = () => {
  const { user } = useAuth();
  
  // ← ADD THESE STATE VARIABLES
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [featuredProfessionals, setFeaturedProfessionals] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/resident/dashboard' },
    { icon: Users, label: 'My Communities', path: '/resident/communities' },
    { icon: Briefcase, label: 'Find Professionals', path: '/resident/professionals' },
    { icon: Calendar, label: 'My Bookings', path: '/resident/bookings' },
    { icon: MessageCircle, label: 'Messages', path: '/resident/messages' },
    { icon: UserIcon, label: 'Profile', path: '/resident/profile' },
    { icon: Settings, label: 'Settings', path: '/resident/settings' },
  ];

  const stats = [
    { label: 'Active Communities', value: '3', change: '+2 this month', color: 'primary' },
    { label: 'Total Bookings', value: '12', change: '4 pending', color: 'secondary' },
    { label: 'Messages', value: '28', change: '5 unread', color: 'success' },
    { label: 'Saved Services', value: '8', change: '2 new', color: 'warning' },
  ];

  // ← FETCH BOOKINGS
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/user/bookings');
        const upcoming = (response.data.bookings || [])
          .filter(b => ['pending', 'confirmed'].includes(b.status))
          .slice(0, 3);
        setUpcomingBookings(upcoming);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    
    fetchBookings();
  }, []);

  // ← FETCH PROFESSIONALS
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await api.get('/professionals');
        setFeaturedProfessionals((response.data.professionals || []).slice(0, 3));
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchProfessionals();
  }, []);

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Resident'}! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening in your community today</p>
      </div>

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
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Bookings */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Bookings</h2>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/resident/bookings'}>
                View All
              </Button>
            </div>
            
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No upcoming bookings</p>
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
            
            {featuredProfessionals.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No professionals available</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {featuredProfessionals.map((pro) => (
                  <div key={pro.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-start gap-3 mb-3">
                      <img src={pro.image} alt={pro.name} className="w-12 h-12 rounded-full object-cover" />
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
                        <span className="text-sm font-medium text-gray-900">{pro.rating}</span>
                        <span className="text-xs text-gray-500">({pro.total_reviews || pro.reviews_count || 0})</span>
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

        {/* Right Column - 1/3 width */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-start" onClick={() => window.location.href = '/resident/professionals'}>
                <Briefcase className="w-5 h-5 mr-2" />
                Find Professional
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
                View Calendar
              </Button>
            </div>
          </Card>

          {/* Community Highlights */}
          <Card className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
            <h3 className="font-bold text-lg mb-2">🎉 Community Event</h3>
            <p className="text-sm opacity-90 mb-4">
              Join us for the Spring Community Meetup this Saturday at 5 PM!
            </p>
            <Button variant="secondary" size="sm" className="bg-white text-primary-600 hover:bg-gray-100">
              RSVP Now
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResidentDashboard;