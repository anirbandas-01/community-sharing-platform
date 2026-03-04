import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/business-dashboard.css";
import Chatbot from "../Chatbot";


const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const BusinessLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load user");

      const data = await response.json();
      setUser(data.user || data);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      navigate("/login");
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "active" : ""}`} id="sidebar">
        <Link to="/" className="sidebar-logo" style={{ textDecoration: "none" }}>
          <div className="logo-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <div className="logo-text">LocalHub</div>
            <div className="logo-badge">BUSINESS</div>
          </div>
        </Link>

        <ul className="nav-menu">
          <li className="nav-section-title">Main</li>
          
          <li className="nav-item">
            <Link 
              to="/business/dashboard" 
              className={`nav-link ${isActive("/business/dashboard") ? "active" : ""}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
          </li>

          <li className="nav-item">
            <Link 
              to="/business/orders" 
              className={`nav-link ${isActive("/business/orders") ? "active" : ""}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Orders
              <span className="nav-badge">5</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link 
              to="/business/inventory" 
              className={`nav-link ${isActive("/business/inventory") ? "active" : ""}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Inventory
            </Link>
          </li>

          <li className="nav-section-title">Business</li>

          <li className="nav-item">
            <Link 
              to="/business/profile" 
              className={`nav-link ${isActive("/business/profile") ? "active" : ""}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Profile
            </Link>
          </li>

          <li className="nav-item">
            <Link 
              to="/business/enterprise" 
              className={`nav-link ${isActive("/business/enterprise") ? "active" : ""}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Register Enterprise
            </Link>
          </li>

          <li className="nav-item">
            <Link 
              to="/business/revenue" 
              className={`nav-link ${isActive("/business/revenue") ? "active" : ""}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Revenue
            </Link>
          </li>

          <li className="nav-item">
            <Link 
              to="/business/contact" 
              className={`nav-link ${isActive("/business/contact") ? "active" : ""}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </Link>
          </li>

          <li className="nav-section-title">Settings</li>

          <li className="nav-item">
            <button onClick={handleLogout} className="nav-link" style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer" }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <div className="topbar">
          <div className="topbar-left">
            <button 
              className="mobile-toggle" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="topbar-right">
            <div className="notification-wrapper">
              <button 
                className="notification-btn" 
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="notification-badge">3</span>
              </button>

              {showNotifications && (
                <div className="notification-dropdown active">
                  <div className="notification-header">
                    <h4>Notifications</h4>
                    <span className="badge" style={{ background: "var(--primary)", color: "white", fontSize: "0.75rem" }}>3 New</span>
                  </div>
                  <div className="notification-list">
                    <div className="notification-item">
                      <div className="notification-icon-box" style={{ background: "#dbeafe", color: "#1e40af" }}>
                        📦
                      </div>
                      <div className="notification-content">
                        <h5>New Order #1234</h5>
                        <p>John Doe placed a new order of ₹1,250</p>
                        <span className="notification-time">2 mins ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="user-profile">
              <div className="user-avatar">
                {user?.profile_image ? (
                  <img src={`http://127.0.0.1:8000/uploads/profiles/${user.profile_image}`} alt="Profile" />
                ) : (
                  <span>{user?.name?.charAt(0) || "U"}</span>
                )}
              </div>
              <div className="user-info">
                <div className="user-name">{user?.name || "User"}</div>
                <div className="user-role">{user?.user_type || "Business"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {children}
        </div>
      </main>
      <Chatbot />
    </>
  );
};

export default BusinessLayout;