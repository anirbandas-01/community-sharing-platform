import { Home, Users, Briefcase, Store, MessageCircle, Settings, Shield, BarChart3 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Manage Users', path: '/admin/users', badge: '1,234' },
    { icon: Shield, label: 'Communities', path: '/admin/communities', badge: '45' },
    { icon: Briefcase, label: 'Professionals', path: '/admin/professionals', badge: '567' },
    { icon: Store, label: 'Businesses', path: '/admin/businesses', badge: '234' },
    { icon: MessageCircle, label: 'Support', path: '/admin/support', badge: '12' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const stats = [
    { label: 'Total Users', value: '2,035', change: '+156 this month', color: 'blue', icon: '👥' },
    { label: 'Active Communities', value: '45', change: '+5 new', color: 'green', icon: '🏘️' },
    { label: 'Total Revenue', value: '₹12.4L', change: '+22% growth', color: 'purple', icon: '💰' },
    { label: 'Support Tickets', value: '12', change: '8 pending', color: 'orange', icon: '🎫' },
  ];

  const recentActivities = [
    { type: 'user', action: 'New user registered', user: 'Sarah Wilson', time: '5 mins ago', color: 'blue' },
    { type: 'community', action: 'Community created', user: 'Sunrise Apartments', time: '1 hour ago', color: 'green' },
    { type: 'booking', action: 'New booking made', user: 'David Brown', time: '2 hours ago', color: 'purple' },
    { type: 'business', action: 'Business verified', user: 'Fresh Mart Store', time: '3 hours ago', color: 'orange' },
    { type: 'support', action: 'Support ticket opened', user: 'Lisa Anderson', time: '5 hours ago', color: 'red' },
  ];

  const userGrowth = [
    { month: 'Jan', users: 1200 },
    { month: 'Feb', users: 1450 },
    { month: 'Mar', users: 1750 },
    { month: 'Apr', users: 2035 },
  ];

  const pendingApprovals = [
    { type: 'Professional', name: 'John Smith - Electrician', submitted: '2 days ago', status: 'review' },
    { type: 'Business', name: 'Green Grocers', submitted: '1 day ago', status: 'review' },
    { type: 'Community', name: 'Tech Valley Residents', submitted: '3 hours ago', status: 'new' },
  ];

  const topCommunities = [
    { name: 'Sunrise Apartments', members: 234, growth: '+12%' },
    { name: 'Tech Valley', members: 189, growth: '+8%' },
    { name: 'Green Meadows', members: 156, growth: '+15%' },
    { name: 'Downtown Plaza', members: 142, growth: '+5%' },
  ];

  return (
    <DashboardLayout menuItems={menuItems} userType="admin">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard 🛡️
        </h1>
        <p className="text-gray-600">Manage and monitor the entire platform</p>
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
          {/* User Growth Chart */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">User Growth</h2>
              <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                <option>Last 4 Months</option>
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="flex items-end gap-6 h-56">
              {userGrowth.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-gray-700 to-gray-900 rounded-t-lg relative" style={{ height: `${(item.users / 2500) * 100}%` }}>
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-900">
                      {item.users}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 mt-2">{item.month}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activities */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-${activity.color}-100 flex items-center justify-center`}>
                    {activity.type === 'user' && <Users className={`w-5 h-5 text-${activity.color}-600`} />}
                    {activity.type === 'community' && <Shield className={`w-5 h-5 text-${activity.color}-600`} />}
                    {activity.type === 'booking' && <Briefcase className={`w-5 h-5 text-${activity.color}-600`} />}
                    {activity.type === 'business' && <Store className={`w-5 h-5 text-${activity.color}-600`} />}
                    {activity.type === 'support' && <MessageCircle className={`w-5 h-5 text-${activity.color}-600`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Communities */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Communities</h2>
            <div className="space-y-4">
              {topCommunities.map((community, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
                      #{idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{community.name}</h3>
                      <p className="text-sm text-gray-600">{community.members} members</p>
                    </div>
                  </div>
                  <Badge variant="success">{community.growth}</Badge>
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
                <Users className="w-5 h-5 mr-2" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-5 h-5 mr-2" />
                Create Community
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-5 h-5 mr-2" />
                Support Tickets
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
            </div>
          </Card>

          {/* Pending Approvals */}
          <Card className="border-2 border-orange-200 bg-orange-50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">!</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Pending Approvals</h2>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border border-orange-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge variant="info" size="sm" className="mb-1">{item.type}</Badge>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.submitted}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="primary" size="sm" className="flex-1">Approve</Button>
                    <Button variant="outline" size="sm" className="flex-1">Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Platform Health */}
          <Card className="bg-gradient-to-br from-gray-700 to-gray-900 text-white">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🚀</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Platform Health</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="opacity-90">Server Status</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="opacity-90">API Response</span>
                    <span className="font-medium">45ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="opacity-90">Uptime</span>
                    <span className="font-medium">99.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;