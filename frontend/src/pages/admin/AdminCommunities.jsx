import { useState, useEffect } from 'react';
import { Building2, Search, Edit2, Trash2, CheckCircle, XCircle, Clock , ShieldCheck, Plus, Image as ImageIcon, Loader2} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Home, Users, FileText, Settings , LifeBuoy} from 'lucide-react';

const CATEGORY_OPTIONS = [
  { value: 'resident', label: 'Resident' },
  { value: 'professional', label: 'Professional' },
  { value: 'business', label: 'Business' },
  { value: 'general', label: 'General' },
  { value: 'local', label: 'Local' },
];

const EMPTY_FORM = { name: '', description: '', category: 'resident', visibility: 'public', location: '', image: null };

const AdminCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = creating new
  const [form, setForm] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Building2, label: 'Communities', path: '/admin/communities' },
    { icon: ShieldCheck, label: 'Verifications', path: '/admin/verifications' },
    { icon: LifeBuoy, label: 'Support Inbox', path: '/admin/support' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/communities');
      setCommunities(response.data.communities || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImagePreview(null);
    setFormError('');
    setShowFormModal(true);
  };

  const openEditModal = (community) => {
    setEditingId(community.id);
    setForm({
      name: community.name || '',
      description: community.description || '',
      category: community.category || 'resident',
      visibility: community.visibility || 'public',
      location: community.location || '',
      image: null,
    });
    setImagePreview(community.image || null);
    setFormError('');
    setShowFormModal(true);
    setShowDetailsModal(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      setFormError('Name and description are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('visibility', form.visibility);
      if (form.location) fd.append('location', form.location);
      if (form.image) fd.append('image', form.image);

      if (editingId) {
        fd.append('_method', 'PUT');
        await api.post(`/admin/communities/${editingId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/communities', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setShowFormModal(false);
      fetchCommunities();
    } catch (err) {
      console.error('Error saving community:', err);
      setFormError(err.response?.data?.message || 'Failed to save community. Please check the fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (communityId, status) => {
    try {
      await api.put(`/admin/communities/${communityId}`, { status });
      fetchCommunities();
      setShowDetailsModal(false);
      alert(`Community ${status} successfully!`);
    } catch (error) {
      console.error('Error updating community:', error);
      alert(error.response?.data?.message || 'Failed to update community');
    }
  };

  const handleDeleteCommunity = async (communityId) => {
    if (!window.confirm('Are you sure you want to delete this community? This action cannot be undone.')) return;

    try {
      await api.delete(`/admin/communities/${communityId}`);
      fetchCommunities();
      setShowDetailsModal(false);
      alert('Community deleted successfully!');
    } catch (error) {
      console.error('Error deleting community:', error);
      alert(error.response?.data?.message || 'Failed to delete community');
    }
  };

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && community.status === filterStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      pending: 'warning',
      rejected: 'danger',
    };
    return colors[status] || 'default';
  };

  const statusCounts = {
    all: communities.length,
    active: communities.filter(c => c.status === 'active').length,
    pending: communities.filter(c => c.status === 'pending').length,
    rejected: communities.filter(c => c.status === 'rejected').length,
  };

  return (
    <DashboardLayout menuItems={menuItems} userType="admin">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Management</h1>
          <p className="text-gray-600">Manage and moderate platform communities</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus className="w-5 h-5 mr-2" />
          Create Community
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Communities</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.active}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.pending}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.rejected}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search communities by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'pending', label: 'Pending' },
              { id: 'rejected', label: 'Rejected' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterStatus(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                  ${filterStatus === filter.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading communities...</p>
          </div>
        </div>
      ) : filteredCommunities.length === 0 ? (
        <Card className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Communities Found</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters' : 'No communities created yet'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCommunities.map((community) => (
            <Card key={community.id} hover className="cursor-pointer" onClick={() => { setSelectedCommunity(community); setShowDetailsModal(true); }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                    {community.image ? (
                      <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
                    ) : (
                      community.name?.charAt(0) || 'C'
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{community.name}</h3>
                        <p className="text-sm text-gray-600">{community.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(community.status)} className="capitalize">{community.status}</Badge>
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditModal(community); }}
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                          title="Edit community"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mt-3">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Category:</span> <span className="capitalize">{community.category}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Members:</span> {community.member_count || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Created:</span> {community.created_at}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showDetailsModal && selectedCommunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Community Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Current Status</span>
                <Badge variant={getStatusColor(selectedCommunity.status)} size="lg" className="capitalize">
                  {selectedCommunity.status}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedCommunity.name}</h3>
                  <p className="text-sm text-gray-600">{selectedCommunity.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-900">{selectedCommunity.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Members:</span>
                    <span className="font-medium text-gray-900">{selectedCommunity.member_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium text-gray-900">{selectedCommunity.created_at}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visibility:</span>
                    <span className="font-medium text-gray-900 capitalize">{selectedCommunity.visibility}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {selectedCommunity.status === 'pending' && (
                  <>
                    <Button variant="primary" className="flex-1" onClick={() => handleUpdateStatus(selectedCommunity.id, 'active')}>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Approve
                    </Button>
                    <Button variant="danger" className="flex-1" onClick={() => handleUpdateStatus(selectedCommunity.id, 'rejected')}>
                      <XCircle className="w-5 h-5 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {selectedCommunity.status === 'active' && (
                  <Button variant="warning" className="flex-1" onClick={() => handleUpdateStatus(selectedCommunity.id, 'pending')}>
                    <Clock className="w-5 h-5 mr-2" />
                    Mark as Pending
                  </Button>
                )}
                <Button variant="outline" onClick={() => openEditModal(selectedCommunity)}>
                  <Edit2 className="w-5 h-5 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" onClick={() => handleDeleteCommunity(selectedCommunity.id)}>
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowFormModal(false)}>
          <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Community' : 'Create Community'}
              </h2>
              <button onClick={() => setShowFormModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formError && <p className="text-sm text-red-600">{formError}</p>}

              {/* Image upload */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <label className="flex-1">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Community Picture</span>
                  <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleImageChange}
                    className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium hover:file:bg-primary-100" />
                </label>
              </div>

              <Input
                label="Community Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Green Valley Residents"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What is this community about?"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                  <select
                    value={form.visibility}
                    onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <Input
                label="Location (optional)"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Pune, Maharashtra"
              />

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" className="flex-1" disabled={saving}>
                  {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Plus className="w-5 h-5 mr-2" />}
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Community'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowFormModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminCommunities;