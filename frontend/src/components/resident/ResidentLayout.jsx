import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/resident-dashboard.css";
import Chatbot from "../Chatbot";


const ResidentLayout = ({ children }) => {
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

      // ✅ FIX: Use correct API URL
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
      const response = await fetch(`${API_BASE}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load profile");

      const data = await response.json();
      console.log("✅ User data loaded:", data); // ✅ Debug log
      setUser(data.user || data);
    } catch (error) {
      console.error("❌ Error loading user:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to logout?")) return;

    try {
      const token = localStorage.getItem("token");
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
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const getInitials = (name) => {
    if (!name) return "R";
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
            <span>{user?.name || "Resident"}</span>
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <Link
          to="/resident/dashboard"
          className={`sidebar-item ${isActive("/resident/dashboard") ? "active" : ""}`}
        >
          <i className="fas fa-home"></i>
          Dashboard
        </Link>
        <Link
          to="/resident/services"
          className={`sidebar-item ${isActive("/resident/services") ? "active" : ""}`}
        >
          <i className="fas fa-search"></i>
          Find Services
        </Link>
        <Link
          to="/resident/bookings"
          className={`sidebar-item ${isActive("/resident/bookings") ? "active" : ""}`}
        >
          <i className="fas fa-calendar-check"></i>
          My Bookings
        </Link>
        <Link
          to="/resident/messages"
          className={`sidebar-item ${isActive("/resident/messages") ? "active" : ""}`}
        >
          <i className="fas fa-comments"></i>
          Messages
        </Link>
        <Link
          to="/resident/profile"
          className={`sidebar-item ${isActive("/resident/profile") ? "active" : ""}`}
        >
          <i className="fas fa-user"></i>
          My Profile
        </Link>
      </aside>

      {/* Main Content */}
      <main className="main-content">{children}</main>
      <Chatbot />
    </div>
  );
};

export default ResidentLayout;