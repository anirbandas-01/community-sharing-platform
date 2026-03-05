import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ResidentLayout from "../../components/resident/ResidentLayout";

const ResidentDashboard = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      // Load user profile
      const userRes = await fetch(`${API_BASE}/user/profile`, { headers });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user || userData);
      }

      // Load appointments
      const apptRes = await fetch(`${API_BASE}/resident/appointments`, { headers });
      if (apptRes.ok) {
        const apptData = await apptRes.json();
        const appts = apptData.appointments || apptData.data || [];
        setAppointments(appts);

        // Calculate stats
        setStats({
          total: appts.length,
          active: appts.filter((a) => a.status === "confirmed").length,
          pending: appts.filter((a) => a.status === "pending").length,
          completed: appts.filter((a) => a.status === "completed").length,
        });
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingAppointments = () => {
    return appointments
      .filter((a) => new Date(a.appointment_time) > new Date())
      .sort((a, b) => new Date(a.appointment_time) - new Date(b.appointment_time))
      .slice(0, 5);
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

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  if (loading) {
    return (
      <ResidentLayout>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </ResidentLayout>
    );
  }

  const upcomingAppointments = getUpcomingAppointments();

  return (
    <ResidentLayout>
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, {user?.name?.split(" ")[0] || "Resident"}! 👋
        </h1>
        <p className="page-subtitle">
          Here's what's happening with your bookings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Total Bookings</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-icon blue">
              <i className="fas fa-calendar-check"></i>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Active Bookings</div>
              <div className="stat-value">{stats.active}</div>
            </div>
            <div className="stat-icon green">
              <i className="fas fa-clock"></i>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Pending Requests</div>
              <div className="stat-value">{stats.pending}</div>
            </div>
            <div className="stat-icon orange">
              <i className="fas fa-hourglass-half"></i>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Completed</div>
              <div className="stat-value">{stats.completed}</div>
            </div>
            <div className="stat-icon purple">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="section">
        <div className="section-header-row">
          <h2 className="section-title">Upcoming Appointments</h2>
          <Link to="/resident/bookings" className="btn btn-outline">
            View All
          </Link>
        </div>
        <div className="appointment-list">
          {upcomingAppointments.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-calendar-times"></i>
              <p>No upcoming appointments</p>
              <Link to="/resident/services" className="btn btn-primary">
                Find Professionals
              </Link>
            </div>
          ) : (
            upcomingAppointments.map((apt) => {
              const professional = apt.professional || {};
              const { date, time } = formatDateTime(apt.appointment_time);
              return (
                <div key={apt.id} className="appointment-item">
                  <div className="appointment-info">
                    <div className="appointment-avatar">
                      {getInitials(professional.name)}
                    </div>
                    <div className="appointment-details">
                      <h4>{professional.name || "Professional"}</h4>
                      <p>
                        <i className="fas fa-calendar"></i> {date} at {time}
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${apt.status}`}>{apt.status}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/resident/services" className="btn btn-primary">
            <i className="fas fa-search"></i> Find Professionals
          </Link>
          <Link to="/resident/bookings" className="btn btn-outline">
            <i className="fas fa-calendar"></i> View Bookings
          </Link>
          <Link to="/resident/profile" className="btn btn-outline">
            <i className="fas fa-user"></i> Edit Profile
          </Link>
        </div>
      </div>
    </ResidentLayout>
  );
};

export default ResidentDashboard;