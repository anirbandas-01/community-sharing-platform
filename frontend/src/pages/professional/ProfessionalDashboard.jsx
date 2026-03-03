import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProfessionalLayout from "../../components/professional/ProfessionalLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const ProfessionalDashboard = () => {
  const [stats, setStats] = useState({
    earnings: 0,
    appointments: 0,
    rating: 0,
    services: 0,
  });
  const [appointments, setAppointments] = useState([]);
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

      const response = await fetch(`${API_BASE}/professional/dashboard`, { headers });
      if (response.ok) {
        const data = await response.json();
        setStats({
          earnings: data.stats?.total_earnings || 0,
          appointments: data.stats?.upcoming_appointments || 0,
          rating: data.stats?.average_rating || 0,
          services: data.stats?.active_services || 0,
        });
        setAppointments(data.appointments?.data || []);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "C";
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
      <ProfessionalLayout>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout>
      <div className="page-header">
        <h1 className="page-title">Welcome back! 👋</h1>
        <p className="page-subtitle">Here's what's happening with your business</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Total Earnings</div>
              <div className="stat-value">₹{stats.earnings.toLocaleString()}</div>
            </div>
            <div className="stat-icon green">
              <i className="fas fa-rupee-sign"></i>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Upcoming Appointments</div>
              <div className="stat-value">{stats.appointments}</div>
            </div>
            <div className="stat-icon blue">
              <i className="fas fa-calendar-check"></i>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Average Rating</div>
              <div className="stat-value">{stats.rating.toFixed(1)}</div>
            </div>
            <div className="stat-icon purple">
              <i className="fas fa-star"></i>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Active Services</div>
              <div className="stat-value">{stats.services}</div>
            </div>
            <div className="stat-icon orange">
              <i className="fas fa-briefcase"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="section">
        <div className="section-header-row">
          <h2 className="section-title">Upcoming Appointments</h2>
          <Link to="/professional/appointments" className="btn btn-outline">
            View All
          </Link>
        </div>
        <div className="appointment-list">
          {appointments.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-calendar-times"></i>
              <p>No upcoming appointments</p>
            </div>
          ) : (
            appointments.slice(0, 5).map((apt) => {
              const { date, time } = formatDateTime(apt.appointment_time);
              return (
                <div key={apt.id} className="appointment-item">
                  <div className="appointment-info">
                    <div className="appointment-avatar">
                      {getInitials(apt.user?.name)}
                    </div>
                    <div className="appointment-details">
                      <h4>{apt.user?.name || "Client"}</h4>
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
          <Link to="/professional/services" className="btn btn-primary">
            <i className="fas fa-plus"></i> Add Service
          </Link>
          <Link to="/professional/appointments" className="btn btn-outline">
            <i className="fas fa-calendar"></i> View Appointments
          </Link>
          <Link to="/professional/settings" className="btn btn-outline">
            <i className="fas fa-cog"></i> Settings
          </Link>
        </div>
      </div>
    </ProfessionalLayout>
  );
};

export default ProfessionalDashboard;