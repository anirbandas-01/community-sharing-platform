import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bell, Lock, Shield, Trash2, Eye, EyeOff,
  Home, Users, Briefcase, Calendar, MessageCircle,
  User as UserIcon, Settings, Star, Save
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

const ResidentSettings = () => {
  const location = useLocation();

  // FIX: read ?tab= from URL so Change Password redirect from Profile opens Security tab
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'notifications';
  };

  const [activeTab, setActiveTab]               = useState(getInitialTab);
  const [saving, setSaving]                     = useState(false);
  const [error, setError]                       = useState(null);
  const [successMsg, setSuccessMsg]             = useState('');
  const [showCurrentPw, setShowCurrentPw]       = useState(false);
  const [showNewPw, setShowNewPw]               = useState(false);
  const [showConfirmPw, setShowConfirmPw]       = useState(false);

  const [notifications, setNotifications] = useState({
    email_bookings:    true,
    email_messages:    true,
    email_community:   false,
    push_bookings:     true,
    push_messages:     true,
    push_community:    true,
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password:     '',
    confirm_password: '',
  });

  const menuItems = [
    { icon: Home,          label: 'Dashboard',          path: '/resident/dashboard' },
    { icon: Users,         label: 'My Communities',     path: '/resident/communities' },
    { icon: Briefcase,     label: 'Find Professionals', path: '/resident/professionals' },
    { icon: Users,         label: 'Find Residents',     path: '/resident/find-residents' },
    { icon: Calendar,      label: 'My Bookings',        path: '/resident/bookings' },
    { icon: Star,          label: 'My Reviews',         path: '/resident/reviews' },
    { icon: MessageCircle, label: 'Messages',           path: '/resident/messages' },
    { icon: UserIcon,      label: 'Profile',            path: '/resident/profile' },
    { icon: Settings,      label: 'Settings',           path: '/resident/settings' },
  ];

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security',      label: 'Security',      icon: Lock },
    { id: 'privacy',       label: 'Privacy',       icon: Shield },
    { id: 'danger',        label: 'Danger Zone',   icon: Trash2 },
  ];

  // Keep tab in sync if user navigates with ?tab=security directly
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.search]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setError(null);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  /* -------- Notification save -------- */
  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      await api.put('/user/notifications', notifications);
      showSuccess('Notification preferences saved!');
    } catch {
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /* -------- Password change -------- */
  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match.');
      return;
    }
    if (passwordData.new_password.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await api.put('/user/password', {
        current_password: passwordData.current_password,
        new_password:     passwordData.new_password,
      });
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      showSuccess('Password changed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /* -------- Delete account -------- */
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you absolutely sure? This will permanently delete your account and all data. This cannot be undone.'
    );
    if (!confirmed) return;
    try {
      await api.delete('/user/account');
      window.location.href = '/';
    } catch {
      setError('Failed to delete account. Please contact support.');
    }
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${checked ? 'bg-primary-600' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
        ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      {/* Success */}
      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <span className="text-sm text-green-700 font-medium">{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-green-400 text-lg">×</button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-sm text-red-700">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 text-lg">×</button>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Tab sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-2">
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${activeTab === id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Tab content */}
        <div className="lg:col-span-3">

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4" />Email Notifications
                  </h3>
                  {[
                    { key: 'email_bookings',  label: 'Booking updates',          desc: 'Confirmations, reminders, cancellations' },
                    { key: 'email_messages',  label: 'New messages',             desc: 'When someone sends you a direct message' },
                    { key: 'email_community', label: 'Community activity',       desc: 'Posts and announcements in your communities' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{label}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                      <Toggle
                        checked={notifications[key]}
                        onChange={(val) => setNotifications(prev => ({ ...prev, [key]: val }))}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Bell className="w-4 h-4" />Push Notifications
                  </h3>
                  {[
                    { key: 'push_bookings',   label: 'Booking alerts',           desc: 'Real-time booking status changes' },
                    { key: 'push_messages',   label: 'Message alerts',           desc: 'Instant message notifications' },
                    { key: 'push_community',  label: 'Community alerts',         desc: 'Community chat and event updates' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{label}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                      <Toggle
                        checked={notifications[key]}
                        onChange={(val) => setNotifications(prev => ({ ...prev, [key]: val }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="primary" onClick={handleSaveNotifications} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving…' : 'Save Preferences'}
                </Button>
              </div>
            </Card>
          )}

          {/* SECURITY — FIX: Change Password from Profile opens this tab via ?tab=security */}
          {activeTab === 'security' && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <Input
                      type={showCurrentPw ? 'text' : 'password'}
                      icon={Lock}
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowCurrentPw(v => !v)}
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <Input
                      type={showNewPw ? 'text' : 'password'}
                      icon={Lock}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                      placeholder="Minimum 8 characters"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowNewPw(v => !v)}
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPw ? 'text' : 'password'}
                      icon={Lock}
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                      placeholder="Re-enter new password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPw(v => !v)}
                    >
                      {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button variant="primary" onClick={handleChangePassword} disabled={saving || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}>
                  {saving ? 'Updating…' : 'Update Password'}
                </Button>
              </div>
            </Card>
          )}

          {/* PRIVACY */}
          {activeTab === 'privacy' && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
              <div className="space-y-4">
                {[
                  { label: 'Show profile to community members', desc: 'Other residents can find and view your profile' },
                  { label: 'Show online status',                desc: 'Let others see when you were last active' },
                  { label: 'Allow direct messages',            desc: 'Residents can send you direct messages' },
                ].map(({ label, desc }, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* DANGER ZONE */}
          {activeTab === 'danger' && (
            <Card className="border border-red-200">
              <h2 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h2>
              <p className="text-sm text-gray-600 mb-6">These actions are permanent and cannot be undone.</p>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold text-gray-900 mb-1">Delete Account</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Permanently delete your account along with all bookings, reviews, and community memberships.
                </p>
                <Button
                  variant="danger"
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete My Account
                </Button>
              </div>
            </Card>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

// tiny local alias to avoid unused import warning
const Mail = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default ResidentSettings;