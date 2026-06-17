import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon, Mail, Phone, MapPin, Camera,
  Edit2, Save, X, Home, Users, Briefcase, Calendar,
  MessageCircle, Settings, Star, Lock
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';


const getAvatarSrc = (u) => {
  if (!u?.profile_image || u.profile_image === 'null' || u.profile_image === '') {
    return '/default-avatar.png';
  }
  return u.profile_image.startsWith('http')
    ? u.profile_image
    : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://127.0.0.1:8000'}${u.profile_image}`;
};

const ResidentProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState(null);
  const [successMsg, setSuccessMsg]     = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const emptyForm = { name: '', email: '', phone: '', city: '', bio: '', address: '' };
  const [formData, setFormData]         = useState(emptyForm);
  const [originalData, setOriginalData] = useState(emptyForm);

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

  useEffect(() => {
  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resident/profile');
      const u = res.data.user || {};
      const data = {
        name:    u.name    || '',
        email:   u.email   || '',
        phone:   u.phone   || '',
        city:    u.city    || '',
        address: u.address || '',
        bio:     res.data.bio || '',
      };
      setFormData(data);
      setOriginalData(data);
    } catch (err) {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };
  loadProfile();
}, []);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const response = await api.put('/resident/profile', formData);
      if (updateUser) updateUser(response.data.user);
      setOriginalData({ ...formData, bio: response.data.bio ?? formData.bio });
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
     setFormData(originalData);
     setIsEditing(false);
     setError(null);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingPhoto(true);
      setError(null);
      const data = new FormData();
      data.append('photo', file);
      const response = await api.post('/user/profile/photo', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (updateUser) updateUser({ ...user, profile_image: response.data.profile_image });
      setSuccessMsg('Photo updated!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      setError('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const stats = [
    { label: 'Communities',   value: user?.communities_count  ?? 0, color: 'blue' },
    { label: 'Bookings',      value: user?.bookings_count     ?? 0, color: 'purple' },
    { label: 'Reviews',       value: user?.reviews_count      ?? 0, color: 'yellow' },
  ];

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <span className="text-sm text-green-700 font-medium">{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-green-400 hover:text-green-600 text-lg">×</button>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-sm text-red-700">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 text-lg">×</button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: avatar + stats */}
        <div className="space-y-6">
          <Card className="text-center">
            <div className="relative inline-block mb-4">
              <img
                  src={getAvatarSrc(user)}
                  alt={user?.name}
                  className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                />
              <button
                className="absolute bottom-1 right-1 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors shadow"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                title="Change photo"
              >
                {uploadingPhoto
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Camera className="w-4 h-4" />
                }
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            {user?.city && (
              <p className="text-gray-500 text-sm flex items-center justify-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />{user.city}
              </p>
            )}
          </Card>

          {/* Stats */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Activity</h3>
            <div className="space-y-3">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{s.label}</span>
                  <span className={`text-lg font-bold text-${s.color}-600`}>{s.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Security card */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Security</h3>
            {/* FIX: Change Password now navigates to settings#security instead of doing nothing */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/resident/settings?tab=security')}
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </Card>
        </div>

        {/* Right: editable form */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCancel} disabled={saving}>
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
                    <Save className="w-4 h-4 mr-1" />
                    {saving ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditing
                  ? <Input icon={UserIcon} value={formData.name} onChange={handleChange('name')} placeholder="Your name" />
                  : <p className="text-gray-900 py-2">{formData.name || '—'}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                {isEditing
                  ? <Input icon={Mail} value={formData.email} onChange={handleChange('email')} type="email" placeholder="Your email" disabled />
                  : <p className="text-gray-900 py-2">{formData.email || '—'}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                {isEditing
                  ? <Input icon={Phone} value={formData.phone} onChange={handleChange('phone')} placeholder="+91 XXXXX XXXXX" />
                  : <p className="text-gray-900 py-2">{formData.phone || '—'}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                {isEditing
                  ? <Input icon={MapPin} value={formData.city} onChange={handleChange('city')} placeholder="Your city" />
                  : <p className="text-gray-900 py-2">{formData.city || '—'}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                {isEditing
                  ? <Input icon={MapPin} value={formData.address} onChange={handleChange('address')} placeholder="Your full address" />
                  : <p className="text-gray-900 py-2">{formData.address || '—'}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                {isEditing ? (
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange('bio')}
                    placeholder="Tell others a bit about yourself…"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.bio || '—'}</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResidentProfile;