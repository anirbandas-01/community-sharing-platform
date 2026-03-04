import { useState, useEffect } from "react";
import BusinessLayout from "../../components/business/BusinessLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const BusinessEnterprise = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [enterpriseStatus, setEnterpriseStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    industryType: "",
    revenue: "",
    contactPerson: "",
    designation: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    description: "",
    photo: null,
    terms: false,
  });

  useEffect(() => {
    checkEnterpriseStatus();
  }, []);

  const checkEnterpriseStatus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE}/enterprise/show`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsRegistered(true);
        setEnterpriseStatus(data.status || "pending");
      }
    } catch (error) {
      console.log("No enterprise registered");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.terms) {
      alert("Please accept the terms and conditions");
      return;
    }

    setSubmitting(true);

    const fd = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "terms" && formData[key]) {
        fd.append(key, formData[key]);
      }
    });

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE}/enterprise/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: fd,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      alert("✅ Enterprise registered successfully! Status: Pending approval");
      setIsRegistered(true);
      setEnterpriseStatus("pending");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to register enterprise. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <BusinessLayout>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </BusinessLayout>
    );
  }

  if (isRegistered) {
    return (
      <BusinessLayout>
        <div className="card">
          <div
            style={{
              background: "#e0f2fe",
              border: "1px solid #38bdf8",
              padding: "1.25rem",
              borderRadius: "12px",
              margin: "2rem",
              fontWeight: 700,
              color: "#075985",
              textAlign: "center",
            }}
          >
            🏢 Enterprise already registered
            <br />
            Status: <strong>{enterpriseStatus?.toUpperCase()}</strong>
          </div>
        </div>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Register as Enterprise</h3>
        </div>
        <div style={{ padding: "2rem" }}>
          {/* Enterprise Benefits Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              padding: "2rem",
              borderRadius: "16px",
              marginBottom: "2rem",
              color: "white",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ fontSize: "4rem" }}>🏢</div>
              <div>
                <h3
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    marginBottom: "0.5rem",
                  }}
                >
                  Upgrade to Enterprise
                </h3>
                <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
                  Get access to advanced features including multi-location
                  management, bulk operations, priority support, and detailed
                  analytics.
                </p>
              </div>
            </div>
          </div>

          {/* Enterprise Benefits Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                background: "var(--light-gray)",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📍</div>
              <h4 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                Multi-Location
              </h4>
              <p style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
                Manage multiple business locations from one dashboard
              </p>
            </div>
            <div
              style={{
                padding: "1.5rem",
                background: "var(--light-gray)",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📊</div>
              <h4 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                Advanced Analytics
              </h4>
              <p style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
                Detailed insights and custom reports
              </p>
            </div>
            <div
              style={{
                padding: "1.5rem",
                background: "var(--light-gray)",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎯</div>
              <h4 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                Priority Support
              </h4>
              <p style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
                24/7 dedicated support team
              </p>
            </div>
          </div>

          {/* Enterprise Registration Form */}
          <form
            onSubmit={handleSubmit}
            style={{ maxWidth: "800px", margin: "0 auto" }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                marginBottom: "2rem",
                color: "var(--dark)",
              }}
            >
              Enterprise Registration Form
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
              {/* Company Name */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "var(--dark)",
                  }}
                >
                  Company Legal Name <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter your company's legal name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "1rem",
                  }}
                />
              </div>

              {/* Registration Number */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "var(--dark)",
                  }}
                >
                  Registration Number <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  placeholder="CIN/Registration No."
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "1rem",
                  }}
                />
              </div>

              {/* Industry Type */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "var(--dark)",
                  }}
                >
                  Industry Type <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <select
                  name="industryType"
                  value={formData.industryType}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Select Industry</option>
                  <option value="retail">Retail</option>
                  <option value="food">Food & Beverages</option>
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="electronics">Electronics</option>
                  <option value="services">Services</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Annual Revenue */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "var(--dark)",
                  }}
                >
                  Annual Revenue Range <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <select
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Select Range</option>
                  <option value="0-10L">₹0 - ₹10 Lakhs</option>
                  <option value="10L-50L">₹10 Lakhs - ₹50 Lakhs</option>
                  <option value="50L-1Cr">₹50 Lakhs - ₹1 Crore</option>
                  <option value="1Cr-5Cr">₹1 Crore - ₹5 Crores</option>
                  <option value="5Cr-10Cr">₹5 Crores - ₹10 Crores</option>
                  <option value="10Cr+">₹10 Crores+</option>
                </select>
              </div>

              {/* Contact Person Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "var(--dark)",
                  }}
                >
                  Contact Person Name <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  placeholder="Full name"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "1rem",
                  }}
                />
              </div>

              {/* Designation */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "var(--dark)",
                  }}
                >
                  Designation <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  name="designation"
                  placeholder="e.g., CEO, Director"
                  value={formData.designation}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "1rem",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "var(--dark)",
                  }}
                >
                  Official Email <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="company@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "1rem",
                  }}
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "var(--dark)",
                  }}
                >
                  Contact Number <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "1rem",
                  }}
                />
              </div>

              {/* Registered Address */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "var(--dark)",
                  }}
                >
                  Registered Office Address <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <textarea
                  name="address"
                  rows="3"
                  placeholder="Complete registered address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    resize: "vertical",
                  }}
                ></textarea>
              </div>

              {/* City */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "var(--dark)",
                  }}
                >
                  City <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "1rem",
                  }}
                />
              </div>

              {/* Business Description */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "var(--dark)",
                  }}
                >
                  Business Description <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Describe your business, products/services, and why you need enterprise features"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    resize: "vertical",
                  }}
                ></textarea>
              </div>

              {/* Document Upload */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "var(--dark)",
                  }}
                >
                  Upload Documents <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <div
                  style={{
                    padding: "2rem",
                    border: "2px dashed var(--border)",
                    borderRadius: "12px",
                    textAlign: "center",
                    background: "var(--light-gray)",
                  }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📄</div>
                  <p style={{ color: "var(--gray)", marginBottom: "1rem" }}>
                    Upload Enterprise Photo
                  </p>
                  <input
                    type="file"
                    name="photo"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleInputChange}
                    required
                  />
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--gray)",
                      marginTop: "0.5rem",
                    }}
                  >
                    JPG, PNG (Max 5MB each)
                  </p>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "20px",
                      height: "20px",
                      accentColor: "var(--primary)",
                      cursor: "pointer",
                    }}
                  />
                  <span style={{ color: "var(--gray)" }}>
                    I agree to the{" "}
                    <a
                      href="#"
                      style={{ color: "var(--primary)", fontWeight: 600 }}
                    >
                      Enterprise Terms & Conditions
                    </a>{" "}
                    and confirm that all information provided is accurate
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div style={{ gridColumn: "1 / -1", marginTop: "1rem" }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "1.25rem",
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "all 0.3s",
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Enterprise Application"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessEnterprise;