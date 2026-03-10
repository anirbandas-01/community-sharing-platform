import { Home, Users, Briefcase, MessageCircle, Calendar, Settings, User as UserIcon } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const ResidentDashboard = () => {
  const { user } = useAuth();

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

  const upcomingBookings = [
    { id: 1, service: 'House Cleaning', professional: 'Jane Doe', date: '2026-03-10', time: '10:00 AM', status: 'confirmed' },
    { id: 2, service: 'Plumbing Repair', professional: 'John Smith', date: '2026-03-12', time: '2:00 PM', status: 'pending' },
    { id: 3, service: 'AC Servicing', professional: 'Mike Johnson', date: '2026-03-15', time: '11:00 AM', status: 'confirmed' },
  ];

  const recentActivity = [
    { action: 'Joined Community', detail: 'Sunrise Apartments', time: '2 hours ago', icon: Users, color: 'blue' },
    { action: 'Booked Service', detail: 'House Cleaning with Jane', time: '1 day ago', icon: Calendar, color: 'green' },
    { action: 'New Message', detail: 'From Mike Johnson', time: '2 days ago', icon: MessageCircle, color: 'purple' },
  ];

  const featuredProfessionals = [
    { id: 1, name: 'Sarah Wilson', profession: 'Electrician', rating: 4.8, reviews: 124, price: '₹500/hr', image: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'David Brown', profession: 'Carpenter', rating: 4.9, reviews: 98, price: '₹600/hr', image: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Lisa Anderson', profession: 'Painter', rating: 4.7, reviews: 156, price: '₹450/hr', image: 'https://i.pravatar.cc/150?img=3' },
  ];

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
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {booking.date.split('-')[2]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                    <p className="text-sm text-gray-600">with {booking.professional}</p>
                    <p className="text-xs text-gray-500 mt-1">{booking.date} at {booking.time}</p>
                  </div>
                  <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'}>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Featured Professionals */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Featured Professionals</h2>
              <Button variant="ghost" size="sm">Browse All</Button>
            </div>
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
                      <span className="text-xs text-gray-500">({pro.reviews})</span>
                    </div>
                    <span className="text-sm font-semibold text-primary-600">{pro.price}</span>
                  </div>
                  <Button variant="primary" size="sm" className="w-full mt-3">Book Now</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-start">
                <Briefcase className="w-5 h-5 mr-2" />
                Find Professional
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chat
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-5 h-5 mr-2" />
                View Calendar
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-${activity.color}-100 flex items-center justify-center`}>
                    <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.detail}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
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