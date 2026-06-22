import StaticPage from '../components/StaticPage';
import { Newspaper } from 'lucide-react';

const Blog = () => (
  <StaticPage icon={Newspaper} title="Blog">
    <div className="text-center py-10">
      <p className="text-gray-600 text-lg mb-2">Our blog is coming soon! 📝</p>
      <p className="text-gray-400 text-sm">
        We're working on articles about local community building, professional tips, and platform updates.
        Check back soon, or follow updates via your account notifications.
      </p>
    </div>
  </StaticPage>
);

export default Blog;