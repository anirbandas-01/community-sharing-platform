import { Home, Briefcase, Calendar, MessageCircle, Users, TrendingUp, Settings, User as UserIcon } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const ProfessionalDashboard = () => {
  const { user } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/professional/dashboard' },
    { icon: Calendar, label: 'My Bookings', path: '/professional/bookings', badge: '8' },
    { icon: Briefcase, label: 'My Services', path: '/professional/services' },
    { icon: Users, label: 'My Groups', path: '/professional/groups' },
    { icon: MessageCircle, label: 'Messages', path: '/professional/messages', badge: '12' },
    { icon: TrendingUp, label: 'Analytics', path: '/professional/analytics' },
    { icon: UserIcon, label: 'Profile', path: '/professional/profile' },
    { icon: Settings, label: 'Settings', path: '/professional/settings' },
  ];

  const stats = [
    { label: 'Total Earnings', value: '₹45,200', change: '+12% from last month', color: 'green', icon: '💰' },
    { label: 'Active Bookings', value: '8', change: '3 today', color: 'blue', icon: '📅' },
    { label: 'Completed Jobs', value: '156', change: '+24 this month', color: 'purple', icon: '✅' },
    { label: 'Rating', value: '4.8', change: '124 reviews', color: 'yellow', icon: '⭐' },
  ];

  const upcomingJobs = [
    { id: 1, client: 'Sarah Wilson', service: 'Plumbing Repair', date: '2026-03-08', time: '10:00 AM', location: 'Apartment 402', status: 'confirmed', payment: '₹1,200' },
    { id: 2, client: 'David Brown', service: 'Electrical Work', date: '2026-03-08', time: '2:30 PM', location: 'Villa 15', status: 'confirmed', payment: '₹1,800' },
    { id: 3, client: 'Lisa Anderson', service: 'AC Installation', date: '2026-03-09', time: '11:00 AM', location: 'House 23', status: 'pending', payment: '₹3,500' },
  ];

  const recentReviews = [
    { id: 1, client: 'John Doe', rating: 5, comment: 'Excellent work! Very professional and timely.', service: 'Plumbing', time: '2 days ago' },
    { id: 2, client: 'Jane Smith', rating: 5, comment: 'Great service, will definitely hire again!', service: 'Electrical', time: '5 days ago' },
    { id: 3, client: 'Mike Johnson', rating: 4, comment: 'Good work, but took longer than expected.', service: 'AC Repair', time: '1 week ago' },
  ];

  const earnings = [
    { month: 'Jan', amount: 35000 },
    { month: 'Feb', amount: 40000 },
    { month: 'Mar', amount: 45200 },
  ];

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
              <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
              <Button variant="ghost" size="sm">View Calendar</Button>
            </div>
            <div className="space-y-4">
              {upcomingJobs.map((job) => (
                <div key={job.id} className="p-5 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                        {job.client.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{job.service}</h3>
                        <p className="text-sm text-gray-600">Client: {job.client}</p>
                        <p className="text-xs text-gray-500 mt-1">📍 {job.location}</p>
                      </div>
                    </div>
                    <Badge variant={job.status === 'confirmed' ? 'success' : 'warning'}>
                      {job.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>🕐 {job.time}</span>
                      <span>💵 {job.payment}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Details</Button>
                      <Button variant="primary" size="sm">Start Job</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Earnings Chart */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Earnings Overview</h2>
              <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="flex items-end gap-4 h-48">
              {earnings.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg relative" style={{ height: `${(item.amount / 50000) * 100}%` }}>
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-900">
                      ₹{(item.amount / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 mt-2">{item.month}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-start">
                <Calendar className="w-5 h-5 mr-2" />
                View Bookings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="w-5 h-5 mr-2" />
                Manage Services
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-5 h-5 mr-2" />
                Messages
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
            </div>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Reviews</h2>
              <Badge variant="success">4.8 ⭐</Badge>
            </div>
            <div className="space-y-4">
              {recentReviews.map((review) => (
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
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{review.service}</span>
                    <span className="text-xs text-gray-400">{review.time}</span>
                  </div>
                </div>
              ))}
            </div>
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