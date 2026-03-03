import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth/register.css";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [imagePreview, setImagePreview] = useState(null);

  const totalSteps = 3;

  const [formData, setFormData] = useState({
    name: "",
    profile: "",
    city: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    aadhaar: "",
    profile_image: null,
    terms: false,
  });

  // =============================
  // STEP PROGRESS UPDATE
  // =============================
  useEffect(() => {
    const progressLine = document.getElementById("progressLine");
    if (progressLine) {
      progressLine.style.width =
        ((currentStep - 1) / (totalSteps - 1)) * 100 + "%";
    }
  }, [currentStep]);

  // =============================
  // INPUT HANDLER
  // =============================
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        showAlert("File must be less than 2MB", "error");
        return;
      }

      setFormData((prev) => ({ ...prev, profile_image: file }));

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // =============================
  // VALIDATION
  // =============================
  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.name.trim())
        return showAlert("Enter your full name", "error");

      if (!formData.profile)
        return showAlert("Select a profile type", "error");

      if (!formData.city.trim())
        return showAlert("Enter your city", "error");
    }

    if (currentStep === 2) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        return showAlert("Enter valid email", "error");

      if (!/^[0-9]{10}$/.test(formData.phone))
        return showAlert("Enter valid 10-digit phone", "error");

      if (formData.password.length < 8)
        return showAlert("Password must be 8+ characters", "error");

      if (formData.password !== formData.password_confirmation)
        return showAlert("Passwords do not match", "error");
    }

    if (currentStep === 3) {
      if (!/^[0-9]{12}$/.test(formData.aadhaar))
        return showAlert("Enter valid 12-digit Aadhaar", "error");

      if (!formData.profile_image)
        return showAlert("Upload profile photo", "error");

      if (!formData.terms)
        return showAlert("Accept terms & conditions", "error");
    }

    return true;
  };

  // =============================
  // STEP NAVIGATION
  // =============================
  const handleNext = () => {
    if (validateStep() && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const removeImage = (e) => {
  e.stopPropagation();
  setFormData((prev) => ({
    ...prev,
    profile_image: null,
  }));
  setImagePreview(null);

  const fileInput = document.getElementById("photoInput");
  if (fileInput) fileInput.value = "";
};

  // =============================
  // SUBMIT
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);

    try {
      const fd = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          fd.append(
            key === "profile" ? "user_type" : key,
            formData[key]
          );
        }
      });

      const response = await api.post("/register", fd);

      const { token, redirect_url, user } = response.data;

      // ✅ Use context login (Professional way)
      login(user, token);

      showAlert("Registration successful!", "success");

      setTimeout(() => navigate(redirect_url), 1000);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {})[0]?.[0] ||
        "Registration failed";

      showAlert(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // ALERT
  // =============================
  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 4000);
  };
  return (
    <>
      {/* Animated Background */}
      <div className="background-animation">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>

      {/* Back to Home */}
      <div className="back-home">
        <Link to="/" className="back-home-link">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Registration Container */}
      <div className="register-container">
        <div className="register-card">
          {/* Logo */}
          <div className="logo-section">
            <div className="logo-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h1 className="logo-text">LocalHub</h1>
          </div>

          {/* Header */}
          <div className="register-header">
            <h2 className="register-title">Create Your Account</h2>
            <p className="register-subtitle">
              Join your local community in just a few steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="progress-steps">
            <div className="progress-line" id="progressLine"></div>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`step ${currentStep === step ? "active" : ""} ${
                  currentStep > step ? "completed" : ""
                }`}
              >
                <div className="step-circle">{step}</div>
                <div className="step-label">
                  {step === 1 && "Personal Info"}
                  {step === 2 && "Contact Details"}
                  {step === 3 && "Verification"}
                </div>
              </div>
            ))}
          </div>

          {/* Alert Message */}
          {alert.show && (
            <div className={`alert alert-${alert.type} show`}>
              <span>{alert.message}</span>
            </div>
          )}

          {/* Registration Form */}
          <form className="register-form" onSubmit={handleSubmit}>
            {/* Step 1: Personal Info */}
            <div
              className={`form-step ${currentStep === 1 ? "active" : ""}`}
              style={{ display: currentStep === 1 ? "block" : "none" }}
            >
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <svg
                      className="form-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Profile <span className="required">*</span>
                  </label>
                  <div className="radio-group">
                    {["resident", "professional", "business"].map((type) => (
                      <label key={type} className="radio-label">
                        <input
                          type="radio"
                          name="profile"
                          value={type}
                          className="radio-input"
                          checked={formData.profile === type}
                          onChange={handleInputChange}
                          required
                        />
                        <span className="radio-text">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    City <span className="required">*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <svg
                      className="form-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      name="city"
                      className="form-input"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Contact Details */}
            <div
              className={`form-step ${currentStep === 2 ? "active" : ""}`}
              style={{ display: currentStep === 2 ? "block" : "none" }}
            >
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <svg
                      className="form-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Phone Number <span className="required">*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <svg
                      className="form-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      maxLength="10"
                      required
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Password <span className="required">*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <svg
                      className="form-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <input
                      type="password"
                      name="password"
                      className="form-input"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      minLength="8"
                      required
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Confirm Password <span className="required">*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <svg
                      className="form-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <input
                      type="password"
                      name="password_confirmation"
                      className="form-input"
                      placeholder="Re-enter your password"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Verification */}
            <div
              className={`form-step ${currentStep === 3 ? "active" : ""}`}
              style={{ display: currentStep === 3 ? "block" : "none" }}
            >
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    Aadhaar Number <span className="required">*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <svg
                      className="form-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                      />
                    </svg>
                    <input
                      type="text"
                      name="aadhaar"
                      className="form-input"
                      placeholder="12-digit Aadhaar number"
                      value={formData.aadhaar}
                      onChange={handleInputChange}
                      maxLength="12"
                      required
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Profile Photo <span className="required">*</span>
                  </label>
                  <div
                    className={`photo-upload ${imagePreview ? "has-image" : ""}`}
                    onClick={() =>
                      document.getElementById("photoInput").click()
                    }
                  >
                    <svg
                      className="upload-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="upload-text">Click to upload your photo</p>
                    <p className="upload-hint">JPG, PNG or JPEG (MAX. 2MB)</p>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        className="image-preview"
                        alt="Preview"
                      />
                    )}
                    {imagePreview && (
                      <button
                        type="button"
                        className="remove-image"
                        onClick={removeImage}
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    id="photoInput"
                    name="profile_image"
                    className="file-input"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
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
                        accentColor: "#4f46e5",
                        cursor: "pointer",
                      }}
                    />
                    <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                      I agree to the{" "}
                      <a href="#" className="footer-link">
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#" className="footer-link">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="form-buttons">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="btn btn-back"
                  onClick={handleBack}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back
                </button>
              )}
              {currentStep < totalSteps && (
                <button
                  type="button"
                  className="btn btn-next"
                  onClick={handleNext}
                >
                  <span className="btn-text">
                    Next
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </button>
              )}
              {currentStep === totalSteps && (
                <button
                  type="submit"
                  className={`btn btn-submit ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  <div className="spinner"></div>
                  <span className="btn-text">Create Account</span>
                </button>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="register-footer">
            <p className="footer-text">
              Already have an account?{" "}
              <Link to="/login" className="footer-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;