import { useState, useEffect } from 'react';
import { Search, Star, MapPin, Clock, Filter, Calendar, MessageCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Home, Users, Briefcase, Settings, User as UserIcon } from 'lucide-react';

const ResidentProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/resident/dashboard' },
    { icon: Users, label: 'My Communities', path: '/resident/communities', badge: '3' },
    { icon: Briefcase, label: 'Find Professionals', path: '/resident/professionals' },
    { icon: Calendar, label: 'My Bookings', path: '/resident/bookings' },
    { icon: MessageCircle, label: 'Messages', path: '/resident/messages', badge: '5' },
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
      const params = selectedCategory !== 'all' ? { profession: selectedCategory } : {};
      const response = await api.get('/professionals', { params });
      setProfessionals(response.data.professionals || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Demo data
  const demoProfessionals = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      profession: 'Plumber',
      rating: 4.8,
      reviews_count: 124,
      price: '₹500',
      experience: '8 years',
      location: 'Andheri, Mumbai',
      available: true,
      image: 'https://i.pravatar.cc/150?img=12',
      services: ['Pipe Repair', 'Installation', 'Emergency Service'],
      verified: true,
    },
    {
      id: 2,
      name: 'Amit Sharma',
      profession: 'Electrician',
      rating: 4.9,
      reviews_count: 156,
      price: '₹600',
      experience: '10 years',
      location: 'Bandra, Mumbai',
      available: true,
      image: 'https://i.pravatar.cc/150?img=13',
      services: ['Wiring', 'Appliance Repair', 'Installation'],
      verified: true,
    },
    {
      id: 3,
      name: 'Suresh Patel',
      profession: 'Carpenter',
      rating: 4.7,
      reviews_count: 98,
      price: '₹700',
      experience: '12 years',
      location: 'Powai, Mumbai',
      available: false,
      image: 'https://i.pravatar.cc/150?img=14',
      services: ['Furniture Making', 'Repair', 'Renovation'],
      verified: true,
    },
    {
      id: 4,
      name: 'Ramesh Yadav',
      profession: 'Painter',
      rating: 4.6,
      reviews_count: 87,
      price: '₹450',
      experience: '7 years',
      location: 'Goregaon, Mumbai',
      available: true,
      image: 'https://i.pravatar.cc/150?img=15',
      services: ['Interior Painting', 'Exterior Painting', 'Texture'],
      verified: false,
    },
    {
      id: 5,
      name: 'Vijay Singh',
      profession: 'AC Technician',
      rating: 4.9,
      reviews_count: 145,
      price: '₹800',
      experience: '9 years',
      location: 'Malad, Mumbai',
      available: true,
      image: 'https://i.pravatar.cc/150?img=16',
      services: ['AC Repair', 'Installation', 'Maintenance'],
      verified: true,
    },
    {
      id: 6,
      name: 'Prakash Desai',
      profession: 'Cleaner',
      rating: 4.5,
      reviews_count: 76,
      price: '₹400',
      experience: '5 years',
      location: 'Kandivali, Mumbai',
      available: true,
      image: 'https://i.pravatar.cc/150?img=17',
      services: ['House Cleaning', 'Deep Cleaning', 'Office Cleaning'],
      verified: true,
    },
  ];

  const displayProfessionals = professionals.length > 0 ? professionals : demoProfessionals;

  const filteredProfessionals = displayProfessionals.filter(pro =>
    (selectedCategory === 'all' || pro.profession.toLowerCase() === selectedCategory.toLowerCase()) &&
    (searchTerm === '' || 
     pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     pro.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
     pro.services?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const handleBookNow = (professional) => {
    // Navigate to booking page or open modal
    alert(`Booking ${professional.name} - This will open booking form`);
  };

  const handleMessage = (professional) => {
    // Navigate to chat or open chat modal
    alert(`Opening chat with ${professional.name}`);
  };

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Professionals</h1>
        <p className="text-gray-600">Book trusted professionals in your area</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by name, profession, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Button (Mobile) */}
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>

        {/* Category Filters */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
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

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Found <span className="font-semibold text-gray-900">{filteredProfessionals.length}</span> professionals
        </p>
      </div>

      {/* Professionals Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading professionals...</p>
          </div>
        </div>
      ) : filteredProfessionals.length === 0 ? (
        <Card className="text-center py-12">
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
              {/* Professional Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <img
                    src={pro.image}
                    alt={pro.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
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
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{pro.rating}</span>
                    <span className="text-xs text-gray-500">({pro.reviews_count} reviews)</span>
                  </div>
                </div>
                {pro.available ? (
                  <Badge variant="success" size="sm">Available</Badge>
                ) : (
                  <Badge variant="default" size="sm">Busy</Badge>
                )}
              </div>

              {/* Services */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {pro.services?.slice(0, 3).map((service, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Info */}
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

              {/* Price */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">Starting from</p>
                <p className="text-2xl font-bold text-primary-600">{pro.price}<span className="text-sm font-normal text-gray-600">/hr</span></p>
              </div>

              {/* Actions */}
              <div className="mt-auto flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleMessage(pro)}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Chat
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleBookNow(pro)}
                  disabled={!pro.available}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Why Choose Section */}
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