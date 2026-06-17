import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, MapPin, Clock, Filter, Calendar, MessageCircle, Briefcase, Store,ShoppingCart } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Home, Users, Settings, User as UserIcon } from 'lucide-react';

// FIX: reusable rating display — shows stars + count when rating exists, "New" badge when null
const RatingDisplay = ({ rating, reviewsCount, size = 'sm' }) => {
  if (!rating) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        New
      </span>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <Star className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-yellow-400 fill-current`} />
      <span className={`${size === 'sm' ? 'text-sm' : 'text-base'} font-medium text-gray-900`}>{rating}</span>
      {reviewsCount !== undefined && (
        <span className="text-xs text-gray-500">({reviewsCount})</span>
      )}
    </div>
  );
};

const ResidentProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/resident/dashboard' },
    { icon: Users, label: 'My Communities', path: '/resident/communities' },
    { icon: Briefcase, label: 'Find Professionals', path: '/resident/professionals' },
    { icon: Users, label: 'Find Residents', path: '/resident/find-residents' },
    { icon: Store, label: 'Shop', path: '/resident/shop' },
    { icon: ShoppingCart, label: 'My Orders', path: '/resident/my-orders' },
    { icon: Calendar, label: 'My Bookings', path: '/resident/bookings' },
    { icon: Star, label: 'My Reviews', path: '/resident/reviews' },
    { icon: MessageCircle, label: 'Messages', path: '/resident/messages' },
    { icon: UserIcon, label: 'Profile', path: '/resident/profile' },
    { icon: Settings, label: 'Settings', path: '/resident/settings' },
  ];

  const categories = [
    { id: 'all', name: 'All Services', icon: '🔧' },
    { id: 'plumber', name: 'Plumber', icon: '🚰' },
    { id: 'electrician', name: 'Electrician', icon: '⚡' },
    { id: 'carpenter', name: 'Carpenter', icon: '🔨' },
    { id: 'painter', name: 'Painter', icon: '🎨' },
    { id: 'cleaner', name: 'Cleaner', icon: '🧹' },
    { id: 'ac_technician', name: 'AC Technician', icon: '❄️' },
    { id: 'gardener', name: 'Gardener', icon: '🌿' },
  ];

  useEffect(() => {
    fetchProfessionals();
  }, [selectedCategory]);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = selectedCategory !== 'all' ? { profession: selectedCategory } : {};
      const response = await api.get('/professionals', { params });
      setProfessionals(response.data.professionals || []);
    } catch (err) {
      console.error('Error fetching professionals:', err);
      setError('Failed to load professionals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessionals = professionals.filter(pro =>
    (selectedCategory === 'all' || pro.profession?.toLowerCase() === selectedCategory.toLowerCase()) &&
    (searchTerm === '' ||
      pro.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pro.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pro.services?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const handleBookNow = (professional) => {
    navigate(`/resident/professionals/${professional.id}`);
  };

  // FIX: wire Chat button — start a DM then navigate to messages
  const handleMessage = async (professional) => {
    try {
      await api.post('/messages/start', { recipient_id: professional.id });
      navigate('/resident/messages');
    } catch {
      navigate('/resident/messages');
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Professionals</h1>
        <p className="text-gray-600">Book trusted professionals in your area</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-sm text-red-700">{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchProfessionals}>Retry</Button>
        </div>
      )}

      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by name, profession, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>

        <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all
                  ${selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'
                  }
                `}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          Found <span className="font-semibold text-gray-900">{filteredProfessionals.length}</span> professionals
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading professionals...</p>
          </div>
        </div>
      ) : filteredProfessionals.length === 0 ? (
        <Card className="text-center py-12">
          {/* FIX: Briefcase now imported */}
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Professionals Found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
          <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((pro) => (
            <Card key={pro.id} hover className="flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <img src={pro.image} alt={pro.name} className="w-16 h-16 rounded-full object-cover" />
                  {pro.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg">{pro.name}</h3>
                  <p className="text-sm text-gray-600">{pro.profession}</p>
                  <div className="mt-1">
                    <RatingDisplay rating={pro.rating} reviewsCount={pro.reviews_count} />
                  </div>
                </div>
                {pro.available ? (
                  <Badge variant="success" size="sm">Available</Badge>
                ) : (
                  <Badge variant="default" size="sm">Busy</Badge>
                )}
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {pro.services?.slice(0, 3).map((service, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{pro.experience} experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{pro.location}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">Starting from</p>
                <p className="text-2xl font-bold text-primary-600">{pro.price}<span className="text-sm font-normal text-gray-600">/hr</span></p>
              </div>

              <div className="mt-auto flex gap-2">
                {/* FIX: Chat button now navigates to messages after starting DM */}
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleMessage(pro)}>
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Chat
                </Button>
                <Button variant="primary" size="sm" className="flex-1" onClick={() => handleBookNow(pro)} disabled={!pro.available}>
                  <Calendar className="w-4 h-4 mr-1" />
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Verified Professionals</h3>
            <p className="text-sm text-gray-600">All professionals are background checked and verified</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Rated by Community</h3>
            <p className="text-sm text-gray-600">Transparent ratings from real customers</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick Response</h3>
            <p className="text-sm text-gray-600">Fast booking and same-day service available</p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResidentProfessionals;