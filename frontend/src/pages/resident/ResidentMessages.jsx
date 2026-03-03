import ResidentLayout from "../../components/resident/ResidentLayout";

const ResidentMessages = () => {
  return (
    <ResidentLayout>
      <div className="page-header">
        <h1 className="page-title">Messages</h1>
        <p className="page-subtitle">
          Chat with professionals about your bookings
        </p>
      </div>

      <div className="section">
        <div className="empty-state" style={{ padding: "80px 24px" }}>
          <i
            className="fas fa-inbox"
            style={{ fontSize: "64px", opacity: "0.3", marginBottom: "20px" }}
          ></i>
          <h3>No Messages Yet</h3>
          <p style={{ maxWidth: "400px", margin: "10px auto 0" }}>
            Messages will appear here when you communicate with professionals
            about your bookings
          </p>
        </div>
      </div>
    </ResidentLayout>
  );
};

export default ResidentMessages;