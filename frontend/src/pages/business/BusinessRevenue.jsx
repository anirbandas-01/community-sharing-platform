import BusinessLayout from "../../components/business/BusinessLayout";

const BusinessRevenue = () => {
  return (
    <BusinessLayout>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Revenue Overview</h3>
        </div>
        <div style={{ padding: "2rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                background: "var(--light-gray)",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  color: "var(--success)",
                  marginBottom: "0.5rem",
                }}
              >
                ₹45,231
              </div>
              <div style={{ color: "var(--gray)", fontWeight: 600 }}>
                This Month
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                background: "var(--light-gray)",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  color: "var(--primary)",
                  marginBottom: "0.5rem",
                }}
              >
                ₹1,24,567
              </div>
              <div style={{ color: "var(--gray)", fontWeight: 600 }}>
                This Quarter
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                background: "var(--light-gray)",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  color: "var(--warning)",
                  marginBottom: "0.5rem",
                }}
              >
                ₹4,89,230
              </div>
              <div style={{ color: "var(--gray)", fontWeight: 600 }}>
                This Year
              </div>
            </div>
          </div>
          <div
            style={{
              height: "300px",
              background: "var(--light-gray)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--gray)",
              fontWeight: 600,
            }}
          >
            📊 Revenue Chart Placeholder
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessRevenue;