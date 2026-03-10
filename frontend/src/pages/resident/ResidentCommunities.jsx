import { useState, useEffect } from 'react';
import { Search, Users, MapPin, TrendingUp, Plus, UserPlus, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Home, Briefcase, Calendar, MessageCircle, Settings, User as UserIcon } from 'lucide-react';

const ResidentCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'

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
      const [allResponse, myResponse] = await Promise.all([
        api.get('/communities'),
        api.get('/user/communities')
      ]);
      setCommunities(allResponse.data.communities || []);
      setMyCommunities(myResponse.data.communities || []);
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
      console.error('Error joining community:', error);
      alert(error.response?.data?.message || 'Failed to join community');
    }
  };

  const handleLeaveCommunity = async (communityId) => {
    if (!window.confirm('Are you sure you want to leave this community?')) return;
    
    try {
      await api.post(`/communities/${communityId}/leave`);
      fetchCommunities();
    } catch (error) {
      console.error('Error leaving community:', error);
      alert(error.response?.data?.message || 'Failed to leave community');
    }
  };

  const isJoined = (communityId) => {
    return myCommunities.some(c => c.id === communityId);
  };

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayCommunities = activeTab === 'my' ? myCommunities : filteredCommunities;

  const displayData = (activeTab === 'my' ? myCommunities : filteredCommunities);

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Communities</h1>
        <p className="text-gray-600">Join communities and connect with your neighbors</p>
      </div>

      {/* Search and Tabs */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Tabs */}
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Communities
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'my'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Communities ({myCommunities.length})
            </button>
          </div>

          {/* Create Community Button */}
          <Button variant="primary">
            <Plus className="w-5 h-5 mr-2" />
            Create Community
          </Button>
        </div>

        {/* Search Bar */}
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

      {/* Communities Grid */}
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
              ? 'Join communities to connect with your neighbors'
              : 'Try adjusting your search terms'}
          </p>
          {activeTab === 'my' && (
            <Button variant="primary" onClick={() => setActiveTab('all')}>
              Browse Communities
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayData.map((community) => (
            <Card key={community.id} hover padding={false} className="overflow-hidden">
              {/* Community Image */}
              <div className="h-48 overflow-hidden bg-gray-200">
                <img
                  src={community.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'}
                  alt={community.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                {/* Category Badge */}
                <Badge variant="primary" size="sm" className="mb-3">
                  {community.category || 'Community'}
                </Badge>

                {/* Community Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{community.name}</h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {community.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{community.member_count} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{community.location}</span>
                  </div>
                </div>

                {/* Admin Info */}
                <div className="text-xs text-gray-500 mb-4">
                  Admin: {community.admin_name || 'Unknown'}
                </div>

                {/* Action Button */}
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

      {/* Stats Section */}
      {activeTab === 'my' && myCommunities.length > 0 && (
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Communities</p>
                <p className="text-2xl font-bold text-gray-900">{myCommunities.length || 3}</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {myCommunities.reduce((sum, c) => sum + (c.member_count || 0), 0)}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Chats</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ResidentCommunities;