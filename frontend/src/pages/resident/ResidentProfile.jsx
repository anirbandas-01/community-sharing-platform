import { useState, useEffect } from "react";
import ResidentLayout from "../../components/resident/ResidentLayout";

const ResidentProfile = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load profile");

      const data = await response.json();
      const userData = data.user || data;
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        city: userData.city || "",
        state: userData.state || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      alert("Profile updated successfully!");
      await loadUserData();
      setEditMode(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const cancelEdit = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        state: user.state || "",
      });
    }
    setEditMode(false);
  };

  const changePassword = () => {
    const currentPassword = prompt("Enter your current password:");
    if (!currentPassword) return;

    const newPassword = prompt("Enter your new password:");
    if (!newPassword) return;

    const confirmPassword = prompt("Confirm your new password:");
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const token = localStorage.getItem("auth_token");
    fetch(`${API_BASE}user/change-password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        if (data.message.includes("successfully")) {
          localStorage.removeItem("auth_token");
          window.location.href = "/login";
        }
      })
      .catch((error) => {
        console.error("Error changing password:", error);
        alert("Failed to change password");
      });
  };

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to logout?")) return;

    try {
      const token = localStorage.getItem("auth_token");
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
      window.location.href = "/login";
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <ResidentLayout>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </ResidentLayout>
    );
  }

  return (
    <ResidentLayout>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your personal information</p>
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-large">{getInitials(user?.name)}</div>
        <div className="profile-name">{user?.name || "User"}</div>
        <div className="profile-email">{user?.email || ""}</div>
      </div>

      {/* Profile Information */}
      <div className="section">
        <div className="section-header-row">
          <h2 className="section-title">Personal Information</h2>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="btn btn-outline"
            >
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          )}
        </div>

        {/* View Mode */}
        {!editMode && (
          <div className="info-rows">
            <div className="info-row">
              <span className="info-label">Full Name</span>
              <span className="info-value">{user?.name || "-"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email Address</span>
              <span className="info-value">{user?.email || "-"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone Number</span>
              <span className="info-value">{user?.phone || "-"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">City</span>
              <span className="info-value">{user?.city || "-"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">State</span>
              <span className="info-value">{user?.state || "-"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Member Since</span>
              <span className="info-value">
                {formatDate(user?.created_at)}
              </span>
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {editMode && (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  disabled
                  value={formData.email}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="edit-mode-buttons">
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-save"></i> Save Changes
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="btn btn-outline"
              >
                <i className="fas fa-times"></i> Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Account Settings */}
      <div className="section">
        <h2 className="section-title">Account Settings</h2>
        <div className="quick-actions">
          <button onClick={changePassword} className="btn btn-outline">
            <i className="fas fa-key"></i> Change Password
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ color: "#dc2626" }}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
    </ResidentLayout>
  );
};

export default ResidentProfile;