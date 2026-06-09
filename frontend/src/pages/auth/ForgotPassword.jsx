import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

/**
 * ForgotPassword — two-step page
 *
 * Step 1 ("email"):   User enters their email. Backend validates it and returns a token.
 * Step 2 ("reset"):   User enters new password + confirm. Token is sent with the request.
 * Step 3 ("done"):    Success screen with link back to login.
 *
 * ── Future OTP upgrade ──────────────────────────────────────────────────────
 * When you're ready to add OTP verification, insert a new step between "email" and "reset":
 *
 *   step "otp":
 *     1. Call POST /forgot-password/send-otp  { email }
 *     2. Show a 6-input OTP box (one digit per input — easy to build with refs)
 *     3. Call POST /forgot-password/verify-otp { email, otp }
 *        → backend returns { token }  (same shape as today)
 *     4. setToken(data.token) and advance to step "reset" — no other changes needed
 *
 *   The rest of the component ("reset" and "done" steps) stays exactly as written.
 * ────────────────────────────────────────────────────────────────────────────
 */
const ForgotPassword = () => {
  const navigate = useNavigate();

  // "email" | "reset" | "done"
  const [step, setStep] = useState('email');

  const [email, setEmail]       = useState('');
  const [token, setToken]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');

  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');

  // ── Step 1: validate email ────────────────────────────────────────────
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/forgot-password', { email: email.trim() });

      // Backend returns a token directly (no email sending yet).
      // When you add email sending, remove this block and show
      // "Check your email for the reset link" instead.
      if (data.token) {
        setToken(data.token);
        setStep('reset');
      } else {
        // Fallback message when email sending is added and no token is returned
        setError('If this email is registered you will receive reset instructions.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: reset password ────────────────────────────────────────────
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

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
      // If token expired, send user back to step 1
      if (err.response?.status === 400 && msg.toLowerCase().includes('expired')) {
        setTimeout(() => {
          setStep('email');
          setToken('');
          setError('Your reset link expired. Please request a new one.');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Shared background / wrapper ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      {/* Decorative blobs — same as Login page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Back link — hidden on done screen */}
        {step !== 'done' && (
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">

          {/* ── STEP 1 — Email ─────────────────────────────────────────── */}
          {step === 'email' && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
                <p className="text-gray-600 mt-2 text-sm">
                  Enter your registered email address and we'll get you back in.
                </p>
              </div>

              {error && <ErrorAlert message={error} />}

              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  required
                  autoFocus
                />

                <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Remember your password?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </>
          )}

          {/* ── STEP 2 — New password ──────────────────────────────────── */}
          {step === 'reset' && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
                <p className="text-gray-600 mt-2 text-sm">
                  Choose a strong password for{' '}
                  <span className="font-medium text-gray-800">{email}</span>
                </p>
              </div>

              {error && <ErrorAlert message={error} />}

              <form onSubmit={handleResetSubmit} className="space-y-5">
                {/* New password */}
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    icon={Lock}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Confirm password */}
                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirm ? 'text' : 'password'}
                    icon={Lock}
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Inline password strength hint */}
                {password && <PasswordStrength password={password} />}

                <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                  Reset Password
                </Button>
              </form>

              <button
                onClick={() => { setStep('email'); setError(''); }}
                className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 text-center"
              >
                ← Use a different email
              </button>
            </>
          )}

          {/* ── STEP 3 — Done ─────────────────────────────────────────── */}
          {step === 'done' && (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Password updated!</h1>
              <p className="text-gray-600 text-sm mb-8">
                Your password has been changed successfully. You can now sign in with your new password.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Go to Login
                <ArrowRight className="w-5 h-5 ml-2" />
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

// ── Small helpers ──────────────────────────────────────────────────────────

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

function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Contains a number',      ok: /\d/.test(password) },
    { label: 'Contains a letter',      ok: /[a-zA-Z]/.test(password) },
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

export default ForgotPassword;