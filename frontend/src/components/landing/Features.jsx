const Features = () => (
  <section className="features" id="features">
    <div className="features-container">
      <div className="section-header">
        <h2 className="section-title">Everything Your Community Needs</h2>
        <p className="section-description">
          A comprehensive platform designed to bring your neighborhood together
        </p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📰</div>
          <h3 className="feature-title">Local News Feed</h3>
          <p className="feature-description">
            Stay updated with what's happening in your neighborhood
          </p>
          <a href="#" className="feature-link">
            Learn more
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🛍️</div>
          <h3 className="feature-title">Buy Local Products</h3>
          <p className="feature-description">
            Discover and purchase products from nearby sellers
          </p>
          <a href="#" className="feature-link">
            Learn more
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏪</div>
          <h3 className="feature-title">List Your Business</h3>
          <p className="feature-description">
            Showcase your products and services to the community
          </p>
          <a href="#" className="feature-link">
            Learn more
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default Features;