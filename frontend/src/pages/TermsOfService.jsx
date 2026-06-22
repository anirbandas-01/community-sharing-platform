import StaticPage, { Section } from '../components/StaticPage';
import { FileText } from 'lucide-react';

const TermsOfService = () => (
  <StaticPage icon={FileText} title="Terms & Conditions" subtitle="Last updated: June 22, 2026">
    <Section title="1. Acceptance of Terms">
      <p>By creating an account or using CommunitySharing, you agree to these Terms. If you don't agree, please don't use the platform.</p>
    </Section>

    <Section title="2. Who Can Use CommunitySharing">
      <p>You must be at least 18 years old and provide accurate registration information, including a valid Aadhaar number for identity verification. Business accounts must complete enterprise verification before listing products or accessing business features.</p>
    </Section>

    <Section title="3. Account Responsibilities">
      <ul className="list-disc pl-5 space-y-1">
        <li>You are responsible for keeping your password secure and for all activity under your account</li>
        <li>You must not impersonate another person or business</li>
        <li>One account per person — admins may remove duplicate or fraudulent accounts</li>
      </ul>
    </Section>

    <Section title="4. Bookings, Orders & Payments">
      <p>Professionals set their own service prices and availability; businesses set their own product prices and stock. CommunitySharing facilitates the connection but is not a party to the agreement between residents, professionals, and businesses.</p>
      <p>Orders may be cancelled while still "Pending"; once a business marks an order "Processing" or later, cancellation is at the business's discretion. Bookings can be confirmed, rejected, or cancelled by either party until the appointment time.</p>
    </Section>

    <Section title="5. Reviews & Conduct">
      <p>Reviews must reflect a genuine experience. We may remove reviews that are abusive, fraudulent, or unrelated to the service/product. Harassment, spam, or fraudulent listings may result in account suspension.</p>
    </Section>

    <Section title="6. Business Verification">
      <p>Businesses must submit accurate registration/GST details and a real business photo. Admins reserve the right to approve, reject, or revoke enterprise status at any time if information is found to be false.</p>
    </Section>

    <Section title="7. Limitation of Liability">
      <p>CommunitySharing is a platform connecting residents, professionals, and businesses. We are not liable for the quality of services or products exchanged between users, though we will assist in resolving disputes reported through Messages or support.</p>
    </Section>

    <Section title="8. Termination">
      <p>You may delete your account at any time from Settings → Danger Zone. We may suspend or terminate accounts that violate these Terms.</p>
    </Section>

    <Section title="9. Changes to These Terms">
      <p>We may update these Terms periodically. Continued use of the platform after changes means you accept the updated Terms.</p>
    </Section>

    <Section title="10. Contact">
      <p>Questions about these Terms? Reach us at <a href="mailto:support@communitysharing.com" className="text-primary-600 hover:underline">support@communitysharing.com</a>.</p>
    </Section>
  </StaticPage>
);

export default TermsOfService;