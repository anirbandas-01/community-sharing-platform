import { useState, useEffect } from 'react';
import { Camera, Edit2, Save, X, MapPin, Mail, Phone, Calendar, CreditCard } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Home, Users, Briefcase, MessageCircle, Settings, User as UserIcon } from 'lucide-react';

const ResidentProfile = () => {
  const { user, checkAuth } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    aadhaar: '',
    bio: '',
    profile_image: null,
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      const profileData = response.data.user || response.data;
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        city: profileData.city || '',
        address: profileData.address || '',
        aadhaar: profileData.aadhaar || '',
        bio: profileData.bio || '',
        profile_image: null,
      });
      if (profileData.profile_image) {
        setImagePreview(profileData.profile_image);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, profile_image: file });
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && key !== 'profile_image') {
          fd.append(key, formData[key]);
        }
      });
      if (formData.profile_image) {
        fd.append('profile_image', formData.profile_image);
      }

      await api.post('/user/profile/update', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await checkAuth();
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    fetchProfile();
  };

  // Stats data
  const stats = [
    { label: 'Communities Joined', value: '3', icon: Users, color: 'blue' },
    { label: 'Total Bookings', value: '12', icon: Calendar, color: 'green' },
    { label: 'Messages', value: '28', icon: MessageCircle, color: 'purple' },
    { label: 'Total Spent', value: '₹7,600', icon: CreditCard, color: 'orange' },
  ];

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            {/* Profile Image */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto mb-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-4xl font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                {editing && (
                  <label className="absolute bottom-4 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{formData.name || 'User'}</h2>
              <Badge variant="primary">Resident</Badge>
            </div>

            {/* Quick Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <span className="text-sm">{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5" />
                <span className="text-sm">{formData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">{formData.city || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Member since 2024</span>
              </div>
            </div>

            {/* Edit Button */}
            {!editing && (
              <Button variant="primary" className="w-full" onClick={() => setEditing(true)}>
                <Edit2 className="w-5 h-5 mr-2" />
                Edit Profile
              </Button>
            )}
          </Card>

          {/* Bio Card */}
          <Card className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Bio</h3>
            {editing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="4"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-600 text-sm">
                {formData.bio || 'No bio added yet.'}
              </p>
            )}
          </Card>
        </div>

        {/* Right Column - Details & Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              {editing && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSubmit} loading={loading}>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                />
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>

              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editing}
              />

              <Input
                label="Aadhaar Number"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleChange}
                disabled={!editing}
                maxLength="12"
              />
            </form>
          </Card>

          {/* Activity Stats */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Activity Overview</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-7 h-7 text-${stat.color}-600`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Account Settings */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive updates about bookings and messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">SMS Notifications</h4>
                  <p className="text-sm text-gray-600">Get SMS alerts for important updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button variant="outline" className="text-red-600 hover:bg-red-50 border-red-300">
                  Change Password
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResidentProfile;