import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, MapPin, Calendar, MessageCircle, UserPlus, Settings as SettingsIcon, ArrowLeft, Crown, Store,ShoppingCart } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { Home, Briefcase, Settings, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { openContactAdmin } from '../../components/ContactAdminModal';

const ROLE_MENUS = {
  resident: [
    { icon: Home, label: 'Dashboard', path: '/resident/dashboard' },
    { icon: Users, label: 'My Communities', path: '/resident/communities' },
    { icon: Briefcase, label: 'Find Professionals', path: '/resident/professionals' },
    { icon: Store, label: 'Shop', path: '/resident/shop' },
    { icon: ShoppingCart, label: 'My Orders', path: '/resident/my-orders' },
    { icon: Calendar, label: 'My Bookings', path: '/resident/bookings' },
    { icon: MessageCircle, label: 'Messages', path: '/resident/messages' },
    { icon: UserIcon, label: 'Profile', path: '/resident/profile' },
    { icon: Settings, label: 'Settings', path: '/resident/settings' },
  ],
  professional: [
    { icon: Home, label: 'Dashboard', path: '/professional/dashboard' },
    { icon: Users, label: 'My Groups', path: '/professional/groups' },
    { icon: Briefcase, label: 'My Services', path: '/professional/services' },
    { icon: Calendar, label: 'Bookings', path: '/professional/bookings' },
    { icon: MessageCircle, label: 'Messages', path: '/professional/messages' },
    { icon: UserIcon, label: 'Profile', path: '/professional/profile' },
    { icon: Settings, label: 'Settings', path: '/professional/settings' },
  ],
  business: [
    { icon: Home, label: 'Dashboard', path: '/business/dashboard' },
    { icon: Store, label: 'Inventory', path: '/business/inventory' },
    { icon: ShoppingCart, label: 'Orders', path: '/business/orders' },
    { icon: MessageCircle, label: 'Messages', path: '/business/messages' },
    { icon: UserIcon, label: 'Profile', path: '/business/profile' },
    { icon: Settings, label: 'Settings', path: '/business/settings' },
  ],
};

const BACK_PATHS = {
  resident: '/resident/communities',
  professional: '/professional/groups',
  business: '/business/communities',
};

const MESSAGES_PATHS = {
  resident: '/resident/messages',
  professional: '/professional/messages',
  business: '/business/messages',
};

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.user_type || 'resident';
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [contactingAdmin, setContactingAdmin] = useState(false);

  const menuItems = ROLE_MENUS[role] || ROLE_MENUS.resident;

  useEffect(() => {
    fetchCommunityDetails();
  }, [id]);

  const fetchCommunityDetails = async () => {
    try {
      setLoading(true);
      const [communityRes, membersRes, postsRes] = await Promise.all([
        api.get(`/communities/${id}`),
        api.get(`/communities/${id}/members`),
        api.get(`/communities/${id}/posts`),
      ]);

      setCommunity(communityRes.data.community);
      setMembers(membersRes.data.members || []);
      setPosts(postsRes.data.posts || []);
      setIsMember(communityRes.data.is_member || false);
    } catch (error) {
      console.error('Error fetching community details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeave = async () => {
    try {
      if (isMember) {
        await api.post(`/communities/${id}/leave`);
        setIsMember(false);
      } else {
        await api.post(`/communities/${id}/join`);
        setIsMember(true);
      }
      fetchCommunityDetails();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Action failed');
    }
  };

  // Fix #19: "Open Chat" / "View Community Chat" had no onClick — both now
  // navigate to this user's Messages page, pre-opened on the Communities tab
  // for this specific community.
  const handleOpenCommunityChat = () => {
    navigate(MESSAGES_PATHS[role] || '/resident/messages', {
      state: { tab: 'community', communityId: community.id },
    });
  };

  // "Contact Admin" — opens the universal Contact Admin mini-window,
  // pre-filled with this community's name so the message has context.
  const handleContactCommunityAdmin = () => {
    openContactAdmin({
      communityId: community.id,
      communityName: community.name,
      subject: `Question about ${community.name}`,
    });
  };

  // Direct-message the community's admin/creator (uses the existing
  // 1-to-1 messaging system instead of the support-ticket inbox).
  const handleMessageAdminDirectly = async () => {
    if (!community.admin?.id) {
      handleContactCommunityAdmin();
      return;
    }
    setContactingAdmin(true);
    try {
      const res = await api.post('/messages/start', { recipient_id: community.admin.id });
      navigate(MESSAGES_PATHS[role] || '/resident/messages', {
        state: { tab: 'dm', conversationId: res.data.conversation_id },
      });
    } catch (error) {
      console.error('Error starting conversation with admin:', error);
      // Fall back to the support-ticket modal if a DM can't be started
      handleContactCommunityAdmin();
    } finally {
      setContactingAdmin(false);
    }
  };

  if (loading && !community) {
    return (
      <DashboardLayout menuItems={menuItems} userType={role}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading community...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!community) {
    return (
      <DashboardLayout menuItems={menuItems} userType={role}>
        <Card className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Not Found</h3>
          <Button variant="primary" onClick={() => navigate(BACK_PATHS[role] || '/resident/communities')}>
            Back to Communities
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems} userType={role}>
      {/* Back Button */}
      <button
        onClick={() => navigate(BACK_PATHS[role] || '/resident/communities')}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Communities
      </button>

      {/* Cover Image */}
      <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
        <img
          src={community.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=300&fit=crop'}
          alt={community.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end justify-between">
            <div>
              <Badge variant="primary" className="mb-2">{community.category}</Badge>
              <h1 className="text-4xl font-bold text-white mb-2">{community.name}</h1>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {community.member_count} members
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {community.location || 'Local'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {isMember ? (
                <>
                  <Button variant="primary" onClick={handleOpenCommunityChat}>
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Open Chat
                  </Button>
                  <Button variant="outline" className="text-white border-white hover:bg-white/10" onClick={handleJoinLeave}>
                    Leave
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={handleJoinLeave}>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Join Community
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-8">
          {[
            { id: 'about', label: 'About' },
            { id: 'members', label: 'Members', count: members.length },
            { id: 'posts', label: 'Posts', count: posts.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'about' && (
            <>
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed">{community.description}</p>
              </Card>

              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Community Rules</h2>
                <ul className="space-y-2">
                  {(community.rules || [
                    'Respect all community members',
                    'No spam or promotional content',
                    'Keep discussions relevant',
                    'Report issues to admins',
                    'Be helpful and supportive',
                  ]).map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </>
          )}

          {activeTab === 'members' && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Members ({members.length})
              </h2>
              {members.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No members yet</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <img
                        src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=48&background=6366f1&color=fff`}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={member.role === 'Moderator' ? 'primary' : 'default'} size="sm">
                            {member.role}
                          </Badge>
                          <span className="text-xs text-gray-500">Joined {member.joined}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <Card className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No posts yet</p>
                  {isMember && (
                    <p className="text-sm text-gray-500 mt-2">Be the first to post in this community!</p>
                  )}
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post.id}>
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&size=40&background=6366f1&color=fff`}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                        <p className="text-sm text-gray-500">{post.time}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <button className="flex items-center gap-1 hover:text-primary-600">
                        <span>❤️</span>
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary-600">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Admin Info */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Community Admin</h3>
            <div className="flex items-center gap-3">
              <img
                src={community.admin?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(community.admin?.name || 'Admin')}&size=48&background=6366f1&color=fff`}
                alt={community.admin?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{community.admin?.name}</h4>
                  <Crown className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-sm text-gray-600">{community.admin?.role || 'Community Manager'}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4" onClick={handleMessageAdminDirectly} disabled={contactingAdmin}>
              <MessageCircle className="w-4 h-4 mr-2" />
              {contactingAdmin ? 'Opening chat...' : 'Contact Admin'}
            </Button>
          </Card>

          {/* FIX: Quick Stats now use only real API data — removed hardcoded "Active Today: 45" and "Total Posts: 156" */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Members</span>
                <span className="font-semibold text-gray-900">{community.member_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Recent Posts</span>
                {/* FIX: was hardcoded 156 — now uses real posts.length from API */}
                <span className="font-semibold text-gray-900">{posts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Members Shown</span>
                {/* FIX: was hardcoded "Active Today: 45" — replaced with real members count */}
                <span className="font-semibold text-gray-900">{members.length} of {community.member_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-semibold text-gray-900">{community.category}</span>
              </div>
              <div className="flex items-center justify-between">
                  <span className="text-gray-600">Visibility</span>
                  <span className="font-semibold text-gray-900 capitalize">
                      {community.visibility ?? 'Public'}
                  </span>
              </div>
              <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="font-semibold text-gray-900">
                      {community.created_at}
                  </span>
              </div>
            </div>
          </Card>

          {isMember && (
            <Card className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
              <h3 className="font-bold text-lg mb-2">You're a Member!</h3>
              <p className="text-sm opacity-90 mb-4">
                Stay active and engage with your community
              </p>
              <Button variant="secondary" size="sm" className="w-full bg-white text-primary-600 hover:bg-gray-100" onClick={handleOpenCommunityChat}>
                View Community Chat
              </Button>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunityDetail;