import { useState, useEffect } from 'react';
import { Home, Users, Building2, FileText, Settings, TrendingUp, UserCheck, AlertCircle } from 'lucide-react';
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

  const stats = [
    { label: 'Total Users', value: dashboard.users?.total || 0, change: dashboard.users?.new_today ? `+${dashboard.users.new_today} today` : '', icon: Users, color: 'blue' },
    { label: 'Active Communities', value: dashboard.communities?.active || 0, change: dashboard.communities?.pending ? `${dashboard.communities.pending} pending` : '', icon: Building2, color: 'green' },
    { label: 'Professionals', value: dashboard.professionals?.total || 0, change: dashboard.professionals?.verified ? `${dashboard.professionals.verified} verified` : '', icon: UserCheck, color: 'purple' },
    { label: 'Businesses', value: dashboard.businesses?.total || 0, change: dashboard.businesses?.active ? `${dashboard.businesses.active} active` : '', icon: Building2, color: 'orange' },
  ];

  const recentUsers = dashboard.users?.recent || [];
  const pendingCommunities = dashboard.communities?.pending_list || [];
  const systemAlerts = dashboard.alerts || [];

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
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
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
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-4 py-4">
                          <Badge variant={getUserTypeColor(user.user_type)} size="sm" className="capitalize">{user.user_type}</Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{user.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Activity</h2>
            <div className="space-y-4">
              {dashboard.activity?.length > 0 ? (
                dashboard.activity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No recent activity</p>
                </div>
              )}
            </div>
          </Card>
        </div>

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

          {pendingCommunities.length > 0 && (
            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Pending Approvals</h2>
              </div>
              <div className="space-y-3">
                {pendingCommunities.map((community, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{community.name}</span>
                      <Badge variant="warning" size="sm">Pending</Badge>
                    </div>
                    <div className="text-xs text-gray-600">Created: {community.created_at}</div>
                  </div>
                ))}
              </div>
              <Button variant="warning" size="sm" className="w-full mt-4" onClick={() => window.location.href = '/admin/communities'}>
                Review All
              </Button>
            </Card>
          )}

          {systemAlerts.length > 0 && (
            <Card className="border-2 border-red-200 bg-red-50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">System Alerts</h2>
              </div>
              <div className="space-y-2">
                {systemAlerts.map((alert, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-red-200">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;