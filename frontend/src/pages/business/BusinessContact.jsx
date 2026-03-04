import { useState } from "react";
import BusinessLayout from "../../components/business/BusinessLayout";

const BusinessContact = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert("Message sent successfully! We'll get back to you soon.");
      setFormData({
        subject: "",
        message: "",
      });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <BusinessLayout>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Contact Support</h3>
        </div>
        <div style={{ padding: "2rem" }}>
          <form
            onSubmit={handleSubmit}
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="What can we help you with?"
                value={formData.subject}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  border: "2px solid var(--border)",
                  borderRadius: "12px",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                Message
              </label>
              <textarea
                name="message"
                rows="6"
                placeholder="Describe your issue or question..."
                value={formData.message}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  border: "2px solid var(--border)",
                  borderRadius: "12px",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  resize: "vertical",
                }}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "1rem",
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessContact;