import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Lock, MapPin, CreditCard,
  Upload, ArrowRight, ArrowLeft, Check, Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// ── OTP Input (6 boxes) ───────────────────────────────────────────────────────
function OtpInput({ value, onChange, disabled }) {
  const digits = (value || '').split('');

  const handleKey = (e, idx) => {
    const key = e.key;
    if (key === 'Backspace') {
      const next = [...digits];
      if (next[idx]) {
        next[idx] = '';
      } else if (idx > 0) {
        next[idx - 1] = '';
        document.getElementById(`otp-${idx - 1}`)?.focus();
      }
      onChange(next.join(''));
      return;
    }
    if (key === 'ArrowLeft' && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
      return;
    }
    if (key === 'ArrowRight' && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = val;
    onChange(next.join(''));
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          disabled={disabled}
          className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl
            focus:outline-none focus:border-primary-500 transition-colors
            ${digits[i] ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
}

// ── Main Register Component ───────────────────────────────────────────────────
const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 1=type, 2=info, 3=verification, 4=otp
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    user_type: '',
    city: '',
    state: '',
    address: '',
    aadhaar: '',
    profile_image: null,
    terms: false,
  });

  const steps = [
    { number: 1, title: 'Account Type', icon: User },
    { number: 2, title: 'Personal Info', icon: Mail },
    { number: 3, title: 'Verification', icon: CreditCard },
    { number: 4, title: 'OTP', icon: Shield },
  ];

  // ── Cooldown timer ──────────────────────────────────────────────────────────
  const startCooldown = (seconds = 60) => {
    setResendCooldown(seconds);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) { setError('File size must be less than 2MB'); return; }
      setFormData((prev) => ({ ...prev, profile_image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const validateStep = () => {
    if (step === 1 && !formData.user_type) { setError('Please select an account type'); return false; }
    if (step === 2) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.city || !formData.state || !formData.address) {
        setError('Please fill all required fields'); return false;
      }
      if (formData.password !== formData.password_confirmation) { setError('Passwords do not match'); return false; }
      if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return false; }
    }
    if (step === 3) {
      if (!formData.aadhaar || formData.aadhaar.length !== 12) { setError('Please enter valid 12-digit Aadhaar number'); return false; }
      if (!formData.profile_image) { setError('Please upload a profile photo'); return false; }
      if (!formData.terms) { setError('Please accept terms and conditions'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) { setStep((s) => s + 1); setError(''); }
  };

  // Step 3 → 4: send OTP
  const handleSendOtp = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setError('');
    try {
      await api.post('/otp/send-registration', {
        name:                  formData.name,
        email:                 formData.email,
        password:              formData.password,
        password_confirmation: formData.password_confirmation,
        user_type:             formData.user_type,
        phone:                 formData.phone,
        city:                  formData.city,
        state:                 formData.state,
        address:               formData.address,
        aadhaar:               formData.aadhaar,
      });
      setStep(4);
      setOtp('');
      startCooldown(60);
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0];
        setError(Array.isArray(first) ? first[0] : first);
      } else {
        setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 4: verify OTP and create account
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) { setError('Please enter the complete 6-digit OTP'); return; }
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('email', formData.email);
      fd.append('otp', otp);
      fd.append('profile_image', formData.profile_image);

      const response = await api.post('/otp/verify-registration', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { token, user, redirect_url } = response.data;
      login(user, token);
      window.location.href = redirect_url || `/${user.user_type}/dashboard`;
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError('');
    try {
      await api.post('/otp/resend', { email: formData.email, purpose: 'registration' });
      setOtp('');
      startCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const accountTypes = [
    { value: 'resident',     title: 'Resident',     description: 'Join communities and find local services',  icon: '👥', gradient: 'from-blue-500 to-cyan-500' },
    { value: 'professional', title: 'Professional', description: 'Offer your services to the community',      icon: '💼', gradient: 'from-purple-500 to-pink-500' },
    { value: 'business',     title: 'Business',     description: 'Sell products and manage inventory',        icon: '🏪', gradient: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group">
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Join CommunitySharing community in easy steps</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300"
                  style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>
              {steps.map((s) => (
                <div key={s.number} className="relative flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                    step >= s.number
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}>
                    {step > s.number ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className="text-xs mt-2 font-medium text-gray-600 hidden md:block">{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          {/* ── STEP 1: Account Type ── */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Account Type</h3>
              {accountTypes.map((type) => (
                <label key={type.value} className={`block cursor-pointer rounded-xl border-2 p-6 transition-all ${
                  formData.user_type === type.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input type="radio" name="user_type" value={type.value}
                    checked={formData.user_type === type.value} onChange={handleChange} className="sr-only" />
                  <div className="flex items-start gap-4">
                    <div className={`text-4xl w-16 h-16 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center`}>
                      {type.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{type.title}</h4>
                      <p className="text-gray-600 mt-1">{type.description}</p>
                    </div>
                    {formData.user_type === type.value && <Check className="w-6 h-6 text-primary-600" />}
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* ── STEP 2: Personal Info ── */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <Input label="Full Name" name="name" icon={User} placeholder="Rup Das"
                value={formData.name} onChange={handleChange} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Email Address" type="email" name="email" icon={Mail}
                  placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                <Input label="Phone Number" type="tel" name="phone" icon={Phone}
                  placeholder="9876543210" maxLength="10" value={formData.phone} onChange={handleChange} required />
              </div>
              <Input label="City" name="city" icon={MapPin} placeholder="Santipur"
                value={formData.city} onChange={handleChange} required />
              <Input label="State" name="state" icon={MapPin} placeholder="West Bengal"
                value={formData.state} onChange={handleChange} required />
              <Input label="Address" name="address" icon={MapPin} placeholder="123 Main Street, Area Name"
                value={formData.address} onChange={handleChange} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Password" type="password" name="password" icon={Lock}
                  placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                <Input label="Confirm Password" type="password" name="password_confirmation" icon={Lock}
                  placeholder="••••••••" value={formData.password_confirmation} onChange={handleChange} required />
              </div>
            </div>
          )}

          {/* ── STEP 3: Verification details + photo ── */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Details</h3>
              <Input label="Aadhaar Number" name="aadhaar" icon={CreditCard}
                placeholder="123456789012" maxLength="12"
                value={formData.aadhaar} onChange={handleChange} required />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input type="file" name="profile_image" accept="image/*"
                    onChange={handleChange} className="sr-only" id="profile-upload" />
                  <label htmlFor="profile-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary-500 transition-colors">
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

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" /* target="_blank" rel="noopener noreferrer" */ className="text-primary-600 hover:text-primary-700 font-medium">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                   <Link
                        to="/privacy-policy"
                        /* target="_blank"
                        rel="noopener noreferrer" */
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Privacy Policy
                    </Link>
                </span>
              </label>
            </div>
          )}

          {/* ── STEP 4: OTP Verification ── */}
          {step === 4 && (
            <div className="text-center space-y-6">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <Shield className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Verify Your Email</h3>
                <p className="text-gray-600 text-sm">
                  We sent a 6-digit OTP to{' '}
                  <span className="font-semibold text-gray-800">{formData.email}</span>
                </p>
              </div>

              <OtpInput value={otp} onChange={setOtp} disabled={loading} />

              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleVerifyOtp}
                loading={loading}
                disabled={otp.length !== 6 || loading}
              >
                Verify &amp; Create Account
              </Button>

              <div className="text-sm text-gray-500">
                Didn't receive the OTP?{' '}
                {resendCooldown > 0 ? (
                  <span className="text-gray-400">Resend in {resendCooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-primary-600 hover:text-primary-700 font-semibold disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => { setStep(3); setOtp(''); setError(''); }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Use a different email
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button type="button" variant="outline"
                  onClick={() => { setStep((s) => s - 1); setError(''); }} className="flex-1">
                  <ArrowLeft className="w-5 h-5 mr-2" />Back
                </Button>
              )}
              {step < 3 && (
                <Button type="button" variant="primary" onClick={handleNext} className="flex-1">
                  Next <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
              {step === 3 && (
                <Button type="button" variant="primary"
                  onClick={handleSendOtp} loading={loading} className="flex-1">
                  Send OTP <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          )}

          {step < 4 && (
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign In</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;