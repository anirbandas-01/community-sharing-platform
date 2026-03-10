import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Store, Clock, Edit2, Save, X } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Home, Package, ShoppingCart, TrendingUp, MessageCircle, BarChart3, Settings } from 'lucide-react';

const BusinessProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/business/dashboard' },
    { icon: Package, label: 'Inventory', path: '/business/inventory' },
    { icon: ShoppingCart, label: 'Orders', path: '/business/orders' },
    { icon: TrendingUp, label: 'Sales', path: '/business/sales' },
    { icon: MessageCircle, label: 'Messages', path: '/business/messages' },
    { icon: BarChart3, label: 'Analytics', path: '/business/analytics' },
    { icon: User, label: 'Profile', path: '/business/profile' },
    { icon: Settings, label: 'Settings', path: '/business/settings' },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/business/profile');
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/business/profile', formData);
      setProfile(formData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <DashboardLayout menuItems={menuItems} userType="business">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout menuItems={menuItems} userType="business">
        <Card className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Profile Data</h3>
          <p className="text-gray-600 mb-6">Unable to load your profile. Please try again.</p>
          <Button variant="primary" onClick={fetchProfile}>Retry</Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems} userType="business">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Profile</h1>
          <p className="text-gray-600">Manage your business information</p>
        </div>
        {!isEditing ? (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-5 h-5 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-5 h-5 mr-2" />
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                {profile.name?.charAt(0) || 'B'}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
              <p className="text-gray-600 mb-3">{profile.category}</p>
              <Badge variant="success">Verified Business</Badge>
            </div>

            <div className="space-y-3 mb-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-5 h-5" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-5 h-5" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{profile.address}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Business Name"
                name="name"
                value={isEditing ? formData.name : profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                icon={Store}
              />
              <Input
                label="Category"
                name="category"
                value={isEditing ? formData.category : profile.category}
                onChange={handleChange}
                disabled={!isEditing}
                icon={Store}
              />
              <Input
                label="Phone"
                name="phone"
                value={isEditing ? formData.phone : profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                icon={Phone}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={isEditing ? formData.email : profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                icon={Mail}
              />
              <Input
                label="Address"
                name="address"
                value={isEditing ? formData.address : profile.address}
                onChange={handleChange}
                disabled={!isEditing}
                icon={MapPin}
                className="md:col-span-2"
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Business Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={isEditing ? formData.description : profile.description}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:bg-gray-50"
                rows="4"
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Operating Hours</h2>
            <div className="space-y-2">
              {profile.operating_hours?.map((slot, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-4 h-4 text-primary-600" />
                  <span>{slot}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BusinessProfile;