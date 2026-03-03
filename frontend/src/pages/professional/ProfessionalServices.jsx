import { useState, useEffect } from "react";
import ProfessionalLayout from "../../components/professional/ProfessionalLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const ProfessionalServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "other",
    duration: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/professional/services`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load services");

      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setCurrentServiceId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "other",
      duration: "",
    });
    setShowModal(true);
  };

  const openEditModal = async (serviceId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/professional/services/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load service");

      const service = await response.json();
      setCurrentServiceId(serviceId);
      setFormData({
        name: service.name || "",
        description: service.description || "",
        price: service.price || "",
        category: service.category || "other",
        duration: service.duration || "",
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error loading service:", error);
      alert("Failed to load service details");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentServiceId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "other",
      duration: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serviceData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      duration: formData.duration ? parseFloat(formData.duration) : null,
    };

    try {
      const token = localStorage.getItem("token");
      const url = currentServiceId
        ? `${API_BASE}/professional/services/${currentServiceId}`
        : `${API_BASE}/professional/services`;

      const method = currentServiceId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) throw new Error("Failed to save service");

      alert(
        currentServiceId
          ? "Service updated successfully!"
          : "Service added successfully!"
      );
      closeModal();
      loadServices();
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service. Please try again.");
    }
  };

  const toggleServiceStatus = async (serviceId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/professional/services/${serviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      alert(`Service ${newStatus === "active" ? "activated" : "paused"} successfully!`);
      loadServices();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update service status");
    }
  };

  const deleteService = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/professional/services/${serviceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete service");

      alert("Service deleted successfully!");
      loadServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service");
    }
  };

  const stats = {
    total: services.length,
    active: services.filter((s) => s.status === "active").length,
    totalBookings: services.reduce((sum, s) => sum + (s.bookings || 0), 0),
    avgRating:
      services.length > 0
        ? (services.reduce((sum, s) => sum + (s.rating || 0), 0) / services.length).toFixed(1)
        : "0.0",
  };

  return (
    <ProfessionalLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Services</h1>
          <p className="page-subtitle">Manage your service offerings and pricing</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <i className="fas fa-plus"></i> Add New Service
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Services</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active Services</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalBookings}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.avgRating}</div>
          <div className="stat-label">Average Rating</div>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-briefcase"></i>
          <h3>No Services Yet</h3>
          <p>Add your first service to get started!</p>
          <button onClick={openAddModal} className="btn btn-primary">
            <i className="fas fa-plus"></i> Add Your First Service
          </button>
        </div>
      ) : (
        <div className="professionals-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-header">
                <div style={{ flex: 1 }}>
                  <div className="service-title">{service.name}</div>
                  <span className={`badge ${service.status || "active"}`}>
                    {service.status || "Active"}
                  </span>
                </div>
                <div className="service-price">₹{service.price}</div>
              </div>

              <div className="service-description">{service.description}</div>

              <div className="service-meta">
                <div className="meta-item">
                  <i className="fas fa-calendar-check"></i>
                  <span>{service.bookings || 0} bookings</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-star"></i>
                  <span>{service.rating || 0} rating</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-clock"></i>
                  <span>{service.duration || "N/A"} hrs</span>
                </div>
              </div>

              <div className="service-actions">
                <button
                  onClick={() => openEditModal(service.id)}
                  className="btn btn-primary btn-sm"
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button
                  onClick={() => toggleServiceStatus(service.id, service.status)}
                  className="btn btn-outline btn-sm"
                >
                  <i
                    className={`fas fa-${service.status === "active" ? "pause" : "play"}`}
                  ></i>
                  {service.status === "active" ? "Pause" : "Activate"}
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="btn btn-danger btn-sm"
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Service Modal */}
      {showModal && (
        <div className="modal-overlay active" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {currentServiceId ? "Edit Service" : "Add New Service"}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label required">Service Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Home Plumbing Repair"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe your service in detail..."
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="1500"
                    min="0"
                    step="1"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="painting">Painting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Duration (hours)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="2"
                    min="0.5"
                    step="0.5"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-save"></i> Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProfessionalLayout>
  );
};

export default ProfessionalServices;