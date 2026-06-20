import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, User, Mail, Phone, MapPin, FileText,
  Upload, ArrowLeft, Send, DollarSign, Briefcase,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import {
  Home, Package, ShoppingCart, TrendingUp, MessageCircle,
  BarChart3, Settings, User as UserIcon, Star
} from 'lucide-react';

const menuItems = [
  { icon: Home,         label: 'Dashboard', path: '/business/dashboard' },
  { icon: Package,      label: 'Inventory',  path: '/business/inventory' },
  { icon: ShoppingCart, label: 'Orders',     path: '/business/orders' },
  { icon: TrendingUp,   label: 'Sales',      path: '/business/sales' },
  { icon: MessageCircle,label: 'Messages',   path: '/business/messages' },
  { icon: BarChart3,    label: 'Analytics',  path: '/business/analytics' },
  { icon: UserIcon,     label: 'Profile',    path: '/business/profile' },
  { icon: Settings,     label: 'Settings',   path: '/business/settings' },
  { icon: Star, label: 'Reviews', path: '/business/reviews' },
];

const industryTypes = [
  'Retail', 'Food & Beverage', 'Technology', 'Healthcare',
  'Education', 'Manufacturing', 'Construction', 'Finance',
  'Real Estate', 'Transportation', 'Entertainment', 'Agriculture',
  'Textile', 'Automotive', 'Hospitality', 'Other',
];

const revenueRanges = [
  'Under ₹10 Lakhs',
  '₹10 – 50 Lakhs',
  '₹50 Lakhs – 1 Crore',
  '₹1 – 5 Crore',
  '₹5 – 25 Crore',
  'Above ₹25 Crore',
];

const EnterpriseRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading]           = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData]         = useState({
    companyName:        '',
    registrationNumber: '',
    industryType:       '',
    revenue:            '',
    contactPerson:      '',
    designation:        '',
    email:              '',
    phone:              '',
    address:            '',
    city:               '',
    description:        '',
    photo:              null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    setFormData((prev) => ({ ...prev, photo: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const [isReApply, setIsReApply] = useState(false);
  useEffect(() => {
  api.get('/business/profile').then(res => {
    if (res.data.enterprise?.status === 'rejected') setIsReApply(true);
    }).catch(() => {});
  }, []);


  const validate = () => {
    const e = {};
    if (!formData.companyName.trim())        e.companyName        = 'Company name is required';
    if (!formData.registrationNumber.trim()) {
           e.registrationNumber = 'Registration number is required';
    } else if (formData.registrationNumber.trim().length !== 15) {
        e.registrationNumber = 'GST number must be exactly 15 characters';
    }
    if (!formData.industryType)              e.industryType       = 'Select an industry type';
    if (!formData.revenue)                   e.revenue            = 'Select a revenue range';
    if (!formData.contactPerson.trim())      e.contactPerson      = 'Contact person is required';
    if (!formData.designation.trim())        e.designation        = 'Designation is required';
    if (!formData.email.trim())              e.email              = 'Email is required';
    if (!/^\d{10}$/.test(formData.phone))    e.phone              = 'Enter a valid 10-digit phone number';
    if (!formData.address.trim())            e.address            = 'Address is required';
    if (!formData.city.trim())               e.city               = 'City is required';
    if (formData.description.trim().length < 20) e.description   = 'Description must be at least 20 characters';
    if (!formData.photo && !isReApply)                     e.photo              = 'Upload a business photo';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null) data.append(k, v);
      });

      await api.post('/enterprise/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Redirect to dashboard — gate screen will show "pending" status
      navigate('/business/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} userType="business">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/business/dashboard')} className="mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Enterprise</h1>
        <p className="text-gray-600">
          Fill in your business details. An admin will review and approve your application.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">

          {/* Company Info */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-600" />
              Company Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Acme Pvt Ltd"
                  icon={Building2}
                  required
                />
                {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
              </div>
              <div>
                <Input
                  label="Registration Number"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="CIN / GSTIN / MSME No."
                  icon={FileText}
                  maxLength={15}
                  required
                />
                {errors.registrationNumber && <p className="mt-1 text-sm text-red-600">{errors.registrationNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="industryType"
                  value={formData.industryType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select industry</option>
                  {industryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.industryType && <p className="mt-1 text-sm text-red-600">{errors.industryType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Revenue <span className="text-red-500">*</span>
                </label>
                <select
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select range</option>
                  {revenueRanges.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.revenue && <p className="mt-1 text-sm text-red-600">{errors.revenue}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe what your business does, your products/services, and your target market..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-between mt-1">
                  {errors.description
                    ? <p className="text-sm text-red-600">{errors.description}</p>
                    : <span />}
                  <span className="text-xs text-gray-400">{formData.description.length} chars (min 20)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Info */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              Contact Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Contact Person"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Full name"
                  icon={User}
                  required
                />
                {errors.contactPerson && <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>}
              </div>
              <div>
                <Input
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="CEO / Director / Manager"
                  icon={Briefcase}
                  required
                />
                {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation}</p>}
              </div>
              <div>
                <Input
                  label="Business Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="business@company.com"
                  icon={Mail}
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div>
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  maxLength={10}
                  icon={Phone}
                  required
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
              <div>
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  icon={MapPin}
                  required
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Street address, area..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>
            </div>
          </Card>

          {/* Photo Upload */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary-600" />
              Business Photo
            </h2>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
              onClick={() => document.getElementById('enterprise-photo').click()}
            >
              {photoPreview ? (
                <div>
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full max-w-sm h-48 object-cover rounded-lg mx-auto mb-3"
                  />
                  <p className="text-sm text-gray-500">Click to change photo</p>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Upload your business / office photo</p>
                  <p className="text-xs text-gray-400">JPG, PNG up to 5MB {isReApply ? ' · Leave blank to keep existing photo' : ''}</p>
                </div>
              )}
            </div>
            <input
              id="enterprise-photo"
              type="file"
              accept="image/jpg,image/jpeg,image/png"
              onChange={handlePhoto}
              className="hidden"
            />
            {errors.photo && <p className="mt-2 text-sm text-red-600">{errors.photo}</p>}
          </Card>

          {/* Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Review Process</p>
              <p>After submitting, your application will be reviewed by our admin team. You'll have full access to the business dashboard once approved. This typically takes 1–2 business days.</p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/business/dashboard')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              <Send className="w-5 h-5 mr-2" />
              Submit for Review
            </Button>
          </div>

        </div>
      </form>
    </DashboardLayout>
  );
};

export default EnterpriseRegister;