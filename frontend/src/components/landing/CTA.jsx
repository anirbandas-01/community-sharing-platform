import { Link } from "react-router-dom";

const CTA = () => (
  <section className="cta">
    <div className="cta-container">
      <div className="cta-box">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Join Your Local Community?</h2>
          <p className="cta-description">
            Start discovering, shopping, and connecting with your neighbors
            today.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-white btn-large">
              Create Free Account
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
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CTA;