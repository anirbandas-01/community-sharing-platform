import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, TrendingUp, Users, Building2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { Home, Settings } from 'lucide-react';

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Building2, label: 'Communities', path: '/admin/communities' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  useEffect(() => {
    fetchReports();
  }, [period]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/reports?period=${period}`);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (reportType) => {
    alert(`Exporting ${reportType} report... Feature coming soon!`);
  };

  if (loading) {
    return (
      <DashboardLayout menuItems={menuItems} userType="admin">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!reports) {
    return (
      <DashboardLayout menuItems={menuItems} userType="admin">
        <Card className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Report Data</h3>
          <p className="text-gray-600 mb-6">Unable to load reports</p>
          <Button variant="primary" onClick={fetchReports}>Retry</Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems} userType="admin">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Reports</h1>
          <p className="text-gray-600">View analytics and generate reports</p>
        </div>
        <Button variant="outline" onClick={() => handleExport('comprehensive')}>
          <Download className="w-5 h-5 mr-2" />
          Export All
        </Button>
      </div>

      <div className="mb-6 flex gap-2">
        {['week', 'month', 'year'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize
              ${period === p ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            This {p}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">New Users</p>
              <p className="text-2xl font-bold text-gray-900">{reports.users?.new || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">New Communities</p>
              <p className="text-2xl font-bold text-gray-900">{reports.communities?.new || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-green-600">+{reports.growth?.rate || 0}%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">User Growth</h2>
            <Button variant="ghost" size="sm" onClick={() => handleExport('users')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          {reports.users?.daily?.length > 0 ? (
            <div className="space-y-3">
              {reports.users.daily.map((day, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{day.date}</p>
                    <p className="text-sm text-gray-600">{day.type_breakdown || 'All types'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{day.count}</p>
                    <p className="text-xs text-green-600">+{day.growth}%</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No user growth data for this period</p>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Community Activity</h2>
            <Button variant="ghost" size="sm" onClick={() => handleExport('communities')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          {reports.communities?.stats?.length > 0 ? (
            <div className="space-y-3">
              {reports.communities.stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{stat.name}</p>
                    <p className="text-sm text-gray-600">{stat.members} members</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{stat.posts} posts</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No community activity data</p>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Professional Stats</h2>
            <Button variant="ghost" size="sm" onClick={() => handleExport('professionals')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Professionals</p>
                <p className="text-2xl font-bold text-gray-900">{reports.professionals?.total || 0}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{reports.professionals?.bookings || 0}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Services Listed</p>
                <p className="text-2xl font-bold text-gray-900">{reports.professionals?.services || 0}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{reports.professionals?.avg_rating || '0.0'} ⭐</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Business Stats</h2>
            <Button variant="ghost" size="sm" onClick={() => handleExport('businesses')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Businesses</p>
                <p className="text-2xl font-bold text-gray-900">{reports.businesses?.total || 0}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{reports.businesses?.products || 0}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{reports.businesses?.orders || 0}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{(reports.businesses?.revenue || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Available Reports</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 'users', name: 'User Report', desc: 'Detailed user analytics and demographics' },
            { id: 'communities', name: 'Community Report', desc: 'Community growth and engagement metrics' },
            { id: 'professionals', name: 'Professional Report', desc: 'Service provider performance data' },
            { id: 'businesses', name: 'Business Report', desc: 'Business and sales analytics' },
            { id: 'engagement', name: 'Engagement Report', desc: 'Platform-wide engagement metrics' },
            { id: 'revenue', name: 'Revenue Report', desc: 'Financial overview and trends' },
          ].map((report) => (
            <div key={report.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-primary-600" />
                <Button variant="ghost" size="sm" onClick={() => handleExport(report.id)}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{report.name}</h3>
              <p className="text-xs text-gray-600">{report.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default AdminReports;