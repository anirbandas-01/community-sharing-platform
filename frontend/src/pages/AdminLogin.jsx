import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Shield, ArrowRight, Lock, User } from 'lucide-react';
import api from '../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.adminLogin(formData.email, formData.password);
      
      // Store admin token and data
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_type', 'admin');
      localStorage.setItem('user_data', JSON.stringify(response.user));

      setSuccess('Login successful! Redirecting...');
      
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-multiply opacity-30 animate-float"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              width: [300, 200, 250, 150, 180][i] + 'px',
              height: [300, 200, 250, 150, 180][i] + 'px',
              top: ['-150px', '50%', 'auto', '20%', 'auto'][i],
              bottom: [null, null, '-125px', null, '30%'][i],
              left: ['-150px', null, '30%', '10%', null][i],
              right: [null, '-100px', null, null, '20%'][i],
              animationDelay: `${i * 4}s`,
              filter: 'blur(40px)'
            }}
          />
        ))}
      </div>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-105"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-8 animate-slideIn">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30">
          
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg animate-logoBounce" style={{ transform: 'rotate(-5deg)' }}>
              <Shield className="w-10 h-10 text-white" style={{ transform: 'rotate(5deg)' }} />
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              LocalHub
            </h1>
            <p className="text-slate-600 font-semibold">Admin Portal</p>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-600">
              Sign in to access your admin dashboard
            </p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800 text-sm animate-slideDown">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-800 text-sm animate-slideDown">
              ✓ {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all"
                  placeholder="admin@localhub.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-purple-600 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
              style={{
                boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)'
              }}
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-slate-600 text-sm mt-6">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secure SSL Encrypted Connection</span>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              Having trouble?{' '}
              <a href="#" className="font-semibold text-indigo-600 hover:text-purple-600 transition-colors">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, -50px) scale(1.1); }
          50% { transform: translate(-30px, 30px) scale(0.9); }
          75% { transform: translate(30px, 50px) scale(1.05); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoBounce {
          0%, 100% { transform: rotate(-5deg) translateY(0); }
          50% { transform: rotate(-5deg) translateY(-10px); }
        }
        .animate-float { animation: float 20s infinite; }
        .animate-slideIn { animation: slideIn 0.6s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-logoBounce { animation: logoBounce 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AdminLogin;