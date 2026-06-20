import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, Shield } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// ── Reusable OTP Input ────────────────────────────────────────────────────────
function OtpInput({ value, onChange, disabled }) {
  const digits = (value || '').split('');

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace') {
      const next = [...digits];
      if (next[idx]) {
        next[idx] = '';
      } else if (idx > 0) {
        next[idx - 1] = '';
        document.getElementById(`fp-otp-${idx - 1}`)?.focus();
      }
      onChange(next.join(''));
      return;
    }
    if (e.key === 'ArrowLeft' && idx > 0) document.getElementById(`fp-otp-${idx - 1}`)?.focus();
    if (e.key === 'ArrowRight' && idx < 5) document.getElementById(`fp-otp-${idx + 1}`)?.focus();
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = val;
    onChange(next.join(''));
    if (val && idx < 5) document.getElementById(`fp-otp-${idx + 1}`)?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    document.getElementById(`fp-otp-${Math.min(pasted.length, 5)}`)?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          id={`fp-otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          disabled={disabled}
          autoFocus={i === 0}
          className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl
            focus:outline-none focus:border-primary-500 transition-colors
            ${digits[i] ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      ))}
    </div>
  );
}

// ── Password Strength ─────────────────────────────────────────────────────────
function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Contains a number',     ok: /\d/.test(password) },
    { label: 'Contains a letter',     ok: /[a-zA-Z]/.test(password) },
  ];
  return (
    <ul className="space-y-1">
      {checks.map(({ label, ok }) => (
        <li key={label} className={`flex items-center gap-2 text-xs ${ok ? 'text-green-600' : 'text-gray-400'}`}>
          <span className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${ok ? 'bg-green-500' : 'bg-gray-200'}`} />
          {label}
        </li>
      ))}
    </ul>
  );
}

function ErrorAlert({ message }) {
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
      <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <span className="text-sm text-red-800">{message}</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
// Steps: 'email' → 'otp' → 'reset' → 'done'
const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep]           = useState('email');
  const [email, setEmail]         = useState('');
  const [otp, setOtp]             = useState('');
  const [token, setToken]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const startCooldown = (seconds = 60) => {
    setResendCooldown(seconds);
    const id = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(id); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 1: send OTP to email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setLoading(true);
    try {
      await api.post('/otp/send-password-reset', { email: email.trim() });
      setStep('otp');
      setOtp('');
      startCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify OTP → get reset token
  const handleOtpSubmit = async () => {
    if (otp.length !== 6) { setError('Please enter the complete 6-digit OTP.'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/otp/verify-password-reset', {
        email: email.trim(),
        otp,
      });
      setToken(data.token);
      setStep('reset');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError('');
    try {
      await api.post('/otp/resend', { email: email.trim(), purpose: 'password_reset' });
      setOtp('');
      startCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: reset password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm)  { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await api.post('/reset-password', {
        email,
        token,
        password,
        password_confirmation: confirm,
      });
      setStep('done');
    } catch (err) {
      const msg = err.response?.data?.message || 'Reset failed. The link may have expired.';
      setError(msg);
      if (err.response?.status === 400 && msg.toLowerCase().includes('expired')) {
        setTimeout(() => { setStep('email'); setToken(''); setError('Your reset link expired. Please request a new OTP.'); }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="w-full max-w-md relative">
        {step !== 'done' && (
          <Link to="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">

          {/* ── STEP: email ── */}
          {step === 'email' && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
                <p className="text-gray-600 mt-2 text-sm">Enter your email and we'll send you an OTP.</p>
              </div>
              {error && <ErrorAlert message={error} />}
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <Input label="Email Address" type="email" icon={Mail} placeholder="you@example.com"
                  value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  required autoFocus />
                <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                  Send OTP <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
              <p className="text-center text-sm text-gray-500 mt-6">
                Remember your password?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
              </p>
            </>
          )}

          {/* ── STEP: otp ── */}
          {step === 'otp' && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Enter OTP</h1>
                <p className="text-gray-600 mt-2 text-sm">
                  We sent a 6-digit OTP to <span className="font-semibold text-gray-800">{email}</span>
                </p>
              </div>
              {error && <ErrorAlert message={error} />}
              <div className="space-y-6">
                <OtpInput value={otp} onChange={setOtp} disabled={loading} />
                <Button type="button" variant="primary" size="lg" className="w-full"
                  onClick={handleOtpSubmit} loading={loading} disabled={otp.length !== 6 || loading}>
                  Verify OTP <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <div className="text-center text-sm text-gray-500">
                  Didn't receive it?{' '}
                  {resendCooldown > 0 ? (
                    <span className="text-gray-400">Resend in {resendCooldown}s</span>
                  ) : (
                    <button onClick={handleResendOtp} disabled={loading}
                      className="text-primary-600 hover:text-primary-700 font-semibold disabled:opacity-50">
                      Resend OTP
                    </button>
                  )}
                </div>
                <button onClick={() => { setStep('email'); setOtp(''); setError(''); }}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 text-center">
                  ← Use a different email
                </button>
              </div>
            </>
          )}

          {/* ── STEP: reset ── */}
          {step === 'reset' && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
                <p className="text-gray-600 mt-2 text-sm">
                  Choose a strong password for <span className="font-medium text-gray-800">{email}</span>
                </p>
              </div>
              {error && <ErrorAlert message={error} />}
              <form onSubmit={handleResetSubmit} className="space-y-5">
                <div className="relative">
                  <Input label="New Password" type={showPassword ? 'text' : 'password'} icon={Lock}
                    placeholder="Min. 8 characters" value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }} required autoFocus />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600" tabIndex={-1}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="relative">
                  <Input label="Confirm Password" type={showConfirm ? 'text' : 'password'} icon={Lock}
                    placeholder="Repeat your password" value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setError(''); }} required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600" tabIndex={-1}>
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && <PasswordStrength password={password} />}
                <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                  Reset Password
                </Button>
              </form>
            </>
          )}

          {/* ── STEP: done ── */}
          {step === 'done' && (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Password updated!</h1>
              <p className="text-gray-600 text-sm mb-8">
                Your password has been changed successfully. You can now sign in with your new password.
              </p>
              <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/login')}>
                Go to Login <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0,0) scale(1); }
          25%  { transform: translate(20px,-50px) scale(1.1); }
          50%  { transform: translate(-20px,20px) scale(0.9); }
          75%  { transform: translate(50px,20px) scale(1.05); }
        }
        .animate-blob { animation: blob 20s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default ForgotPassword;