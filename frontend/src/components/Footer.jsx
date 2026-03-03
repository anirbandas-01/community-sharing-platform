import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>LocalHub</h3>
          <p>Connecting communities, one neighborhood at a time.</p>
        </div>
        <div className="footer-section">
          <h4>Product</h4>
          <ul className="footer-links">
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#">Pricing</a>
            </li>
            <li>
              <a href="#">For Business</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <ul className="footer-links">
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <ul className="footer-links">
            <li>
              <a href="#">Privacy</a>
            </li>
            <li>
              <a href="#">Terms</a>
            </li>
            <li>
              <a href="#">Security</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 LocalHub. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;