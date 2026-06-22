import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-sm text-gray-400 mb-10">Last updated: June 22, 2026</p>

          <Section title="1. Information We Collect">
            <p>When you create an account on CommunitySharing, we collect information you provide directly, including your name, email address, phone number, address, city, state, Aadhaar number (for identity verification), and profile photo.</p>
            <p>For Business users, we additionally collect company name, registration/GST number, industry type, revenue range, and a business photo as part of enterprise verification.</p>
            <p>We also collect content you create on the platform — bookings, messages, community posts, reviews, and orders.</p>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-1">
              <li>To create and manage your account and verify your identity</li>
              <li>To connect residents with professionals and local businesses</li>
              <li>To process bookings, orders, and payments</li>
              <li>To send notifications about bookings, messages, orders, and community activity</li>
              <li>To review and approve business enterprise applications</li>
              <li>To improve our services and respond to support requests</li>
            </ul>
          </Section>

          <Section title="3. Information Sharing">
            <p>We do not sell your personal information. We share limited information only as needed for the platform to function:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your name, profile photo, and relevant details are visible to other users you interact with (e.g. a professional you book, a business you order from, members of communities you join)</li>
              <li>Aadhaar numbers are used solely for verification and are never displayed publicly</li>
              <li>We may disclose information if required by law</li>
            </ul>
          </Section>

          <Section title="4. Data Storage & Security">
            <p>Your data is stored on secure servers. Profile photos and business documents are stored via our cloud storage provider. Passwords are hashed and never stored in plain text. We use token-based authentication, and changing your password automatically signs you out of all other sessions.</p>
          </Section>

          <Section title="5. Your Rights & Choices">
            <ul className="list-disc pl-5 space-y-1">
              <li>You can view and edit your profile information at any time from your account settings</li>
              <li>You can control notification preferences in Settings → Notifications</li>
              <li>You can permanently delete your account from Settings → Danger Zone, which removes your bookings, reviews, messages, and community memberships</li>
            </ul>
          </Section>

          <Section title="6. Cookies & Local Storage">
            <p>We use browser local storage to keep you signed in (authentication token) and to remember your interface preferences, such as dark mode. We do not use third-party advertising cookies.</p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>CommunitySharing is not intended for users under 18. We do not knowingly collect data from minors.</p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>We may update this policy from time to time. Material changes will be communicated via email or an in-app notification.</p>
          </Section>

          <Section title="9. Contact Us">
            <p>If you have questions about this policy or your data, contact us at <a href="mailto:support@communitysharing.com" className="text-primary-600 hover:underline">support@communitysharing.com</a>.</p>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;