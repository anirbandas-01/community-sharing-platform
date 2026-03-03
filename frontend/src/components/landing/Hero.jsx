import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero">
      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="hero-content">
        <div className="hero-text">
          <div className="badge">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span className="badge-text">Your Local Marketplace</span>
          </div>
          <h1 className="hero-title">
            <span className="title-dark">Connect with</span>
            <br />
            <span className="title-gradient">Your Community</span>
          </h1>
          <p className="hero-description">
            Discover local news, shop from nearby businesses, and grow your
            enterprise—all in one vibrant marketplace tailored to your
            neighborhood.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-large">
              <span>Start Exploring</span>
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
            </Link>
            <a href="#business" className="btn btn-outline btn-large">
              List Your Business
            </a>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
            alt="Local marketplace"
            className="hero-img"
          />
          <div className="hero-img-decoration"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;