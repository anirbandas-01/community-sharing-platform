import { useState, useEffect } from "react";
import ProfessionalLayout from "../../components/professional/ProfessionalLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const ProfessionalSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile Settings
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Availability Settings
  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: "09:00", end: "18:00" },
    tuesday: { enabled: true, start: "09:00", end: "18:00" },
    wednesday: { enabled: true, start: "09:00", end: "18:00" },
    thursday: { enabled: true, start: "09:00", end: "18:00" },
    friday: { enabled: true, start: "09:00", end: "18:00" },
    saturday: { enabled: true, start: "10:00", end: "16:00" },
    sunday: { enabled: false, start: "09:00", end: "18:00" },
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    email_bookings: true,
    email_messages: true,
    email_reviews: true,
    sms_bookings: true,
    sms_reminders: true,
    push_bookings: true,
    push_messages: true,
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load settings");

      const data = await response.json();
      
      // Update profile
      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        bio: data.bio || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
      });

      // Update availability if exists
      if (data.availability) {
        setAvailability(data.availability);
      }

      // Update notifications if exists
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error("Failed to save profile");

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveAvailability = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/professional/availability`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(availability),
      });

      if (!response.ok) throw new Error("Failed to save availability");

      alert("Availability updated successfully!");
    } catch (error) {
      console.error("Error saving availability:", error);
      alert("Failed to save availability. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveNotifications = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/user/notifications`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notifications),
      });

      if (!response.ok) throw new Error("Failed to save notifications");

      alert("Notification preferences updated!");
    } catch (error) {
      console.error("Error saving notifications:", error);
      alert("Failed to save preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("New passwords do not match!");
      return;
    }

    if (passwordData.new_password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/user/change-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      });

      if (!response.ok) throw new Error("Failed to change password");

      alert("Password changed successfully!");
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please check your current password.");
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day) => {
    setAvailability({
      ...availability,
      [day]: { ...availability[day], enabled: !availability[day].enabled },
    });
  };

  const updateDayTime = (day, field, value) => {
    setAvailability({
      ...availability,
      [day]: { ...availability[day], [field]: value },
    });
  };

  if (loading) {
    return (
      <ProfessionalLayout>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading settings...</p>
        </div>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences</p>
      </div>

      {/* Settings Tabs */}
      <div className="settings-tabs">
        <button
          className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <i className="fas fa-user"></i> Profile
        </button>
        <button
          className={`tab-btn ${activeTab === "availability" ? "active" : ""}`}
          onClick={() => setActiveTab("availability")}
        >
          <i className="fas fa-calendar"></i> Availability
        </button>
        <button
          className={`tab-btn ${activeTab === "notifications" ? "active" : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          <i className="fas fa-bell"></i> Notifications
        </button>
        <button
          className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <i className="fas fa-lock"></i> Security
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="settings-content">
          <form onSubmit={saveProfile} className="settings-form">
            <h2 className="form-section-title">Personal Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Bio / Description</label>
              <textarea
                rows="4"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell clients about yourself and your expertise..."
              ></textarea>
            </div>

            <h2 className="form-section-title">Address</h2>

            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  value={profile.pincode}
                  onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Availability Tab */}
      {activeTab === "availability" && (
        <div className="settings-content">
          <form onSubmit={saveAvailability} className="settings-form">
            <h2 className="form-section-title">Working Hours</h2>
            <p className="form-description">Set your weekly availability schedule</p>

            <div className="availability-list">
              {Object.keys(availability).map((day) => (
                <div key={day} className="availability-item">
                  <div className="day-toggle">
                    <input
                      type="checkbox"
                      id={`day-${day}`}
                      checked={availability[day].enabled}
                      onChange={() => toggleDay(day)}
                    />
                    <label htmlFor={`day-${day}`} className="day-name">
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </label>
                  </div>

                  {availability[day].enabled && (
                    <div className="time-inputs">
                      <input
                        type="time"
                        value={availability[day].start}
                        onChange={(e) => updateDayTime(day, "start", e.target.value)}
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={availability[day].end}
                        onChange={(e) => updateDayTime(day, "end", e.target.value)}
                      />
                    </div>
                  )}

                  {!availability[day].enabled && (
                    <span className="unavailable-label">Unavailable</span>
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i> Save Availability
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="settings-content">
          <form onSubmit={saveNotifications} className="settings-form">
            <h2 className="form-section-title">Email Notifications</h2>

            <div className="notification-item">
              <div className="notification-info">
                <h4>New Bookings</h4>
                <p>Get notified when someone books your service</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.email_bookings}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email_bookings: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h4>New Messages</h4>
                <p>Get notified when you receive a message</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.email_messages}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email_messages: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h4>New Reviews</h4>
                <p>Get notified when someone leaves a review</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.email_reviews}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email_reviews: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <h2 className="form-section-title">SMS Notifications</h2>

            <div className="notification-item">
              <div className="notification-info">
                <h4>Booking Confirmations</h4>
                <p>Receive SMS for confirmed bookings</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.sms_bookings}
                  onChange={(e) =>
                    setNotifications({ ...notifications, sms_bookings: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h4>Appointment Reminders</h4>
                <p>Get reminder SMS before appointments</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.sms_reminders}
                  onChange={(e) =>
                    setNotifications({ ...notifications, sms_reminders: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <h2 className="form-section-title">Push Notifications</h2>

            <div className="notification-item">
              <div className="notification-info">
                <h4>Booking Updates</h4>
                <p>Push notifications for booking status changes</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.push_bookings}
                  onChange={(e) =>
                    setNotifications({ ...notifications, push_bookings: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h4>New Messages</h4>
                <p>Push notifications for new messages</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.push_messages}
                  onChange={(e) =>
                    setNotifications({ ...notifications, push_messages: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i> Save Preferences
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="settings-content">
          <form onSubmit={changePassword} className="settings-form">
            <h2 className="form-section-title">Change Password</h2>
            <p className="form-description">
              Ensure your password is at least 8 characters long
            </p>

            <div className="form-group">
              <label>Current Password *</label>
              <input
                type="password"
                value={passwordData.current_password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, current_password: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>New Password *</label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, new_password: e.target.value })
                }
                required
                minLength="8"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password *</label>
              <input
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirm_password: e.target.value })
                }
                required
                minLength="8"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-key"></i> Change Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </ProfessionalLayout>
  );
};

export default ProfessionalSettings;