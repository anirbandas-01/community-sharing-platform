// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";

function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("resident");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    profile_image: null,
  });

  // Professional-specific fields
  const [professionalData, setProfessionalData] = useState({
    profession: "",
    specialization: "",
    qualification: "",
    experience_years: "",
    license_number: "",
  });

  // Business-specific fields
  const [businessData, setBusinessData] = useState({
    business_name: "",
    business_type: "",
    business_category: "",
    registration_number: "",
    opening_time: "09:00",
    closing_time: "17:00",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Profession options
  const professions = [
    { value: "", label: "Select your profession" },
    { value: "doctor", label: "👨‍⚕️ Doctor/Physician" },
    { value: "lawyer", label: "⚖️ Lawyer/Attorney" },
    { value: "engineer", label: "👷 Engineer" },
    { value: "teacher", label: "👨‍🏫 Teacher/Educator" },
    { value: "accountant", label: "💰 Accountant" },
    { value: "architect", label: "🏛️ Architect" },
    { value: "consultant", label: "💼 Consultant" },
    { value: "developer", label: "💻 Software Developer" },
    { value: "designer", label: "🎨 Designer" },
    { value: "plumber", label: "🔧 Plumber" },
    { value: "electrician", label: "⚡ Electrician" },
    { value: "carpenter", label: "🪚 Carpenter" },
    { value: "mechanic", label: "🔩 Mechanic" },
    { value: "chef", label: "👨‍🍳 Chef" },
    { value: "trainer", label: "🏋️ Fitness Trainer" },
    { value: "artist", label: "🎭 Artist" },
    { value: "writer", label: "✍️ Writer" },
    { value: "other", label: "📋 Other Profession" },
  ];

  // Business categories
  const businessCategories = [
    { value: "", label: "Select business category" },
    { value: "retail", label: "🛍️ Retail Store" },
    { value: "restaurant", label: "🍽️ Restaurant/Cafe" },
    { value: "service", label: "🔧 Service Provider" },
    { value: "manufacturing", label: "🏭 Manufacturing" },
    { value: "wholesale", label: "📦 Wholesale" },
    { value: "healthcare", label: "🏥 Healthcare" },
    { value: "education", label: "📚 Education" },
    { value: "technology", label: "💻 Technology" },
    { value: "real_estate", label: "🏠 Real Estate" },
    { value: "transport", label: "🚚 Transport/Logistics" },
    { value: "construction", label: "🏗️ Construction" },
    { value: "beauty", label: "💄 Beauty/Salon" },
    { value: "automotive", label: "🚗 Automotive" },
    { value: "agriculture", label: "🌾 Agriculture" },
    { value: "other", label: "📋 Other Business" },
  ];

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setErrors({});
  };

  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleProfessionalChange = (e) => {
    const { name, value } = e.target;
    setProfessionalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profile_image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      // Prepare form data
      const formDataToSend = new FormData();

      // Add common fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add user type
      formDataToSend.append("user_type", userType);

      // Add professional fields if applicable
      if (userType === "professional") {
        Object.keys(professionalData).forEach((key) => {
          if (professionalData[key]) {
            formDataToSend.append(key, professionalData[key]);
          }
        });
      }

      // Add business fields if applicable
      if (userType === "business") {
        Object.keys(businessData).forEach((key) => {
          if (businessData[key]) {
            formDataToSend.append(key, businessData[key]);
          }
        });
      }

      // Register user
      const response = await authService.register(formDataToSend);

      // Store auth data
      authService.storeAuthData(response);

      setSuccessMessage(`✅ Welcome to LocalConnect! Your ${userType} account has been created successfully.`);

      // Redirect after 2 seconds
      setTimeout(() => {
        if (userType === "professional") {
          navigate("/professional/setup");
        } else if (userType === "business") {
          navigate("/business/setup");
        } else {
          navigate("/dashboard");
        }
      }, 2000);

    } catch (error) {
      console.error("Registration error:", error);
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ general: [error.message || "Registration failed. Please try again."] });
      }
    } finally {
      setLoading(false);
    }
  };

  const UserTypeCard = ({ type, icon, title, description, features }) => (
    <div
      className={`relative rounded-xl p-6 cursor-pointer transition-all duration-300 border-2 ${
        userType === type
          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-[1.02]"
          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
      }`}
      onClick={() => handleUserTypeChange(type)}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <h4 className="text-xl font-semibold text-gray-800 mb-2">{title}</h4>
          <p className="text-gray-600 mb-4">{description}</p>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        {userType === type && (
          <div className="absolute top-4 right-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 py-8 px-4 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Join LocalConnect
            </h1>
            <p className="text-blue-100 text-lg">
              Connect with your local community
            </p>
          </div>

          <div className="p-6 md:p-8">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-700">{successMessage}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700">{errors.general[0]}</span>
                </div>
              </div>
            )}

            {/* User Type Selection */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  1
                </span>
                Select Your Profile Type
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <UserTypeCard
                  type="resident"
                  icon="🏠"
                  title="Resident"
                  description="Looking for local services & connections"
                  features={[
                    "Find trusted professionals",
                    "Access local businesses",
                    "Join community events",
                  ]}
                />
                <UserTypeCard
                  type="professional"
                  icon="👨‍⚕️"
                  title="Professional"
                  description="Offer services & network with peers"
                  features={[
                    "Connect with clients",
                    "Join professional community",
                    "Build your reputation",
                  ]}
                />
                <UserTypeCard
                  type="business"
                  icon="🏪"
                  title="Business"
                  description="Grow your business locally"
                  features={[
                    "Reach local customers",
                    "Collaborate with other businesses",
                    "Share inventory & resources",
                  ]}
                />
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
              {/* Profile Image */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    2
                  </span>
                  Basic Information
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-8 bg-blue-50 rounded-xl p-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      {profilePreview ? (
                        <img
                          src={profilePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-6xl">
                          {userType === "professional"
                            ? "👨‍⚕️"
                            : userType === "business"
                            ? "🏪"
                            : "🏠"}
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-md">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Profile Photo
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Upload a clear photo to help others recognize you. This builds trust in the community.
                    </p>
                    <label className="inline-flex items-center gap-2 bg-white border-2 border-blue-500 text-blue-600 px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-blue-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      JPG, PNG up to 2MB • Optional but recommended
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information Form */}
              <div className="mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label={userType === "business" ? "Contact Person Name *" : "Full Name *"}
                    name="name"
                    type="text"
                    placeholder={userType === "business" ? "John Smith" : "Your full name"}
                    value={formData.name}
                    onChange={handleCommonChange}
                    error={errors.name?.[0]}
                    required
                  />
                  <Input
                    label="Email Address *"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleCommonChange}
                    error={errors.email?.[0]}
                    required
                  />
                  <Input
                    label="Phone Number *"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleCommonChange}
                    error={errors.phone?.[0]}
                    required
                  />
                  <Input
                    label="Password *"
                    name="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={handleCommonChange}
                    error={errors.password?.[0]}
                    required
                  />
                  <Input
                    label="Confirm Password *"
                    name="password_confirmation"
                    type="password"
                    placeholder="Repeat your password"
                    value={formData.password_confirmation}
                    onChange={handleCommonChange}
                    required
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    3
                  </span>
                  Location Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Street Address *"
                    name="address"
                    type="text"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={handleCommonChange}
                    error={errors.address?.[0]}
                    required
                  />
                  <Input
                    label="City *"
                    name="city"
                    type="text"
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleCommonChange}
                    error={errors.city?.[0]}
                    required
                  />
                  <Input
                    label="State/Province *"
                    name="state"
                    type="text"
                    placeholder="NY"
                    value={formData.state}
                    onChange={handleCommonChange}
                    error={errors.state?.[0]}
                    required
                  />
                  <Input
                    label="ZIP/Postal Code *"
                    name="zip_code"
                    type="text"
                    placeholder="10001"
                    value={formData.zip_code}
                    onChange={handleCommonChange}
                    error={errors.zip_code?.[0]}
                    required
                  />
                </div>
              </div>

              {/* Professional Details */}
              {userType === "professional" && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      4
                    </span>
                    Professional Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Profession *"
                      name="profession"
                      value={professionalData.profession}
                      onChange={handleProfessionalChange}
                      options={professions}
                      error={errors.profession?.[0]}
                      required
                    />
                    <Input
                      label="Specialization"
                      name="specialization"
                      type="text"
                      placeholder="e.g., Family Law, Pediatrics, Web Development"
                      value={professionalData.specialization}
                      onChange={handleProfessionalChange}
                    />
                    <Input
                      label="Qualification"
                      name="qualification"
                      type="text"
                      placeholder="e.g., MD, JD, PhD, B.Tech"
                      value={professionalData.qualification}
                      onChange={handleProfessionalChange}
                    />
                    <Input
                      label="Years of Experience"
                      name="experience_years"
                      type="number"
                      placeholder="5"
                      min="0"
                      max="50"
                      value={professionalData.experience_years}
                      onChange={handleProfessionalChange}
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="License Number (if applicable)"
                        name="license_number"
                        type="text"
                        placeholder="e.g., BAR-12345, MED-98765"
                        value={professionalData.license_number}
                        onChange={handleProfessionalChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Business Details */}
              {userType === "business" && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      4
                    </span>
                    Business Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Business Name *"
                      name="business_name"
                      type="text"
                      placeholder="e.g., Smith & Co., City Cafe"
                      value={businessData.business_name}
                      onChange={handleBusinessChange}
                      error={errors.business_name?.[0]}
                      required
                    />
                    <Input
                      label="Business Type"
                      name="business_type"
                      type="text"
                      placeholder="e.g., LLC, Partnership, Sole Proprietorship"
                      value={businessData.business_type}
                      onChange={handleBusinessChange}
                    />
                    <Select
                      label="Business Category"
                      name="business_category"
                      value={businessData.business_category}
                      onChange={handleBusinessChange}
                      options={businessCategories}
                    />
                    <Input
                      label="Registration Number"
                      name="registration_number"
                      type="text"
                      placeholder="e.g., EIN, GST, VAT number"
                      value={businessData.registration_number}
                      onChange={handleBusinessChange}
                    />
                    <Input
                      label="Opening Time"
                      name="opening_time"
                      type="time"
                      value={businessData.opening_time}
                      onChange={handleBusinessChange}
                    />
                    <Input
                      label="Closing Time"
                      name="closing_time"
                      type="time"
                      value={businessData.closing_time}
                      onChange={handleBusinessChange}
                    />
                  </div>
                </div>
              )}

              {/* Terms and Submit */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700">
                        By creating an account, you agree to our{" "}
                        <Link to="/terms" className="text-blue-600 font-medium hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-blue-600 font-medium hover:underline">
                          Privacy Policy
                        </Link>
                        . Your information is secure and will never be shared with third parties.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 font-medium hover:underline">
                      Sign in here
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    className="min-w-[300px]"
                  >
                    {loading ? (
                      "Creating Account..."
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Create {userType.charAt(0).toUpperCase() + userType.slice(1)}{" "}
                        Account
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;