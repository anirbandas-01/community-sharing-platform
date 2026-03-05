import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/admin-dashboard.css";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user_type");
    if (userData === "admin") {
      setUser({ name: "Admin", email: "admin@localhub.com" });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_type");
    navigate("/admin/login");
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: "fas fa-th-large", label: "Dashboard" },
    { path: "/admin/users", icon: "fas fa-users", label: "Users" },
    { path: "/admin/communities", icon: "fas fa-users-cog", label: "Communities" },
    { path: "/admin/verifications", icon: "fas fa-check-circle", label: "Verifications", badge: 0 },
    { path: "/admin/analytics", icon: "fas fa-chart-line", label: "Analytics" },
    { path: "/admin/settings", icon: "fas fa-cog", label: "Settings" },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-shield-alt"></i>
            {sidebarOpen && <span>Admin Panel</span>}
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <i className={item.icon}></i>
              {sidebarOpen && <span>{item.label}</span>}
              {item.badge !== undefined && item.badge > 0 && sidebarOpen && (
                <span className="badge">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className="topbar-right">
            <button className="notification-btn">
              <i className="fas fa-bell"></i>
              <span className="notification-dot"></span>
            </button>

            <div className="admin-user">
              <div className="user-avatar">A</div>
              <div className="user-info">
                <span className="user-name">{user?.name || "Admin"}</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;