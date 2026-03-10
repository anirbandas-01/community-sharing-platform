import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, MapPin, CreditCard, Upload, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    user_type: '',
    city: '',
    aadhaar: '',
    profile_image: null,
    terms: false,
  });

  const steps = [
    { number: 1, title: 'Account Type', icon: User },
    { number: 2, title: 'Personal Info', icon: Mail },
    { number: 3, title: 'Verification', icon: CreditCard },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          setError('File size must be less than 2MB');
          return;
        }
        setFormData({ ...formData, profile_image: file });
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError('');
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.user_type) {
        setError('Please select an account type');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.city) {
        setError('Please fill all required fields');
        return false;
      }
      if (formData.password !== formData.password_confirmation) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.aadhaar || formData.aadhaar.length !== 12) {
        setError('Please enter valid 12-digit Aadhaar number');
        return false;
      }
      if (!formData.profile_image) {
        setError('Please upload a profile photo');
        return false;
      }
      if (!formData.terms) {
        setError('Please accept terms and conditions');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
      setError('');
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    const fd = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null  && key !== 'terms') {
        fd.append(key, formData[key]);
      }
    });

    try {
      const response = await api.post('/register', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const { token, user, redirect_url } = response.data;
      login(user, token);
      //navigate(redirect_url || `/${user.user_type}/dashboard`);
      window.location.href = redirect_url || `/${user.user_type}/dashboard`;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const accountTypes = [
    {
      value: 'resident',
      title: 'Resident',
      description: 'Join communities and find local services',
      icon: '👥',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      value: 'professional',
      title: 'Professional',
      description: 'Offer your services to the community',
      icon: '💼',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      value: 'business',
      title: 'Business',
      description: 'Sell products and manage inventory',
      icon: '🏪',
      gradient: 'from-orange-500 to-red-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group">
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Join LocalHub community in 3 easy steps</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300"
                  style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>

              {/* Steps */}
              {steps.map((s) => (
                <div key={s.number} className="relative flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                      step >= s.number
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}
                  >
                    {step > s.number ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className="text-xs mt-2 font-medium text-gray-600 hidden md:block">{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Type */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Account Type</h3>
                {accountTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`block cursor-pointer rounded-xl border-2 p-6 transition-all ${
                      formData.user_type === type.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="user_type"
                      value={type.value}
                      checked={formData.user_type === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-4">
                      <div className={`text-4xl w-16 h-16 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center`}>
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{type.title}</h4>
                        <p className="text-gray-600 mt-1">{type.description}</p>
                      </div>
                      {formData.user_type === type.value && (
                        <Check className="w-6 h-6 text-primary-600" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Step 2: Personal Info */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                
                <Input
                  label="Full Name"
                  name="name"
                  icon={User}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    icon={Mail}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    icon={Phone}
                    placeholder="9876543210"
                    maxLength="10"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  label="City"
                  name="city"
                  icon={MapPin}
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    icon={Lock}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    name="password_confirmation"
                    icon={Lock}
                    placeholder="••••••••"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Verification */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Details</h3>
                
                <Input
                  label="Aadhaar Number"
                  name="aadhaar"
                  icon={CreditCard}
                  placeholder="123456789012"
                  maxLength="12"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  required
                />

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="profile_image"
                      accept="image/*"
                      onChange={handleChange}
                      className="sr-only"
                      id="profile-upload"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary-500 transition-colors"
                    >
                      {imagePreview ? (
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="w-32 h-32 rounded-full object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white text-sm">Change Photo</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Click to upload photo</span>
                          <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" variant="primary" onClick={handleNext} className="flex-1">
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button type="submit" variant="primary" loading={loading} className="flex-1">
                  Create Account
                </Button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;