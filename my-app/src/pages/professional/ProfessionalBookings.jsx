import { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { Home, Briefcase, MessageCircle, Users, TrendingUp, Settings, User as UserIcon } from 'lucide-react';

const ProfessionalBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, past, all
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/professional/dashboard' },
    { icon: Calendar, label: 'My Bookings', path: '/professional/bookings', badge: '8' },
    { icon: Briefcase, label: 'My Services', path: '/professional/services' },
    { icon: Users, label: 'My Groups', path: '/professional/groups' },
    { icon: MessageCircle, label: 'Messages', path: '/professional/messages', badge: '12' },
    { icon: TrendingUp, label: 'Analytics', path: '/professional/analytics' },
    { icon: UserIcon, label: 'Profile', path: '/professional/profile' },
    { icon: Settings, label: 'Settings', path: '/professional/settings' },
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/professional/appointments');
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/professional/appointments/${bookingId}`, { status: newStatus });
      fetchBookings();
      setShowDetailsModal(false);
      alert(`Booking ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating booking:', error);
      alert(error.response?.data?.message || 'Failed to update booking status');
    }
  };

  // Demo data
  const demoBookings = [
    {
      id: 1,
      client_name: 'Sarah Wilson',
      service_name: 'Plumbing Repair',
      date: 'Mar 08, 2026',
      time: '10:00 AM',
      price: 1200,
      status: 'confirmed',
      location: 'Apartment 402, Sunrise Complex',
      notes: 'Kitchen sink is leaking. Please bring extra pipes.',
      appointment_time: '2026-03-08T10:00:00'
    },
    {
      id: 2,
      client_name: 'David Brown',
      service_name: 'Pipe Installation',
      date: 'Mar 08, 2026',
      time: '2:30 PM',
      price: 1800,
      status: 'confirmed',
      location: 'Villa 15, Palm Gardens',
      notes: 'New bathroom pipe installation required.',
      appointment_time: '2026-03-08T14:30:00'
    },
    {
      id: 3,
      client_name: 'Lisa Anderson',
      service_name: 'Emergency Service',
      date: 'Mar 09, 2026',
      time: '11:00 AM',
      price: 1500,
      status: 'pending',
      location: 'House 23, Green Valley',
      notes: 'Urgent repair needed.',
      appointment_time: '2026-03-09T11:00:00'
    },
    {
      id: 4,
      client_name: 'Mike Johnson',
      service_name: 'Drain Cleaning',
      date: 'Mar 05, 2026',
      time: '9:00 AM',
      price: 600,
      status: 'completed',
      location: 'Flat 101, Tower A',
      notes: 'Drain was blocked.',
      appointment_time: '2026-03-05T09:00:00'
    },
    {
      id: 5,
      client_name: 'Emily Davis',
      service_name: 'Plumbing Repair',
      date: 'Mar 07, 2026',
      time: '3:00 PM',
      price: 800,
      status: 'cancelled',
      location: 'Office Complex, 5th Floor',
      notes: 'Client cancelled due to schedule conflict.',
      appointment_time: '2026-03-07T15:00:00'
    },
  ];

  const displayBookings = bookings.length > 0 ? bookings : demoBookings;

  const filterBookings = () => {
    const now = new Date();
    switch (activeTab) {
      case 'upcoming':
        return displayBookings.filter(b => 
          new Date(b.appointment_time) > now && b.status !== 'cancelled' && b.status !== 'completed'
        );
      case 'past':
        return displayBookings.filter(b => 
          new Date(b.appointment_time) < now || b.status === 'completed' || b.status === 'cancelled'
        );
      default:
        return displayBookings;
    }
  };

  const filteredBookings = filterBookings();

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-5 h-5" />;
      case 'pending': return <AlertCircle className="w-5 h-5" />;
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'cancelled': return <XCircle className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} userType="professional">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage your appointments and schedule</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {displayBookings.filter(b => b.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {displayBookings.filter(b => b.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {displayBookings.filter(b => b.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{displayBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-8">
          {[
            { id: 'upcoming', label: 'Upcoming', count: displayBookings.filter(b => new Date(b.appointment_time) > new Date() && b.status !== 'cancelled').length },
            { id: 'past', label: 'Past', count: displayBookings.filter(b => new Date(b.appointment_time) < new Date() || b.status === 'completed' || b.status === 'cancelled').length },
            { id: 'all', label: 'All Bookings', count: displayBookings.length },
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
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
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
          <p className="text-gray-600">You don't have any {activeTab} bookings yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} hover className="cursor-pointer" onClick={() => {
              setSelectedBooking(booking);
              setShowDetailsModal(true);
            }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Client Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {booking.client_name.charAt(0)}
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{booking.service_name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{booking.client_name}</span>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(booking.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(booking.status)}
                          <span className="capitalize">{booking.status}</span>
                        </div>
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">₹{booking.price}</span>
                      </div>
                    </div>

                    {booking.location && (
                      <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{booking.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Current Status</span>
                <Badge variant={getStatusColor(selectedBooking.status)} size="lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedBooking.status)}
                    <span className="capitalize font-semibold">{selectedBooking.status}</span>
                  </div>
                </Badge>
              </div>

              {/* Service & Client Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Service Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium text-gray-900">{selectedBooking.service_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-gray-900">₹{selectedBooking.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-900">{selectedBooking.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium text-gray-900">{selectedBooking.time}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Client Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900">{selectedBooking.client_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block mb-1">Location:</span>
                      <span className="text-sm text-gray-900">{selectedBooking.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {selectedBooking.status === 'pending' && (
                  <>
                    <Button 
                      variant="primary" 
                      className="flex-1"
                      onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirm Booking
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {selectedBooking.status === 'confirmed' && (
                  <>
                    <Button 
                      variant="primary" 
                      className="flex-1"
                      onClick={() => handleStatusChange(selectedBooking.id, 'completed')}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Mark as Completed
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
                {(selectedBooking.status === 'completed' || selectedBooking.status === 'cancelled') && (
                  <Button variant="outline" className="w-full" onClick={() => setShowDetailsModal(false)}>
                    Close
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProfessionalBookings;