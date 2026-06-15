import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, MessageCircle, UserPlus, Users,
  Home, Briefcase, Calendar, User as UserIcon,
  Settings, Star, X, ChevronDown, Filter
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

/* ─── tiny debounce hook ─── */
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const FindResidents = () => {
  const navigate = useNavigate();

  /* search / filter state */
  const [searchName, setSearchName]   = useState('');
  const [searchCity, setSearchCity]   = useState('');
  const [showFilters, setShowFilters] = useState(false);

  /* results */
  const [residents, setResidents]     = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [searched, setSearched]       = useState(false);

  /* invite modal */
  const [inviteModal, setInviteModal]         = useState({ open: false, resident: null });
  const [myCommunities, setMyCommunities]     = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(false);
  const [selectedCommunity, setSelectedCommunity]   = useState('');
  const [inviting, setInviting]               = useState(false);
  const [inviteSuccess, setInviteSuccess]     = useState('');
  const [inviteError, setInviteError]         = useState('');

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

  const debouncedName = useDebounce(searchName);
  const debouncedCity = useDebounce(searchCity);

  /* auto-search whenever debounced values change */
  useEffect(() => {
    if (debouncedName || debouncedCity) {
      handleSearch();
    }
  }, [debouncedName, debouncedCity]);

  const handleSearch = useCallback(async () => {
    if (!debouncedName && !debouncedCity) return;
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (debouncedName) params.name = debouncedName;
      if (debouncedCity) params.city = debouncedCity;
      const res = await api.get('/residents/search', { params });
      setResidents(res.data.residents || []);
      setSearched(true);
    } catch (err) {
      setError('Failed to search residents. Please try again.');
      setResidents([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedName, debouncedCity]);

  /* ─── Start Chat ─── */
  const handleChat = async (resident) => {
    try {
      await api.post('/messages/start', { recipient_id: resident.id });
      navigate('/resident/messages');
    } catch {
      navigate('/resident/messages');
    }
  };

  /* ─── Open Invite Modal ─── */
  const handleOpenInvite = async (resident) => {
    setInviteModal({ open: true, resident });
    setSelectedCommunity('');
    setInviteSuccess('');
    setInviteError('');
    try {
      setLoadingCommunities(true);
      const res = await api.get('/user/communities');
      setMyCommunities(res.data.communities || []);
    } catch {
      setMyCommunities([]);
    } finally {
      setLoadingCommunities(false);
    }
  };

  /* ─── Send Invite ─── */
  const handleSendInvite = async () => {
    if (!selectedCommunity || !inviteModal.resident) return;
    try {
      setInviting(true);
      setInviteError('');
      await api.post(`/communities/${selectedCommunity}/invite`, {
        user_id: inviteModal.resident.id,
      });
      setInviteSuccess(`Invitation sent to ${inviteModal.resident.name}!`);
      setSelectedCommunity('');
    } catch (err) {
      setInviteError(err.response?.data?.message || 'Failed to send invitation.');
    } finally {
      setInviting(false);
    }
  };

  const clearSearch = () => {
    setSearchName('');
    setSearchCity('');
    setResidents([]);
    setSearched(false);
    setError(null);
  };

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Residents</h1>
        <p className="text-gray-600">Discover neighbours, start a chat, or invite them to your community</p>
      </div>

      {/* Search card */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Name search */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Name
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search by name…"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
          </div>

          {/* City filter */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Filter by city…"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-end gap-2">
            <Button variant="primary" onClick={handleSearch} disabled={loading || (!searchName && !searchCity)}>
              <Search className="w-4 h-4 mr-1" />
              Search
            </Button>
            {(searchName || searchCity) && (
              <Button variant="ghost" onClick={clearSearch}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-sm text-red-700">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 text-lg">×</button>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Searching residents…</p>
          </div>
        </div>
      ) : searched && residents.length === 0 ? (
        <Card className="text-center py-14">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No residents found</h3>
          <p className="text-gray-500 mb-6">Try a different name or city.</p>
          <Button variant="outline" onClick={clearSearch}>Clear Search</Button>
        </Card>
      ) : !searched ? (
        <Card className="text-center py-14">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for residents</h3>
          <p className="text-gray-500">Enter a name or city above to find neighbours in your area.</p>
        </Card>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4 font-medium">
            Found <span className="text-gray-900 font-semibold">{residents.length}</span> resident{residents.length !== 1 ? 's' : ''}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {residents.map((resident) => (
              <Card key={resident.id} hover className="flex flex-col">
                {/* Avatar + info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={resident.image || '/default-avatar.png'}
                      alt={resident.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {resident.is_online && (
                      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base">{resident.name}</h3>
                    {resident.city && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {resident.city}
                      </p>
                    )}
                    {resident.communities_count !== undefined && (
                      <p className="text-xs text-gray-400 mt-1">
                        Member of {resident.communities_count} communit{resident.communities_count !== 1 ? 'ies' : 'y'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {resident.bio && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resident.bio}</p>
                )}

                {/* Mutual communities badge */}
                {resident.mutual_communities > 0 && (
                  <div className="flex items-center gap-1 mb-3 text-xs text-primary-700 bg-primary-50 px-2 py-1 rounded-full w-fit">
                    <Users className="w-3 h-3" />
                    {resident.mutual_communities} mutual communit{resident.mutual_communities !== 1 ? 'ies' : 'y'}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-auto flex gap-2">
                  <Button variant="primary" size="sm" className="flex-1" onClick={() => handleChat(resident)}>
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenInvite(resident)}>
                    <UserPlus className="w-4 h-4 mr-1" />
                    Invite
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ── Invite to Community Modal ── */}
      {inviteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md relative">
            {/* Close */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setInviteModal({ open: false, resident: null })}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <img
                src={inviteModal.resident?.image || '/default-avatar.png'}
                alt={inviteModal.resident?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-bold text-gray-900">Invite to Community</h2>
                <p className="text-sm text-gray-500">Invite <span className="font-medium text-gray-700">{inviteModal.resident?.name}</span> to join</p>
              </div>
            </div>

            {/* Success */}
            {inviteSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium">
                ✅ {inviteSuccess}
              </div>
            )}

            {/* Invite error */}
            {inviteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {inviteError}
              </div>
            )}

            {loadingCommunities ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              </div>
            ) : myCommunities.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-4">You haven't joined any communities yet.</p>
                <Button variant="outline" size="sm" onClick={() => navigate('/resident/communities')}>
                  Browse Communities
                </Button>
              </div>
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a community
                </label>
                <div className="relative mb-6">
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white pr-10"
                    value={selectedCommunity}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                  >
                    <option value="">— Choose a community —</option>
                    {myCommunities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.member_count ?? 0} members)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setInviteModal({ open: false, resident: null })}
                    disabled={inviting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleSendInvite}
                    disabled={!selectedCommunity || inviting}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    {inviting ? 'Sending…' : 'Send Invite'}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FindResidents;