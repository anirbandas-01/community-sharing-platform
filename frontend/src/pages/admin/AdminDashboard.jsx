import { useState, useEffect } from 'react';
import { Home, Users, Building2, FileText, Settings, TrendingUp, UserCheck, AlertCircle, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Building2, label: 'Communities', path: '/admin/communities' },
     { icon: ShieldCheck, label: 'Verifications', path: '/admin/verifications' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard');
      setDashboard(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout menuItems={menuItems} userType="admin">
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
      <DashboardLayout menuItems={menuItems} userType="admin">
        <Card className="text-center py-12">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h3>
          <p className="text-gray-600 mb-6">Please try again</p>
          <Button variant="primary" onClick={fetchDashboard}>Retry</Button>
        </Card>
      </DashboardLayout>
    );
  }

  
  const stats_data = dashboard.stats || {};
  const recentUsers = dashboard.recent_users || [];
  const activityData = dashboard.user_growth || [];

  const stats = [
    {
      label: 'Total Users',
      value: stats_data.total_users ?? 0,
      change: stats_data.new_users_today ? `+${stats_data.new_users_today} today` : '',
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Active Communities',
      value: stats_data.active_communities ?? 0,
      change: '',
      icon: Building2,
      color: 'green',
    },
    {
      label: 'Professionals',
      value: stats_data.professionals ?? 0,
      change: '',
      icon: UserCheck,
      color: 'purple',
    },
    {
      label: 'Businesses',
      value: stats_data.businesses ?? 0,
      change: '',
      icon: Building2,
      color: 'orange',
    },
  ];

  // Pending communities: communities with status === 'pending' from a separate API if needed
  // For now we show the pending_verifications count from stats
  const pendingVerifications = stats_data.pending_verifications ?? 0;
  const systemAlerts = [];

  const getUserTypeColor = (type) => {
    const colors = {
      resident: 'default',
      professional: 'primary',
      business: 'warning',
      admin: 'danger',
    };
    return colors[type] || 'default';
  };

  return (
    <DashboardLayout menuItems={menuItems} userType="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'Admin'}! 👋
        </h1>
        <p className="text-gray-600">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} hover className="relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-20 h-20 bg-${stat.color}-100 rounded-full -mr-10 -mt-10 opacity-50`}></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                {stat.change ? <p className="text-xs text-gray-500">{stat.change}</p> : null}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Recent Users + User Growth */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/admin/users'}>View All</Button>
            </div>
            {recentUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No recent users</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{u.name}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{u.email}</td>
                        <td className="px-4 py-4">
                          <Badge variant={getUserTypeColor(u.user_type)} size="sm" className="capitalize">{u.user_type}</Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{u.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* User Growth Chart (last 7 days) */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Activity (Last 7 Days)</h2>
            {activityData.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No activity data</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activityData.map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 font-medium">{day.date}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${Math.min((day.count / (Math.max(...activityData.map(d => d.count)) || 1)) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-6 text-right">{day.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Quick Actions + Pending Verifications */}
        <div className="space-y-8">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-start" onClick={() => window.location.href = '/admin/users'}>
                <Users className="w-5 h-5 mr-2" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/admin/communities'}>
                <Building2 className="w-5 h-5 mr-2" />
                Manage Communities
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/admin/reports'}>
                <FileText className="w-5 h-5 mr-2" />
                View Reports
              </Button>
            </div>
          </Card>

          {pendingVerifications > 0 && (
            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Pending Approvals</h2>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                {pendingVerifications} {pendingVerifications === 1 ? 'community needs' : 'communities need'} review.
              </p>
              <Button variant="warning" size="sm" className="w-full" onClick={() => window.location.href = '/admin/verifications'}>
                Review All
              </Button>
            </Card>
          )}

          {/* Platform Summary */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Communities</span>
                <span className="font-semibold text-gray-900">{stats_data.total_communities ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Services</span>
                <span className="font-semibold text-gray-900">{stats_data.total_services ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Appointments</span>
                <span className="font-semibold text-gray-900">{stats_data.total_appointments ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Users This Week</span>
                <span className="font-semibold text-green-600">+{stats_data.new_users_week ?? 0}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;