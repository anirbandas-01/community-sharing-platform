import { useState, useEffect } from "react";
import ResidentLayout from "../../components/resident/ResidentLayout";

const ResidentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/resident/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.appointments || data.data || []);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    switch (filter) {
      case "all":
        return bookings;
      case "upcoming":
        return bookings.filter(
          (b) =>
            new Date(b.appointment_time) > new Date() && b.status !== "cancelled"
        );
      case "pending":
        return bookings.filter((b) => b.status === "pending");
      case "completed":
        return bookings.filter((b) => b.status === "completed");
      case "cancelled":
        return bookings.filter((b) => b.status === "cancelled");
      default:
        return bookings;
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `/api/resident/appointments/${bookingId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to cancel booking");

      alert("Booking cancelled successfully");
      loadBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
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

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const getStatusMessage = (booking) => {
    switch (booking.status) {
      case "pending":
        return {
          text: "Waiting for professional to accept",
          icon: "clock",
          color: "#fef3c7",
          textColor: "#92400e",
        };
      case "confirmed":
        return {
          text: "Confirmed! Professional will contact you soon",
          icon: "check-circle",
          color: "#d1fae5",
          textColor: "#065f46",
        };
      case "cancelled":
        return {
          text: "This booking was cancelled",
          icon: "times-circle",
          color: "#fee2e2",
          textColor: "#991b1b",
        };
      default:
        return null;
    }
  };

  const filteredBookings = getFilteredBookings();

  return (
    <ResidentLayout>
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">
          Manage your appointments and service bookings
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="tabs">
        {["all", "upcoming", "pending", "completed", "cancelled"].map((tab) => (
          <button
            key={tab}
            className={`tab ${filter === tab ? "active" : ""}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-calendar-times"></i>
          <h3>No bookings found</h3>
          <p>
            {filter === "all"
              ? "You haven't made any bookings yet"
              : "Try adjusting your filters"}
          </p>
        </div>
      ) : (
        <div className="booking-list">
          {filteredBookings.map((booking) => {
            const professional = booking.professional || {};
            const service = booking.service || {};
            const { date, time } = formatDateTime(booking.appointment_time);
            const canCancel =
              (booking.status === "pending" || booking.status === "confirmed") &&
              new Date(booking.appointment_time) > new Date();
            const statusMsg = getStatusMessage(booking);

            return (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-info">
                    <div className="booking-avatar">
                      {getInitials(professional.name)}
                    </div>
                    <div className="booking-details">
                      <h3>{professional.name || "Professional"}</h3>
                      <p>{service.name || "Service"}</p>
                    </div>
                  </div>
                  <span className={`badge ${booking.status}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-meta">
                  <div className="meta-item">
                    <div className="meta-label">Date & Time</div>
                    <div className="meta-value">
                      <i className="fas fa-calendar"></i> {date} at {time}
                    </div>
                  </div>
                  {booking.total_price && (
                    <div className="meta-item">
                      <div className="meta-label">Amount</div>
                      <div className="meta-value">₹{booking.total_price}</div>
                    </div>
                  )}
                  {booking.notes && (
                    <div className="meta-item">
                      <div className="meta-label">Notes</div>
                      <div className="meta-value">{booking.notes}</div>
                    </div>
                  )}
                </div>

                {statusMsg && (
                  <div
                    className="status-message"
                    style={{
                      background: statusMsg.color,
                      color: statusMsg.textColor,
                    }}
                  >
                    <i className={`fas fa-${statusMsg.icon}`}></i> {statusMsg.text}
                  </div>
                )}

                <div className="booking-actions">
                  {canCancel && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="btn btn-danger btn-sm"
                    >
                      <i className="fas fa-times"></i> Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ResidentLayout>
  );
};

export default ResidentBookings;