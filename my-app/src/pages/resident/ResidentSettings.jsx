import { useState } from 'react';
import { Bell, Lock, Shield, CreditCard, Globe, Moon, Save } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Home, Users, Briefcase, Calendar, MessageCircle, Settings, User as UserIcon } from 'lucide-react';

const ResidentSettings = () => {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Notifications
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    booking_updates: true,
    community_updates: true,
    message_notifications: true,
    promotional_emails: false,
    
    // Privacy
    profile_visibility: 'public', // public, private, community
    show_phone: true,
    show_email: false,
    show_address: false,
    
    // Preferences
    language: 'en',
    timezone: 'Asia/Kolkata',
    theme: 'light',
    
    // Password
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/resident/dashboard' },
    { icon: Users, label: 'My Communities', path: '/resident/communities', badge: '3' },
    { icon: Briefcase, label: 'Find Professionals', path: '/resident/professionals' },
    { icon: Calendar, label: 'My Bookings', path: '/resident/bookings' },
    { icon: MessageCircle, label: 'Messages', path: '/resident/messages', badge: '5' },
    { icon: UserIcon, label: 'Profile', path: '/resident/profile' },
    { icon: Settings, label: 'Settings', path: '/resident/settings' },
  ];

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await api.post('/user/settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (settings.new_password !== settings.confirm_password) {
      alert('New passwords do not match');
      return;
    }

    if (settings.new_password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      await api.post('/user/change-password', {
        current_password: settings.current_password,
        new_password: settings.new_password,
      });
      
      setSettings({
        ...settings,
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
    </label>
  );

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Notifications */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">Manage how you receive updates</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <ToggleSwitch 
                checked={settings.email_notifications} 
                onChange={() => handleToggle('email_notifications')} 
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">SMS Notifications</h3>
                <p className="text-sm text-gray-600">Get text messages for important updates</p>
              </div>
              <ToggleSwitch 
                checked={settings.sms_notifications} 
                onChange={() => handleToggle('sms_notifications')} 
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-600">Browser push notifications</p>
              </div>
              <ToggleSwitch 
                checked={settings.push_notifications} 
                onChange={() => handleToggle('push_notifications')} 
              />
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Booking Updates</span>
                  <ToggleSwitch 
                    checked={settings.booking_updates} 
                    onChange={() => handleToggle('booking_updates')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Community Updates</span>
                  <ToggleSwitch 
                    checked={settings.community_updates} 
                    onChange={() => handleToggle('community_updates')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">New Messages</span>
                  <ToggleSwitch 
                    checked={settings.message_notifications} 
                    onChange={() => handleToggle('message_notifications')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Promotional Emails</span>
                  <ToggleSwitch 
                    checked={settings.promotional_emails} 
                    onChange={() => handleToggle('promotional_emails')} 
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Privacy</h2>
              <p className="text-sm text-gray-600">Control your privacy settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Visibility
              </label>
              <select
                name="profile_visibility"
                value={settings.profile_visibility}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="public">Public - Anyone can view</option>
                <option value="community">Community Only - Only community members</option>
                <option value="private">Private - Only you</option>
              </select>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Show on Profile</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Phone Number</span>
                  <ToggleSwitch 
                    checked={settings.show_phone} 
                    onChange={() => handleToggle('show_phone')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Email Address</span>
                  <ToggleSwitch 
                    checked={settings.show_email} 
                    onChange={() => handleToggle('show_email')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Home Address</span>
                  <ToggleSwitch 
                    checked={settings.show_address} 
                    onChange={() => handleToggle('show_address')} 
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
              <p className="text-sm text-gray-600">Customize your experience</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="light">Light</option>
                <option value="dark">Dark (Coming Soon)</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Security - Change Password */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
              <p className="text-sm text-gray-600">Change your password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              name="current_password"
              value={settings.current_password}
              onChange={handleChange}
              placeholder="Enter current password"
            />
            <Input
              label="New Password"
              type="password"
              name="new_password"
              value={settings.new_password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirm_password"
              value={settings.confirm_password}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
            <Button type="submit" variant="primary" loading={saving}>
              Change Password
            </Button>
          </form>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary" onClick={handleSaveSettings} loading={saving}>
            <Save className="w-5 h-5 mr-2" />
            Save All Settings
          </Button>
        </div>

        {/* Danger Zone */}
        <Card className="border-2 border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-4">
                These actions are permanent and cannot be undone
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-100">
                  Deactivate Account
                </Button>
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-100 ml-2">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResidentSettings;