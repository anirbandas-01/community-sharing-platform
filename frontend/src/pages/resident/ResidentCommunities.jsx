import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Users, MapPin, MessageCircle, Plus,
  Home, Calendar, Briefcase, Settings, User as UserIcon, Star, LogIn, Store,ShoppingCart
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

const ResidentCommunities = () => {
  const [myCommunities, setMyCommunities]       = useState([]);
  const [allCommunities, setAllCommunities]     = useState([]);
  const [loadingMine, setLoadingMine]           = useState(true);
  const [loadingAll, setLoadingAll]             = useState(true);
  const [errorMine, setErrorMine]               = useState(null);
  const [errorAll, setErrorAll]                 = useState(null);
  const [activeTab, setActiveTab]               = useState('my');
  const [searchTerm, setSearchTerm]             = useState('');
  const [joiningId, setJoiningId]               = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home,          label: 'Dashboard',          path: '/resident/dashboard' },
    { icon: Users,         label: 'My Communities',     path: '/resident/communities' },
    { icon: Briefcase,     label: 'Find Professionals', path: '/resident/professionals' },
    { icon: Users,         label: 'Find Residents',     path: '/resident/find-residents' },
    { icon: Store, label: 'Shop', path: '/resident/shop' },
    { icon: ShoppingCart, label: 'My Orders', path: '/resident/my-orders' },
    { icon: Calendar,      label: 'My Bookings',        path: '/resident/bookings' },
    { icon: Star,          label: 'My Reviews',         path: '/resident/reviews' },
    { icon: MessageCircle, label: 'Messages',           path: '/resident/messages' },
    { icon: UserIcon,      label: 'Profile',            path: '/resident/profile' },
    { icon: Settings,      label: 'Settings',           path: '/resident/settings' },
  ];

  useEffect(() => { fetchMyCommunities(); fetchAllCommunities(); }, []);

  const fetchMyCommunities = async () => {
    try {
      setLoadingMine(true);
      setErrorMine(null);
      const res = await api.get('/user/communities');
      setMyCommunities(res.data.communities || []);
    } catch (err) {
      setErrorMine('Failed to load your communities.');
    } finally {
      setLoadingMine(false);
    }
  };

  const fetchAllCommunities = async () => {
    try {
      setLoadingAll(true);
      setErrorAll(null);
      const res = await api.get('/communities');
      setAllCommunities(res.data.communities || []);
    } catch (err) {
      setErrorAll('Failed to load communities.');
    } finally {
      setLoadingAll(false);
    }
  };

  const handleJoinCommunity = async (community) => {
    try {
      setJoiningId(community.id);
      await api.post(`/communities/${community.id}/join`);
      setMyCommunities(prev => [...prev, { ...community, is_member: true }]);
      setAllCommunities(prev =>
        prev.map(c => c.id === community.id ? { ...c, is_member: true } : c)
      );
    } catch (err) {
      alert('Failed to join community. Please try again.');
    } finally {
      setJoiningId(null);
    }
  };

  const handleLeaveCommunity = async (community) => {
    if (!window.confirm(`Leave "${community.name}"?`)) return;
    try {
      await api.post(`/communities/${community.id}/leave`);
      setMyCommunities(prev => prev.filter(c => c.id !== community.id));
      setAllCommunities(prev =>
        prev.map(c => c.id === community.id ? { ...c, is_member: false } : c)
      );
    } catch (err) {
      alert('Failed to leave community. Please try again.');
    }
  };

  // FIX: navigate to community detail page
  const handleViewCommunity = (community) => {
    navigate(`/resident/communities/${community.id}`);
  };

  // FIX: navigate to messages (community chat)
  const handleOpenChat = async (community) => {
    try {
      await api.post('/messages/community-start', { community_id: community.id });
    } catch {}
    navigate('/resident/messages');
  };

  const filtered = (list) =>
    list.filter(c =>
      searchTerm === '' ||
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const displayList  = activeTab === 'my' ? filtered(myCommunities) : filtered(allCommunities);
  const isLoading    = activeTab === 'my' ? loadingMine : loadingAll;
  const currentError = activeTab === 'my' ? errorMine  : errorAll;
  const retryFn      = activeTab === 'my' ? fetchMyCommunities : fetchAllCommunities;

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Communities</h1>
        <p className="text-gray-600">Connect with neighbours and join community groups</p>
      </div>

      {/* Error banner */}
      {currentError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-sm text-red-700">{currentError}</span>
          <Button variant="ghost" size="sm" onClick={retryFn}>Retry</Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-primary-600 mb-1">
            {loadingMine ? '—' : myCommunities.length}
          </p>
          <p className="text-sm text-gray-600">Joined Communities</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-secondary-600 mb-1">
            {loadingAll ? '—' : allCommunities.length}
          </p>
          <p className="text-sm text-gray-600">Total Communities</p>
        </Card>
        <Card className="text-center py-4 col-span-2 md:col-span-1">
          <p className="text-3xl font-bold text-green-600 mb-1">
            {loadingAll ? '—' : allCommunities.filter(c => !c.is_member).length}
          </p>
          <p className="text-sm text-gray-600">Available to Join</p>
        </Card>
      </div>

      {/* Tabs + Search */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-2">
          {[
            { id: 'my',  label: 'My Communities' },
            { id: 'all', label: 'Discover' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg font-medium transition-all text-sm
                ${activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Input
          icon={Search}
          placeholder="Search communities by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Community cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading communities...</p>
          </div>
        </div>
      ) : displayList.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {activeTab === 'my' ? "You haven't joined any communities yet" : 'No communities found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'my'
              ? 'Discover and join communities to connect with your neighbours.'
              : 'Try a different search term.'}
          </p>
          {activeTab === 'my' && (
            <Button variant="primary" onClick={() => setActiveTab('all')}>
              Discover Communities
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((community) => (
            <Card key={community.id} hover className="flex flex-col">
              {/* Cover image */}
              <div className="h-36 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-t-xl -m-6 mb-4 overflow-hidden">
                {community.image ? (
                  <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-12 h-12 text-white opacity-60" />
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight">{community.name}</h3>
                {community.is_member && <Badge variant="success" size="sm">Joined</Badge>}
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{community.description}</p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />{community.member_count ?? 0} members
                </span>
                {community.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />{community.location}
                  </span>
                )}
              </div>

              <div className="mt-auto space-y-2">
                {community.is_member ? (
                  <>
                    {/* FIX: View Community navigates to detail page */}
                    <Button variant="primary" size="sm" className="w-full" onClick={() => handleViewCommunity(community)}>
                      View Community
                    </Button>
                    {/* FIX: Open Chat navigates to messages */}
                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleOpenChat(community)}>
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Open Chat
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-red-600 hover:bg-red-50"
                      onClick={() => handleLeaveCommunity(community)}
                    >
                      Leave Community
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleViewCommunity(community)}>
                      View Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => handleJoinCommunity(community)}
                      disabled={joiningId === community.id}
                    >
                      <LogIn className="w-4 h-4 mr-1" />
                      {joiningId === community.id ? 'Joining...' : 'Join Community'}
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ResidentCommunities;