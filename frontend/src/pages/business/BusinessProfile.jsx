import { useState, useEffect } from "react";
import BusinessLayout from "../../components/business/BusinessLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const BusinessProfile = () => {
  const [user, setUser] = useState(null);
  const [enterprise, setEnterprise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      // Load user profile
      const userResponse = await fetch(`${API_BASE}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!userResponse.ok) throw new Error("Failed to load user profile");

      const userData = await userResponse.json();
      setUser(userData.user || userData);

      // Load enterprise profile
      try {
        const enterpriseResponse = await fetch(`${API_BASE}/enterprise/show`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (enterpriseResponse.ok) {
          const enterpriseData = await enterpriseResponse.json();
          setEnterprise(enterpriseData);
        }
      } catch (error) {
        console.log("No enterprise profile found");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <BusinessLayout>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>
      <div className="card">
        <div
          className="card-header"
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          {/* Enterprise Logo */}
          {enterprise?.enterprise_photo_url && (
            <img
              src={enterprise.enterprise_photo_url}
              alt="Enterprise Logo"
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "12px",
                objectFit: "cover",
                border: "1px solid var(--border)",
              }}
            />
          )}

          <h3 className="card-title">Business Profile</h3>

          <button
            className="btn btn-primary"
            style={{
              marginLeft: "auto",
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => alert("Edit Profile - Coming soon!")}
          >
            Edit Profile
          </button>
        </div>

        <div style={{ padding: "2rem" }}>
          {enterprise ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: "2rem",
              }}
            >
              <div>
                <h4>Company Name</h4>
                <p style={{ color: "var(--gray)" }}>
                  {enterprise.company_name || "—"}
                </p>
              </div>

              <div>
                <h4>Contact Person</h4>
                <p style={{ color: "var(--gray)" }}>
                  {enterprise.contact_person || "—"}
                </p>
              </div>

              <div>
                <h4>Email</h4>
                <p style={{ color: "var(--gray)" }}>{enterprise.email || "—"}</p>
              </div>

              <div>
                <h4>Phone</h4>
                <p style={{ color: "var(--gray)" }}>{enterprise.phone || "—"}</p>
              </div>

              <div>
                <h4>Industry Type</h4>
                <p style={{ color: "var(--gray)" }}>
                  {enterprise.industry_type || "—"}
                </p>
              </div>

              <div>
                <h4>Location</h4>
                <p style={{ color: "var(--gray)" }}>{enterprise.city || "—"}</p>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <h4>Business Description</h4>
                <p style={{ color: "var(--gray)" }}>
                  {enterprise.description || "—"}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <i
                className="fas fa-building"
                style={{ fontSize: "3rem", color: "#ccc", marginBottom: "1rem" }}
              ></i>
              <h3>No Enterprise Profile</h3>
              <p style={{ color: "var(--gray)", marginBottom: "1.5rem" }}>
                Register your enterprise to unlock advanced features
              </p>
              <button
                className="btn btn-primary"
                onClick={() => (window.location.href = "/business/enterprise")}
              >
                Register Enterprise
              </button>
            </div>
          )}
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessProfile;