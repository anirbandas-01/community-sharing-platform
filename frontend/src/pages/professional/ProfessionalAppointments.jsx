import { useState, useEffect } from "react";
import ProfessionalLayout from "../../components/professional/ProfessionalLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const ProfessionalAppointments = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/professional/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load appointments");

      const data = await response.json();
      setAllAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading appointments:", error);
      setAllAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = (filter) => {
    setCurrentFilter(filter);
  };

  const getFilteredAppointments = () => {
    switch (currentFilter) {
      case "all":
        return allAppointments;
      case "pending":
        return allAppointments.filter((a) => a.status === "pending");
      case "confirmed":
        return allAppointments.filter((a) => a.status === "confirmed");
      case "completed":
        return allAppointments.filter((a) => a.status === "completed");
      case "cancelled":
        return allAppointments.filter((a) => a.status === "cancelled");
      default:
        return allAppointments;
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    if (!confirm(`Are you sure you want to ${status} this appointment?`)) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/professional/appointments/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update appointment");

      alert(`Appointment ${status} successfully!`);
      loadAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert(`Failed to ${status} appointment. Please try again.`);
    }
  };

  const acceptAppointment = async (id) => {
    if (!confirm("Do you want to accept this appointment?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/professional/appointments/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status: "confirmed" }),
      });

      if (!response.ok) throw new Error("Failed to accept appointment");

      alert("Appointment accepted successfully! ✅");
      loadAppointments();
    } catch (error) {
      console.error("Error accepting appointment:", error);
      alert("Failed to accept appointment. Please try again.");
    }
  };

  const rejectAppointment = async (id) => {
    const reason = prompt("Please provide a reason for rejection (optional):");

    if (!confirm("Are you sure you want to reject this appointment?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/professional/appointments/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
          notes: reason ? `Rejected: ${reason}` : "Rejected by professional",
        }),
      });

      if (!response.ok) throw new Error("Failed to reject appointment");

      alert("Appointment rejected");
      loadAppointments();
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      alert("Failed to reject appointment. Please try again.");
    }
  };

  const viewAppointmentDetails = (id) => {
    const appointment = allAppointments.find((apt) => apt.id === id);

    if (!appointment) {
      alert("Appointment not found");
      return;
    }

    const details = [
      `Client: ${appointment.user?.name || "N/A"}`,
      `Service: ${appointment.service?.name || "N/A"}`,
      `Date: ${new Date(appointment.appointment_time).toLocaleDateString()}`,
      `Time: ${new Date(appointment.appointment_time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      `Price: ₹${appointment.total_price || "0"}`,
      `Status: ${appointment.status?.toUpperCase()}`,
      appointment.notes ? `Notes: ${appointment.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    alert(`Appointment Details:\n\n${details}`);
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

  const getActionButtons = (appointment) => {
    const { id, status } = appointment;

    if (status === "pending") {
      return (
        <>
          <button
            onClick={() => acceptAppointment(id)}
            className="btn btn-primary btn-sm"
          >
            <i className="fas fa-check"></i> Accept
          </button>
          <button
            onClick={() => rejectAppointment(id)}
            className="btn btn-danger btn-sm"
          >
            <i className="fas fa-times"></i> Reject
          </button>
        </>
      );
    } else if (status === "confirmed") {
      return (
        <>
          <button
            onClick={() => updateAppointmentStatus(id, "completed")}
            className="btn btn-primary btn-sm"
          >
            <i className="fas fa-check-circle"></i> Mark Complete
          </button>
          <button
            onClick={() => updateAppointmentStatus(id, "cancelled")}
            className="btn btn-outline btn-sm"
          >
            <i className="fas fa-ban"></i> Cancel
          </button>
        </>
      );
    }

    return null;
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <ProfessionalLayout>
      <div className="page-header">
        <h1 className="page-title">Appointments</h1>
        <p className="page-subtitle">Manage your appointments and bookings</p>
      </div>

      {/* Filter Tabs */}
      <div className="tabs">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((filter) => (
          <button
            key={filter}
            className={`tab ${currentFilter === filter ? "active" : ""}`}
            onClick={() => filterAppointments(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-calendar-times"></i>
          <h3>No Appointments Found</h3>
          <p>
            {currentFilter === "all"
              ? "You don't have any appointments yet"
              : `No ${currentFilter} appointments`}
          </p>
        </div>
      ) : (
        <div className="booking-list">
          {filteredAppointments.map((appointment) => {
            const { date, time } = formatDateTime(appointment.appointment_time);
            const client = appointment.user || {};
            const service = appointment.service || {};

            return (
              <div key={appointment.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-info">
                    <div className="booking-avatar">{getInitials(client.name)}</div>
                    <div className="booking-details">
                      <h3>{client.name || "Client"}</h3>
                      <p>{service.name || "Service"}</p>
                    </div>
                  </div>
                  <span className={`badge ${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="booking-meta">
                  <div className="meta-item">
                    <div className="meta-label">Date & Time</div>
                    <div className="meta-value">
                      <i className="fas fa-calendar"></i> {date} at {time}
                    </div>
                  </div>
                  {appointment.total_price && (
                    <div className="meta-item">
                      <div className="meta-label">Amount</div>
                      <div className="meta-value">₹{appointment.total_price}</div>
                    </div>
                  )}
                  {appointment.notes && (
                    <div className="meta-item">
                      <div className="meta-label">Notes</div>
                      <div className="meta-value">{appointment.notes}</div>
                    </div>
                  )}
                </div>

                <div className="booking-actions">
                  {getActionButtons(appointment)}
                  <button
                    onClick={() => viewAppointmentDetails(appointment.id)}
                    className="btn btn-outline btn-sm"
                  >
                    <i className="fas fa-eye"></i> View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ProfessionalLayout>
  );
};

export default ProfessionalAppointments;