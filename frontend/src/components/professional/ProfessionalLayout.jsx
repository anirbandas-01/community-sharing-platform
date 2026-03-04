import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/professional-dashboard.css";
import Chatbot from "../Chatbot";


const ProfessionalLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
      const response = await fetch(`${API_BASE}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load profile");

      const data = await response.json();
      setUser(data.user || data);
    } catch (error) {
      console.error("Error loading user:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to logout?")) return;

    try {
      const token = localStorage.getItem("auth_token");
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
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

  const getInitials = (name) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path) => location.pathname === path;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Top Navigation */}
      <nav className="top-nav">
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="logo">
          <i className="fas fa-network-wired"></i>
          <span>LocalHub</span>
        </div>
        <div className="nav-right">
          <div className="user-menu" onClick={handleLogout}>
            <div className="user-avatar">{getInitials(user?.name)}</div>
            <span>{user?.name || "Professional"}</span>
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <Link
          to="/professional/dashboard"
          className={`sidebar-item ${isActive("/professional/dashboard") ? "active" : ""}`}
        >
          <i className="fas fa-th-large"></i>
          Dashboard
        </Link>
        <Link
          to="/professional/services"
          className={`sidebar-item ${isActive("/professional/services") ? "active" : ""}`}
        >
          <i className="fas fa-briefcase"></i>
          My Services
        </Link>
        <Link
          to="/professional/appointments"
          className={`sidebar-item ${isActive("/professional/appointments") ? "active" : ""}`}
        >
          <i className="fas fa-calendar-check"></i>
          Appointments
        </Link>
        <Link
          to="/professional/earnings"
          className={`sidebar-item ${isActive("/professional/earnings") ? "active" : ""}`}
        >
          <i className="fas fa-dollar-sign"></i>
          My Earnings
        </Link>
        <Link
          to="/professional/reviews"
          className={`sidebar-item ${isActive("/professional/reviews") ? "active" : ""}`}
        >
          <i className="fas fa-star"></i>
          Reviews & Ratings
        </Link>
        <Link
          to="/professional/messages"
          className={`sidebar-item ${isActive("/professional/messages") ? "active" : ""}`}
        >
          <i className="fas fa-comments"></i>
          Messages
        </Link>
        <Link
          to="/professional/settings"
          className={`sidebar-item ${isActive("/professional/settings") ? "active" : ""}`}
        >
          <i className="fas fa-cog"></i>
          Settings
        </Link>
      </aside>

      {/* Main Content */}
      <main className="main-content">{children}</main>
      <Chatbot />
    </div>
  );
};

export default ProfessionalLayout;