import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Clock, DollarSign, Calendar, MessageCircle, ArrowLeft, CheckCircle, Award, Briefcase } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Home, Users, Settings, User as UserIcon } from 'lucide-react';

const ProfessionalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    service_id: '',
    date: '',
    time: '',
    notes: '',
  });

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
    fetchProfessionalDetails();
  }, [id]);

  const fetchProfessionalDetails = async () => {
    try {
      setLoading(true);
      const [proRes, reviewsRes] = await Promise.all([
        api.get(`/professionals/${id}`),
        api.get(`/professionals/${id}/reviews`)
      ]);
      
      setProfessional(proRes.data.professional);
      setReviews(reviewsRes.data.reviews || []);
    } catch (error) {
      console.error('Error fetching professional details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    try {
      await api.post('/bookings', {
        professional_id: id,
        ...bookingData
      });
      
      setShowBookingModal(false);
      alert('Booking request sent successfully!');
      navigate('/resident/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(error.response?.data?.message || 'Failed to create booking');
    }
  };

  const displayProfessional = professional;
  const displayReviews = reviews;

  if (loading && !professional) {
    return (
      <DashboardLayout menuItems={menuItems} userType="resident">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading professional...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      {/* Back Button */}
      <button
        onClick={() => navigate('/resident/professionals')}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Professionals
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Profile */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            {/* Profile Image */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img
                  src={displayProfessional.image}
                  alt={displayProfessional.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg"
                />
                {displayProfessional.verified && (
                  <div className="absolute bottom-4 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
                {displayProfessional.available && (
                  <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{displayProfessional.name}</h1>
              <p className="text-gray-600 mb-3">{displayProfessional.profession}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">{displayProfessional.rating}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{displayProfessional.total_reviews} reviews</span>
              </div>
              <Badge variant={displayProfessional.available ? 'success' : 'default'}>
                {displayProfessional.available ? 'Available Now' : 'Busy'}
              </Badge>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">{displayProfessional.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5" />
                <span className="text-sm">{displayProfessional.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <span className="text-sm">{displayProfessional.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="text-sm">Responds in {displayProfessional.response_time}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button variant="primary" className="w-full" onClick={() => setShowBookingModal(true)}>
                <Calendar className="w-5 h-5 mr-2" />
                Book Now
              </Button>
              <Button variant="outline" className="w-full">
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-semibold text-gray-900">{displayProfessional.experience}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Jobs</span>
                <span className="font-semibold text-gray-900">{displayProfessional.total_bookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Response Time</span>
                <span className="font-semibold text-gray-900">{displayProfessional.response_time}</span>
              </div>
            </div>
          </Card>

          {/* Certifications */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-600" />
              Certifications
            </h3>
            <ul className="space-y-2">
              {displayProfessional.certifications?.map((cert, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {cert}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed">{displayProfessional.bio}</p>
          </Card>

          {/* Services */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Services Offered</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {displayProfessional.services?.map((service) => (
                <div key={service.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="flex items-center gap-1 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      Starting from ₹{service.price}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      {service.duration}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setBookingData({ ...bookingData, service_id: service.id });
                      setShowBookingModal(true);
                    }}
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Portfolio */}
          {displayProfessional.portfolio && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio</h2>
              <div className="grid grid-cols-3 gap-4">
                {displayProfessional.portfolio.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Work ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Reviews */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews ({displayReviews.length})</h2>
            <div className="space-y-4">
              {displayReviews.map((review) => (
                <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-start gap-3 mb-2">
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <Badge variant="default" size="sm">{review.service}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Book Service</h2>
              <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
                <select
                  value={bookingData.service_id}
                  onChange={(e) => setBookingData({ ...bookingData, service_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a service...</option>
                  {displayProfessional.services?.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ₹{service.price}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Preferred Date"
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                required
                min={new Date().toISOString().split('T')[0]}
              />

              <Input
                label="Preferred Time"
                type="time"
                value={bookingData.time}
                onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Any specific requirements or details..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Confirm Booking
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProfessionalDetail;