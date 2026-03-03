import { useState, useEffect } from "react";
import ResidentLayout from "../../components/resident/ResidentLayout";

const ResidentServices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [services, setServices] = useState([]);
  const [bookingData, setBookingData] = useState({
    service_id: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
    total_price: "",
  });

  const searchProfessionals = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search term");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `/api/search/professionals?query=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setProfessionals(data.data || []);
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchProfessionals();
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setProfessionals([]);
  };

  const openBookingModal = async (professional) => {
    setSelectedProfessional(professional);
    setShowModal(true);

    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];
    document.getElementById("appointment_date").min = minDate;

    // Load professional's services
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `/api/professional/services?professional_id=${professional.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setServices(data.services || data.data || []);
      }
    } catch (error) {
      console.error("Error loading services:", error);
    }

    // Set default price if available
    const profile = professional.professional_profile || {};
    const defaultPrice = profile.hourly_rate || profile.consultation_fee;
    if (defaultPrice) {
      setBookingData((prev) => ({ ...prev, total_price: defaultPrice }));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProfessional(null);
    setServices([]);
    setBookingData({
      service_id: "",
      appointment_date: "",
      appointment_time: "",
      notes: "",
      total_price: "",
    });
  };

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setBookingData((prev) => ({ ...prev, service_id: serviceId }));

    if (serviceId) {
      const selected = services.find((s) => s.id === parseInt(serviceId));
      if (selected) {
        setBookingData((prev) => ({ ...prev, total_price: selected.price }));
      }
    }
  };

  const submitBooking = async (e) => {
    e.preventDefault();

    const payload = {
      professional_id: selectedProfessional.id,
      service_id: bookingData.service_id ? parseInt(bookingData.service_id) : null,
      appointment_time: `${bookingData.appointment_date} ${bookingData.appointment_time}`,
      notes: bookingData.notes,
      total_price: bookingData.total_price || null,
    };

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/resident/appointments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Booking failed");
      }

      alert("Appointment booked successfully! 🎉");
      closeModal();
      window.location.href = "/resident/bookings";
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to create booking: " + error.message);
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

  return (
    <ResidentLayout>
      <div className="page-header">
        <h1 className="page-title">Find Professional Services</h1>
        <p className="page-subtitle">
          Search for electricians, plumbers, doctors, and more in your area
        </p>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Search for electrician, plumber, doctor, carpenter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={searchProfessionals} className="btn btn-primary">
            <i className="fas fa-search"></i> Search
          </button>
          <button onClick={resetSearch} className="btn btn-outline">
            <i className="fas fa-redo"></i> Reset
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="results-container">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Searching for professionals...</p>
          </div>
        ) : professionals.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-search"></i>
            <h3>Search for Professionals</h3>
            <p>
              Enter a service type in the search box above to find professionals
              near you
            </p>
          </div>
        ) : (
          <div className="professionals-grid">
            {professionals.map((pro) => {
              const profile = pro.professional_profile || {};
              return (
                <div key={pro.id} className="professional-card">
                  <div className="pro-header">
                    <div className="pro-avatar">{getInitials(pro.name)}</div>
                    <div className="pro-info">
                      <h3>{pro.name || "Professional"}</h3>
                      <div className="pro-specialization">
                        <i className="fas fa-briefcase"></i>{" "}
                        {profile.specialization || "Service Provider"}
                      </div>
                      <div className="pro-location">
                        <i className="fas fa-map-marker-alt"></i>{" "}
                        {pro.city || "Location not specified"}
                      </div>
                    </div>
                  </div>

                  <div className="pro-details">
                    <div className="detail-item">
                      <div className="detail-label">Experience</div>
                      <div className="detail-value">
                        {profile.experience_years || 0} years
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Rate</div>
                      <div className="detail-value">
                        ₹
                        {profile.hourly_rate ||
                          profile.consultation_fee ||
                          "N/A"}
                        {profile.hourly_rate ? "/hr" : ""}
                      </div>
                    </div>
                  </div>

                  {profile.bio && <div className="pro-bio">{profile.bio}</div>}

                  <div className="pro-actions">
                    <button
                      onClick={() => openBookingModal(pro)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <i className="fas fa-calendar-plus"></i> Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showModal && selectedProfessional && (
        <div className="modal-overlay active" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Book Appointment</h2>
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={submitBooking}>
              <div className="modal-body">
                {/* Professional Info */}
                <div className="modal-pro-info">
                  <div className="modal-pro-avatar">
                    {getInitials(selectedProfessional.name)}
                  </div>
                  <div>
                    <div className="modal-pro-name">
                      {selectedProfessional.name}
                    </div>
                    <div className="modal-pro-spec">
                      {selectedProfessional.professional_profile?.specialization ||
                        "Professional"}
                    </div>
                  </div>
                </div>

                {/* Service Selection */}
                {services.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Select Service</label>
                    <select
                      className="form-select"
                      value={bookingData.service_id}
                      onChange={handleServiceChange}
                    >
                      <option value="">Choose a service...</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - ₹{service.price}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Date & Time */}
                <div className="form-group">
                  <label className="form-label required">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    id="appointment_date"
                    className="form-input"
                    required
                    value={bookingData.appointment_date}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        appointment_date: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">
                    Appointment Time
                  </label>
                  <input
                    type="time"
                    className="form-input"
                    required
                    value={bookingData.appointment_time}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        appointment_time: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Notes */}
                <div className="form-group">
                  <label className="form-label">Additional Notes</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Any specific requirements or details..."
                    value={bookingData.notes}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Price Display */}
                {bookingData.total_price && (
                  <div className="price-display">
                    <div className="price-label">Total Amount</div>
                    <div className="price-value">₹{bookingData.total_price}</div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-check"></i> Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ResidentLayout>
  );
};

export default ResidentServices;