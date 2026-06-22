import { useState } from 'react';
import StaticPage from '../components/StaticPage';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../services/api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Optional backend endpoint — see note below. Falls back gracefully if not wired yet.
      await api.post('/contact', form);
      setSent(true);
    } catch {
      // Even if there's no backend route yet, let the user know we got it via mailto fallback
      window.location.href = `mailto:support@communitysharing.com?subject=Contact form: ${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.message + '\n\nFrom: ' + form.email)}`;
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaticPage icon={Mail} title="Contact Us" subtitle="We'd love to hear from you">
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-primary-600 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900">Email</p>
            <a href="mailto:support@communitysharing.com" className="text-gray-600 hover:text-primary-600">support@communitysharing.com</a>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-primary-600 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900">Phone</p>
            <p className="text-gray-600">+91 90000 00000</p>
          </div>
        </div>
        <div className="flex items-start gap-3 md:col-span-2">
          <MapPin className="w-5 h-5 text-primary-600 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900">Office</p>
            <p className="text-gray-600">CommunitySharing HQ, India</p>
          </div>
        </div>
      </div>

      {sent ? (
        <div className="p-6 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <p className="text-green-800 font-medium">Thanks! We've received your message and will get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Input label="Your Name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" />
          <Input label="Your Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="How can we help?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
          <Button type="submit" variant="primary" loading={loading}>
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </form>
      )}
    </StaticPage>
  );
};

export default Contact;