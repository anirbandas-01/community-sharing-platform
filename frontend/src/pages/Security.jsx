import StaticPage, { Section } from '../components/StaticPage';
import { Lock } from 'lucide-react';

const Security = () => (
  <StaticPage icon={Lock} title="Security" subtitle="How we protect your account and data">
    <Section title="Account Protection">
      <ul className="list-disc pl-5 space-y-1">
        <li>Passwords are hashed (never stored in plain text) and authentication uses secure API tokens</li>
        <li>Changing your password automatically signs you out of every other active session</li>
        <li>OTP (one-time password) verification is required for registration and password resets, sent to your registered email and valid for 10 minutes</li>
      </ul>
    </Section>

    <Section title="Business Verification">
      <p>Every business on CommunitySharing goes through manual admin review — registration number, contact details, and a business photo are checked before a store can list products. You'll see a "Verified Business" badge once approved.</p>
    </Section>

    <Section title="Data Storage">
      <p>Profile photos and business documents are stored via a secure cloud storage provider. Sensitive identity data (Aadhaar number) is used strictly for verification and is never shown to other users.</p>
    </Section>

    <Section title="Reporting a Security Issue">
      <p>If you discover a vulnerability or suspicious activity on your account, please email <a href="mailto:support@communitysharing.com" className="text-primary-600 hover:underline">support@communitysharing.com</a> immediately, or use the in-app chatbot's "Message Support" option to reach our team.</p>
    </Section>

    <Section title="Tips to Stay Safe">
      <ul className="list-disc pl-5 space-y-1">
        <li>Never share your OTP or password with anyone, including someone claiming to be CommunitySharing staff</li>
        <li>Always confirm bookings and payments within the app rather than off-platform</li>
        <li>Report suspicious profiles or listings via Messages or by contacting support</li>
      </ul>
    </Section>
  </StaticPage>
);

export default Security;