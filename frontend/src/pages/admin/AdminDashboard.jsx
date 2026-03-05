import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import "../../styles/admin-dashboard.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentUsers(data.recent_users);
        setUserGrowth(data.user_growth);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back! Here's what's happening with your platform.</p>
          </div>
          <button className="refresh-btn" onClick={fetchDashboardData}>
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-content">
              <h3>{stats?.total_users || 0}</h3>
              <p>Total Users</p>
              <div className="stat-badge">
                <i className="fas fa-arrow-up"></i>
                +{stats?.new_users_week || 0} this week
              </div>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">
              <i className="fas fa-user"></i>
            </div>
            <div className="stat-content">
              <h3>{stats?.residents || 0}</h3>
              <p>Residents</p>
              <div className="stat-badge">Active users</div>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <div className="stat-content">
              <h3>{stats?.professionals || 0}</h3>
              <p>Professionals</p>
              <div className="stat-badge">Service providers</div>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">
              <i className="fas fa-building"></i>
            </div>
            <div className="stat-content">
              <h3>{stats?.businesses || 0}</h3>
              <p>Businesses</p>
              <div className="stat-badge">Registered</div>
            </div>
          </div>

          <div className="stat-card teal">
            <div className="stat-icon">
              <i className="fas fa-users-cog"></i>
            </div>
            <div className="stat-content">
              <h3>{stats?.total_communities || 0}</h3>
              <p>Communities</p>
              <div className="stat-badge">{stats?.active_communities || 0} Active</div>
            </div>
          </div>

          <div className="stat-card red">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <h3>{stats?.pending_verifications || 0}</h3>
              <p>Pending Verifications</p>
              <div className="stat-badge">Requires action</div>
            </div>
          </div>

          <div className="stat-card indigo">
            <div className="stat-icon">
              <i className="fas fa-concierge-bell"></i>
            </div>
            <div className="stat-content">
              <h3>{stats?.total_services || 0}</h3>
              <p>Services Listed</p>
              <div className="stat-badge">Available</div>
            </div>
          </div>

          <div className="stat-card pink">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-content">
              <h3>{stats?.total_appointments || 0}</h3>
              <p>Total Appointments</p>
              <div className="stat-badge">All time</div>
            </div>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="dashboard-row">
          <div className="chart-card">
            <div className="card-header">
              <h3>User Growth (Last 7 Days)</h3>
              <span className="badge success">Trending Up</span>
            </div>
            <div className="chart-container">
              {userGrowth.length > 0 ? (
                <div className="simple-chart">
                  {userGrowth.map((day, index) => (
                    <div key={index} className="chart-bar">
                      <div
                        className="bar"
                        style={{
                          height: `${(day.count / Math.max(...userGrowth.map(d => d.count))) * 100}%`,
                        }}
                      >
                        <span className="bar-value">{day.count}</span>
                      </div>
                      <span className="bar-label">{day.date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No data available</p>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="recent-users-card">
            <div className="card-header">
              <h3>Recent Users</h3>
              <a href="/admin/users" className="view-all">View All →</a>
            </div>
            <div className="users-list">
              {recentUsers.length > 0 ? (
                recentUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="user-item">
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                    <span className={`user-badge ${user.user_type}`}>
                      {user.user_type}
                    </span>
                  </div>
                ))
              ) : (
                <p className="no-data">No recent users</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <a href="/admin/users" className="action-card">
              <i className="fas fa-users"></i>
              <span>Manage Users</span>
            </a>
            <a href="/admin/communities" className="action-card">
              <i className="fas fa-users-cog"></i>
              <span>Manage Communities</span>
            </a>
            <a href="/admin/verifications" className="action-card">
              <i className="fas fa-check-circle"></i>
              <span>Verifications</span>
            </a>
            <a href="/admin/analytics" className="action-card">
              <i className="fas fa-chart-line"></i>
              <span>View Analytics</span>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;