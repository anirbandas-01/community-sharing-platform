import StaticPage, { Section } from '../components/StaticPage';
import { Users } from 'lucide-react';

const About = () => (
  <StaticPage icon={Users} title="About CommunitySharing">
    <Section title="Our Mission">
      <p>CommunitySharing connects residents, local professionals, and neighborhood businesses on one platform — so finding a trusted plumber, joining a local group, or buying from a nearby store is as easy as a few taps.</p>
    </Section>

    <Section title="What We Offer">
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Communities</strong> — join or create local groups to connect with neighbors</li>
        <li><strong>Professionals</strong> — book verified plumbers, electricians, cleaners, and more</li>
        <li><strong>Local Shop</strong> — browse and order from approved nearby businesses</li>
        <li><strong>Messaging</strong> — direct chats and community group chats, all in one place</li>
        <li><strong>Reviews</strong> — transparent ratings for professionals, products, and stores</li>
      </ul>
    </Section>

    <Section title="Why Verification Matters">
      <p>Every business goes through a manual admin review before they can sell — checking registration details and contact information — so you can shop and book with confidence.</p>
    </Section>

    <Section title="Get in Touch">
      <p>Have feedback or a partnership idea? Visit our <a href="/contact" className="text-primary-600 hover:underline">Contact page</a> or email <a href="mailto:support@communitysharing.com" className="text-primary-600 hover:underline">support@communitysharing.com</a>.</p>
    </Section>
  </StaticPage>
);

export default About;