import { useState, useEffect } from 'react';
import { X, Send, CheckCircle, Mail, Shield } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * Universal "Contact Admin" modal.
 *
 * Mounted ONCE near the root of the app (see App.jsx). Any component —
 * anywhere, for any logged-in role, or even a logged-out visitor — can
 * open it by dispatching:
 *
 *   window.dispatchEvent(new CustomEvent('open-contact-admin', {
 *     detail: { communityId, communityName, subject }
 *   }));
 *
 * or simply call the exported helper `openContactAdmin(detail)`.
 */
export function openContactAdmin(detail = {}) {
  window.dispatchEvent(new CustomEvent('open-contact-admin', { detail }));
}

export default function ContactAdminModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState({});
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = (e) => {
      setContext(e.detail || {});
      setForm({
        name: user?.name || '',
        email: user?.email || '',
        subject: e.detail?.subject || (e.detail?.communityName ? `Question about ${e.detail.communityName}` : ''),
        message: '',
      });
      setSent(false);
      setError('');
      setIsOpen(true);
    };
    window.addEventListener('open-contact-admin', handler);
    return () => window.removeEventListener('open-contact-admin', handler);
  }, [user]);

  if (!isOpen) return null;

  const close = () => setIsOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user && (!form.name.trim() || !form.email.trim())) {
      setError('Please enter your name and email.');
      return;
    }
    if (!form.message.trim()) {
      setError('Please write your message.');
      return;
    }
    setSending(true);
    setError('');
    try {
      await api.post('/support/contact', {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        community_id: context.communityId || null,
        type: context.communityId ? 'community' : 'platform',
      });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send your message. Please try again or email us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]" onClick={close}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold leading-tight">
                {context.communityName ? `Contact ${context.communityName} Admin` : 'Contact Admin'}
              </h3>
              <p className="text-xs opacity-90">We typically reply within 24 hours</p>
            </div>
          </div>
          <button onClick={close} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-1">Message sent!</h4>
              <p className="text-sm text-gray-600 mb-4">
                The admin team has received your message and will get back to you{user ? '' : ` at ${form.email}`} soon.
              </p>
              <button
                onClick={close}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <p className="text-sm text-red-600">{error}</p>}

              {!user && (
                <>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </>
              )}

              <input
                type="text"
                placeholder="Subject (optional)"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />

              <textarea
                rows={5}
                placeholder="What's on your mind? Describe your issue or question..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
              />

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {sending ? 'Sending...' : 'Send to Admin'}
                </button>
                <a
                  href={`mailto:admin@communitysharing.com?subject=${encodeURIComponent(form.subject || 'Support request')}&body=${encodeURIComponent(form.message)}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                  title="Email the admin instead"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-gray-400 text-center">
                Prefer email? Use the mail icon to email admin@communitysharing.com directly.
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.2s ease-out; }
      `}</style>
    </div>
  );
}
