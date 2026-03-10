import { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Globe, Lock, Save, Database } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Home, Users, Building2, FileText } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Building2, label: 'Communities', path: '/admin/communities' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Database },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await api.post('/admin/settings', settings);
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(error.response?.data?.message || 'Failed to update settings');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      alert('Passwords do not match!');
      return;
    }

    try {
      await api.post('/user/change-password', passwordData);
      alert('Password changed successfully!');
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error.response?.data?.message || 'Failed to change password');
    }
  };

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  if (loading) {
    return (
      <DashboardLayout menuItems={menuItems} userType="admin">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems} userType="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Settings</h1>
        <p className="text-gray-600">Configure system-wide settings and preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card padding={false}>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors
                      ${activeTab === tab.id ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">User Registration</p>
                        <p className="text-sm text-gray-600">Allow new users to register</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings?.user_registration || false}
                      onChange={() => toggleSetting('user_registration')}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>
                </div>

                <div>
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Community Creation</p>
                        <p className="text-sm text-gray-600">Allow users to create communities</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings?.community_creation || false}
                      onChange={() => toggleSetting('community_creation')}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>
                </div>

                <div>
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Auto-Approve Communities</p>
                        <p className="text-sm text-gray-600">Automatically approve new communities</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings?.auto_approve_communities || false}
                      onChange={() => toggleSetting('auto_approve_communities')}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>
                </div>

                <Button variant="primary" onClick={handleSaveSettings}>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Change Admin Password</h3>
                  <div className="space-y-4">
                    <Input
                      label="Current Password"
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      icon={Lock}
                    />
                    <Input
                      label="New Password"
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      icon={Lock}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={passwordData.new_password_confirmation}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                      icon={Lock}
                    />
                    <Button variant="primary" onClick={handleChangePassword}>
                      <Lock className="w-5 h-5 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Security Options</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings?.require_2fa || false}
                        onChange={() => toggleSetting('require_2fa')}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900">Email Verification</p>
                        <p className="text-sm text-gray-600">Require email verification for new users</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings?.require_email_verification || false}
                        onChange={() => toggleSetting('require_email_verification')}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                    </label>
                    <Button variant="primary" onClick={handleSaveSettings}>
                      <Save className="w-5 h-5 mr-2" />
                      Save Security Settings
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">New User Notifications</p>
                    <p className="text-sm text-gray-600">Get notified when new users register</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings?.notify_new_users || false}
                    onChange={() => toggleSetting('notify_new_users')}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Community Approval Alerts</p>
                    <p className="text-sm text-gray-600">Alert when communities need approval</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings?.notify_pending_communities || false}
                    onChange={() => toggleSetting('notify_pending_communities')}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">System Alerts</p>
                    <p className="text-sm text-gray-600">Receive system error and warning notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings?.notify_system_alerts || false}
                    onChange={() => toggleSetting('notify_system_alerts')}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Daily Reports</p>
                    <p className="text-sm text-gray-600">Send daily activity summary via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings?.send_daily_reports || false}
                    onChange={() => toggleSetting('send_daily_reports')}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>

                <Button variant="primary" onClick={handleSaveSettings}>
                  <Save className="w-5 h-5 mr-2" />
                  Save Notification Settings
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'system' && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">System Settings</h2>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Database Status</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">System is running normally</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Users:</p>
                      <p className="font-semibold text-gray-900">{settings?.system_stats?.users || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Communities:</p>
                      <p className="font-semibold text-gray-900">{settings?.system_stats?.communities || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">DB Size:</p>
                      <p className="font-semibold text-gray-900">{settings?.system_stats?.db_size || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Uptime:</p>
                      <p className="font-semibold text-gray-900">{settings?.system_stats?.uptime || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Maintenance Mode</h3>
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">Enable Maintenance Mode</p>
                      <p className="text-sm text-gray-600">Put the platform in maintenance mode</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings?.maintenance_mode || false}
                      onChange={() => toggleSetting('maintenance_mode')}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Danger Zone</h3>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 mb-3">⚠️ These actions cannot be undone</p>
                    <div className="space-y-2">
                      <Button variant="danger" onClick={() => alert('Cache cleared!')}>
                        Clear Cache
                      </Button>
                      <Button variant="danger" onClick={() => alert('This action requires confirmation')}>
                        Reset Analytics
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;