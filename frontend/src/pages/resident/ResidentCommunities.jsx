import { useState, useEffect } from 'react';
import { Search, Users, MapPin, TrendingUp, Plus, UserPlus, MessageCircle, X, Upload, Loader } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Home, Briefcase, Calendar, Settings, User as UserIcon } from 'lucide-react';

// ─── Create Community Modal ───────────────────────────────────────────────────
const CreateCommunityModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    visibility: 'public',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'general', label: '🏘️ General', desc: 'Open to everyone' },
    { value: 'local', label: '📍 Local', desc: 'Neighbourhood focused' },
    { value: 'professional', label: '💼 Professional', desc: 'Work & services' },
    { value: 'business', label: '🏪 Business', desc: 'Commerce & trade' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError('Image must be under 2 MB'); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { setError('Community name is required'); return; }
    if (!formData.description.trim()) { setError('Description is required'); return; }

    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', formData.name.trim());
      fd.append('description', formData.description.trim());
      fd.append('category', formData.category);
      fd.append('visibility', formData.visibility);
      if (imageFile) fd.append('image', imageFile);

      await api.post('/admin/communities', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create community. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create Community</h2>
            <p className="text-sm text-gray-500 mt-0.5">Start a new space for your neighbours</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <label
              htmlFor="community-image"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/40 transition-all overflow-hidden relative"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">Change Image</p>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2 MB</p>
                </div>
              )}
              <input
                id="community-image"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Community Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sunrise Apartments Residents"
              maxLength={80}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{formData.name.length}/80</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What is this community about? Who should join?"
              rows={3}
              maxLength={500}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{formData.description.length}/500</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <label
                  key={cat.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.category === cat.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={formData.category === cat.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{cat.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{cat.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
            <div className="flex gap-3">
              {[
                { value: 'public', label: '🌐 Public', desc: 'Anyone can join' },
                { value: 'private', label: '🔒 Private', desc: 'Invite only' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex-1 flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.visibility === opt.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={opt.value}
                    checked={formData.visibility === opt.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Community
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ResidentCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/resident/dashboard' },
    { icon: Users, label: 'My Communities', path: '/resident/communities' },
    { icon: Briefcase, label: 'Find Professionals', path: '/resident/professionals' },
    { icon: Calendar, label: 'My Bookings', path: '/resident/bookings' },
    { icon: MessageCircle, label: 'Messages', path: '/resident/messages' },
    { icon: UserIcon, label: 'Profile', path: '/resident/profile' },
    { icon: Settings, label: 'Settings', path: '/resident/settings' },
  ];

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const [allRes, myRes] = await Promise.all([
        api.get('/communities'),
        api.get('/user/communities'),
      ]);
      setCommunities(allRes.data.communities || []);
      setMyCommunities(myRes.data.communities || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      await api.post(`/communities/${communityId}/join`);
      fetchCommunities();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to join community');
    }
  };

  const handleLeaveCommunity = async (communityId) => {
    if (!window.confirm('Are you sure you want to leave this community?')) return;
    try {
      await api.post(`/communities/${communityId}/leave`);
      fetchCommunities();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to leave community');
    }
  };

  const isJoined = (communityId) => myCommunities.some((c) => c.id === communityId);

  const filteredCommunities = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayData = activeTab === 'my' ? myCommunities : filteredCommunities;
  const totalMembers = myCommunities.reduce((sum, c) => sum + (c.member_count || 0), 0);

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Communities</h1>
        <p className="text-gray-600">Join communities and connect with your neighbours</p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'all' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Communities
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'my' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Communities ({myCommunities.length})
            </button>
          </div>

          {/* ← THIS is the fixed button */}
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Create Community
          </Button>
        </div>

        {activeTab === 'all' && (
          <div className="max-w-xl">
            <Input
              icon={Search}
              placeholder="Search communities by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading communities...</p>
          </div>
        </div>
      ) : displayData.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {activeTab === 'my' ? 'No Communities Yet' : 'No Communities Found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'my'
              ? 'Join or create a community to connect with your neighbours'
              : 'Try adjusting your search, or create a new one'}
          </p>
          {activeTab === 'my' ? (
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setActiveTab('all')}>
                Browse Communities
              </Button>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Community
              </Button>
            </div>
          ) : (
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Community
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayData.map((community) => (
            <Card key={community.id} hover padding={false} className="overflow-hidden">
              <div className="h-48 overflow-hidden bg-gray-200">
                <img
                  src={
                    community.image ||
                    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'
                  }
                  alt={community.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <Badge variant="primary" size="sm" className="mb-3">
                  {community.category || 'Community'}
                </Badge>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{community.name}</h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{community.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{community.member_count} members</span>
                  </div>
                  {community.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{community.location}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Admin: {community.admin_name || 'Unknown'}
                </div>

                {isJoined(community.id) || activeTab === 'my' ? (
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      View Community
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-red-600 hover:bg-red-50"
                      onClick={() => handleLeaveCommunity(community.id)}
                    >
                      Leave Community
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleJoinCommunity(community.id)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Community
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      {activeTab === 'my' && myCommunities.length > 0 && (
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Communities Joined</p>
                <p className="text-2xl font-bold text-gray-900">{myCommunities.length}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Communities Active</p>
                <p className="text-2xl font-bold text-gray-900">{myCommunities.length}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal */}
      {showCreateModal && (
        <CreateCommunityModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchCommunities();
            setActiveTab('all');
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default ResidentCommunities;