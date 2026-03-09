import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Clock, DollarSign, Award, Edit2, Save, X } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Home, Calendar, MessageCircle, Users, TrendingUp, Settings, User as UserIcon } from 'lucide-react';

const ProfessionalProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/professional/dashboard' },
    { icon: Calendar, label: 'My Bookings', path: '/professional/bookings', badge: '8' },
    { icon: Briefcase, label: 'My Services', path: '/professional/services' },
    { icon: Users, label: 'My Groups', path: '/professional/groups' },
    { icon: MessageCircle, label: 'Messages', path: '/professional/messages', badge: '12' },
    { icon: TrendingUp, label: 'Analytics', path: '/professional/analytics' },
    { icon: UserIcon, label: 'Profile', path: '/professional/profile' },
    { icon: Settings, label: 'Settings', path: '/professional/settings' },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/professional/profile');
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
      await api.put('/professional/profile', formData);
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

  // Demo data
  const demoProfile = {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765 43210',
    city: 'Mumbai',
    specialization: 'Plumber',
    bio: 'Experienced plumber with 8+ years in residential and commercial plumbing. Specializing in repairs, installations, and emergency services. Licensed and insured.',
    experience_years: 8,
    qualifications: 'ITI Plumbing, Licensed Plumber',
    hourly_rate: 500,
    consultation_fee: 300,
    is_verified: true,
    profile_image: 'https://i.pravatar.cc/300?img=12',
    services_offered: ['Repair', 'Installation', 'Emergency', 'Maintenance'],
    availability: ['Mon-Fri: 9AM-6PM', 'Sat: 9AM-2PM', 'Sun: Emergency only'],
  };

  const displayProfile = profile || demoProfile;

  const stats = [
    { label: 'Total Bookings', value: '156', icon: '📅' },
    { label: 'Rating', value: '4.8 ⭐', icon: '⭐' },
    { label: 'Reviews', value: '124', icon: '💬' },
    { label: 'Earnings', value: '₹45,200', icon: '💰' },
  ];

  if (loading) {
    return (
      <DashboardLayout menuItems={menuItems} userType="professional">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems} userType="professional">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your professional information</p>
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
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            {/* Profile Image */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img
                  src={displayProfile.profile_image || 'https://i.pravatar.cc/300?img=12'}
                  alt={displayProfile.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg"
                />
                {displayProfile.is_verified && (
                  <div className="absolute bottom-4 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{displayProfile.name}</h2>
              <p className="text-gray-600 mb-3">{displayProfile.specialization}</p>
              <Badge variant="success">Verified Professional</Badge>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 mb-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Experience</span>
                <span className="font-semibold text-gray-900">{displayProfile.experience_years} years</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Hourly Rate</span>
                <span className="font-semibold text-gray-900">₹{displayProfile.hourly_rate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Consultation Fee</span>
                <span className="font-semibold text-gray-900">₹{displayProfile.consultation_fee}</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-5 h-5" />
                <span>{displayProfile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-5 h-5" />
                <span>{displayProfile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{displayProfile.city}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-200">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={isEditing ? formData.name : displayProfile.name}
                onChange={handleChange}
                disabled={!isEditing}
                icon={User}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={isEditing ? formData.email : displayProfile.email}
                onChange={handleChange}
                disabled={!isEditing}
                icon={Mail}
              />
              <Input
                label="Phone"
                name="phone"
                value={isEditing ? formData.phone : displayProfile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                icon={Phone}
              />
              <Input
                label="City"
                name="city"
                value={isEditing ? formData.city : displayProfile.city}
                onChange={handleChange}
                disabled={!isEditing}
                icon={MapPin}
              />
            </div>
          </Card>

          {/* Professional Info */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Professional Details</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Input
                label="Specialization"
                name="specialization"
                value={isEditing ? formData.specialization : displayProfile.specialization}
                onChange={handleChange}
                disabled={!isEditing}
                icon={Briefcase}
              />
              <Input
                label="Experience (years)"
                name="experience_years"
                type="number"
                value={isEditing ? formData.experience_years : displayProfile.experience_years}
                onChange={handleChange}
                disabled={!isEditing}
                icon={Clock}
              />
              <Input
                label="Hourly Rate (₹)"
                name="hourly_rate"
                type="number"
                value={isEditing ? formData.hourly_rate : displayProfile.hourly_rate}
                onChange={handleChange}
                disabled={!isEditing}
                icon={DollarSign}
              />
              <Input
                label="Consultation Fee (₹)"
                name="consultation_fee"
                type="number"
                value={isEditing ? formData.consultation_fee : displayProfile.consultation_fee}
                onChange={handleChange}
                disabled={!isEditing}
                icon={DollarSign}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualifications
              </label>
              <textarea
                name="qualifications"
                value={isEditing ? formData.qualifications : displayProfile.qualifications}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:bg-gray-50"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={isEditing ? formData.bio : displayProfile.bio}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:bg-gray-50"
                rows="4"
              />
            </div>
          </Card>

          {/* Services Offered */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Services Offered</h2>
            <div className="flex flex-wrap gap-2">
              {displayProfile.services_offered?.map((service, idx) => (
                <Badge key={idx} variant="primary">{service}</Badge>
              ))}
            </div>
          </Card>

          {/* Availability */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Availability</h2>
            <div className="space-y-2">
              {displayProfile.availability?.map((slot, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-4 h-4 text-primary-600" />
                  <span>{slot}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Actions</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Award className="w-5 h-5 mr-2" />
                Request Verification
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50">
                <X className="w-5 h-5 mr-2" />
                Deactivate Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfessionalProfile;