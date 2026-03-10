import { useState, useEffect } from 'react';
import { Users, Search, Plus, UserPlus, Settings } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { Home, Briefcase, Calendar, MessageCircle, TrendingUp, User as UserIcon } from 'lucide-react';

const ProfessionalGroups = () => {
  const [communities, setCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my'); // my, browse
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/professional/dashboard' },
    { icon: Calendar, label: 'My Bookings', path: '/professional/bookings'},
    { icon: Briefcase, label: 'My Services', path: '/professional/services' },
    { icon: Users, label: 'My Groups', path: '/professional/groups' },
    { icon: MessageCircle, label: 'Messages', path: '/professional/messages'},
    { icon: TrendingUp, label: 'Analytics', path: '/professional/analytics' },
    { icon: UserIcon, label: 'Profile', path: '/professional/profile' },
    { icon: Settings, label: 'Settings', path: '/professional/settings' },
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

  const handleJoinLeave = async (communityId, isMember) => {
    try {
      if (isMember) {
        await api.post(`/communities/${communityId}/leave`);
      } else {
        await api.post(`/communities/${communityId}/join`);
      }
      fetchCommunities();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Action failed');
    }
  };

  const displayCommunities = activeTab === 'my' ? myCommunities : communities;
  const filteredCommunities = displayCommunities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout menuItems={menuItems} userType="professional">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Groups</h1>
        <p className="text-gray-600">Connect with professional communities</p>
      </div>

      {/* Search & Tabs */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === 'my' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('my')}
          >
            My Groups ({myCommunities.length})
          </Button>
          <Button
            variant={activeTab === 'browse' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('browse')}
          >
            Browse All
          </Button>
        </div>
      </div>

      {/* Communities Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading communities...</p>
          </div>
        </div>
      ) : filteredCommunities.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {activeTab === 'my' ? 'No Groups Joined' : 'No Communities Found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'my' 
              ? 'Join communities to connect with other professionals'
              : 'Try adjusting your search'
            }
          </p>
          {activeTab === 'my' && (
            <Button variant="primary" onClick={() => setActiveTab('browse')}>
              <Plus className="w-5 h-5 mr-2" />
              Browse Communities
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => {
            const isMember = myCommunities.some(c => c.id === community.id);
            
            return (
              <Card key={community.id} hover>
                <div className="relative h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-t-lg -mt-6 -mx-6 mb-4">
                  {community.image && (
                    <img
                      src={community.image}
                      alt={community.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary">{community.category}</Badge>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{community.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{community.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {community.member_count} members
                  </span>
                </div>

                <Button
                  variant={isMember ? 'outline' : 'primary'}
                  className="w-full"
                  onClick={() => handleJoinLeave(community.id, isMember)}
                >
                  {isMember ? (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Joined
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Join Group
                    </>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProfessionalGroups;