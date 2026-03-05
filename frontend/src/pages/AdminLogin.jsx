import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/admin-login.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(""); // Clear error on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_type", "admin");

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      {/* Background */}
      <div className="admin-login-bg">
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
      </div>

      {/* Login Card */}
      <div className="admin-login-card">
        {/* Logo */}
        <div className="admin-logo">
          <div className="admin-logo-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1>Admin Portal</h1>
          <p>LocalHub Administration</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="admin-alert error">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="admin-form-group">
            <label>Email Address</label>
            <div className="admin-input-wrapper">
              <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="admin@localhub.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Password</label>
            <div className="admin-input-wrapper">
              <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              <>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login to Admin Panel
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="admin-login-footer">
          <Link to="/" className="back-link">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;