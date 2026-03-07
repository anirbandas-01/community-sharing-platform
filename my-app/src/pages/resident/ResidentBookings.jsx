import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { Home, Users, Briefcase, MessageCircle, Settings, User as UserIcon } from 'lucide-react';

const ResidentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'past', 'cancelled'

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/resident/dashboard' },
    { icon: Users, label: 'My Communities', path: '/resident/communities', badge: '3' },
    { icon: Briefcase, label: 'Find Professionals', path: '/resident/professionals' },
    { icon: Calendar, label: 'My Bookings', path: '/resident/bookings' },
    { icon: MessageCircle, label: 'Messages', path: '/resident/messages', badge: '5' },
    { icon: UserIcon, label: 'Profile', path: '/resident/profile' },
    { icon: Settings, label: 'Settings', path: '/resident/settings' },
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/bookings');
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleReschedule = (bookingId) => {
    alert('Reschedule modal will open - Feature to be implemented');
  };

  // Demo data
  const demoBookings = [
    {
      id: 1,
      service: 'House Cleaning',
      professional: {
        name: 'Jane Doe',
        phone: '+91 98765 43210',
        image: 'https://i.pravatar.cc/150?img=1',
        profession: 'Cleaner'
      },
      date: '2026-03-10',
      time: '10:00 AM',
      duration: '2 hours',
      location: 'Apartment 402, Sunrise Complex',
      amount: '₹1,200',
      status: 'confirmed',
      notes: 'Please bring cleaning supplies',
    },
    {
      id: 2,
      service: 'Plumbing Repair',
      professional: {
        name: 'John Smith',
        phone: '+91 98765 43211',
        image: 'https://i.pravatar.cc/150?img=2',
        profession: 'Plumber'
      },
      date: '2026-03-12',
      time: '2:00 PM',
      duration: '1 hour',
      location: 'Apartment 402, Sunrise Complex',
      amount: '₹800',
      status: 'pending',
      notes: 'Kitchen sink leaking',
    },
    {
      id: 3,
      service: 'AC Servicing',
      professional: {
        name: 'Mike Johnson',
        phone: '+91 98765 43212',
        image: 'https://i.pravatar.cc/150?img=3',
        profession: 'AC Technician'
      },
      date: '2026-03-15',
      time: '11:00 AM',
      duration: '3 hours',
      location: 'Apartment 402, Sunrise Complex',
      amount: '₹1,500',
      status: 'confirmed',
      notes: 'Annual maintenance',
    },
    {
      id: 4,
      service: 'Electrical Work',
      professional: {
        name: 'Amit Sharma',
        phone: '+91 98765 43213',
        image: 'https://i.pravatar.cc/150?img=4',
        profession: 'Electrician'
      },
      date: '2026-02-28',
      time: '9:00 AM',
      duration: '2 hours',
      location: 'Apartment 402, Sunrise Complex',
      amount: '₹1,000',
      status: 'completed',
      notes: 'Fixed wiring issue',
    },
    {
      id: 5,
      service: 'Painting',
      professional: {
        name: 'Ramesh Yadav',
        phone: '+91 98765 43214',
        image: 'https://i.pravatar.cc/150?img=5',
        profession: 'Painter'
      },
      date: '2026-02-20',
      time: '10:00 AM',
      duration: '6 hours',
      location: 'Apartment 402, Sunrise Complex',
      amount: '₹3,500',
      status: 'completed',
      notes: 'Living room painting',
    },
    {
      id: 6,
      service: 'Carpentry',
      professional: {
        name: 'Suresh Patel',
        phone: '+91 98765 43215',
        image: 'https://i.pravatar.cc/150?img=6',
        profession: 'Carpenter'
      },
      date: '2026-02-15',
      time: '3:00 PM',
      duration: '1 hour',
      location: 'Apartment 402, Sunrise Complex',
      amount: '₹600',
      status: 'cancelled',
      notes: 'Door repair - Cancelled by user',
    },
  ];

  const displayBookings = bookings.length > 0 ? bookings : demoBookings;

  const filteredBookings = displayBookings.filter(booking => {
    if (activeTab === 'upcoming') {
      return ['pending', 'confirmed'].includes(booking.status);
    } else if (activeTab === 'past') {
      return booking.status === 'completed';
    } else {
      return booking.status === 'cancelled';
    }
  });

  const getStatusConfig = (status) => {
    const configs = {
      pending: { variant: 'warning', icon: AlertCircle, text: 'Pending' },
      confirmed: { variant: 'success', icon: CheckCircle, text: 'Confirmed' },
      completed: { variant: 'info', icon: CheckCircle, text: 'Completed' },
      cancelled: { variant: 'danger', icon: XCircle, text: 'Cancelled' },
    };
    return configs[status] || configs.pending;
  };

  return (
    <DashboardLayout menuItems={menuItems} userType="resident">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage all your service bookings</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            {[
              { id: 'upcoming', label: 'Upcoming', count: displayBookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length },
              { id: 'past', label: 'Past', count: displayBookings.filter(b => b.status === 'completed').length },
              { id: 'cancelled', label: 'Cancelled', count: displayBookings.filter(b => b.status === 'cancelled').length },
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
                {tab.count > 0 && (
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
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'upcoming' && "You don't have any upcoming bookings"}
            {activeTab === 'past' && "You don't have any past bookings"}
            {activeTab === 'cancelled' && "You don't have any cancelled bookings"}
          </p>
          {activeTab === 'upcoming' && (
            <Button variant="primary">Find Professionals</Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card key={booking.id} hover className="p-0 overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Left Section - Professional Info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={booking.professional.image}
                        alt={booking.professional.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{booking.service}</h3>
                            <p className="text-gray-600">{booking.professional.name}</p>
                            <p className="text-sm text-gray-500">{booking.professional.profession}</p>
                          </div>
                          <Badge variant={statusConfig.variant}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.text}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{booking.time} ({booking.duration})</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{booking.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{booking.professional.phone}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notes:</span> {booking.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Amount & Actions */}
                  <div className="lg:w-64 bg-gray-50 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-3xl font-bold text-gray-900 mb-6">{booking.amount}</p>
                    </div>

                    {/* Actions based on status */}
                    <div className="space-y-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm" className="w-full">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full text-red-600 hover:bg-red-50"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      )}

                      {booking.status === 'confirmed' && (
                        <>
                          <Button variant="primary" size="sm" className="w-full">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Chat
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleReschedule(booking.id)}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Reschedule
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full text-red-600 hover:bg-red-50"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      )}

                      {booking.status === 'completed' && (
                        <>
                          <Button variant="primary" size="sm" className="w-full">
                            ⭐ Rate Service
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            Book Again
                          </Button>
                        </>
                      )}

                      {booking.status === 'cancelled' && (
                        <Button variant="outline" size="sm" className="w-full">
                          Book Again
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      {filteredBookings.length > 0 && (
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <Card>
            <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{displayBookings.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600 mb-1">Upcoming</p>
            <p className="text-2xl font-bold text-blue-600">
              {displayBookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {displayBookings.filter(b => b.status === 'completed').length}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">₹7,600</p>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ResidentBookings;