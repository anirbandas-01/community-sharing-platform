import { useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("navbar");
      if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="navbar" id="navbar">
      <div className="nav-container">
        <Link to="/" className="logo-container">
          <div className="logo-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <span className="logo-text">LocalHub</span>
        </Link>

        <ul className="nav-links">
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#how-it-works">How It Works</a>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>

        <div className="nav-buttons">
          <Link to="/login" className="btn btn-login">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>

        <button className="mobile-menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;