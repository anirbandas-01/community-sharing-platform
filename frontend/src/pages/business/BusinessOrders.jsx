import { useState } from "react";
import BusinessLayout from "../../components/business/BusinessLayout";

const BusinessOrders = () => {
  const [orders] = useState([
    {
      id: "#ORD-1234",
      customer: "John Doe",
      date: "Feb 3, 2026",
      amount: 1250,
      status: "completed",
    },
    {
      id: "#ORD-1235",
      customer: "Sarah Miller",
      date: "Feb 3, 2026",
      amount: 890,
      status: "processing",
    },
    {
      id: "#ORD-1236",
      customer: "Raj Kumar",
      date: "Feb 2, 2026",
      amount: 2100,
      status: "pending",
    },
    {
      id: "#ORD-1237",
      customer: "Priya Sharma",
      date: "Feb 2, 2026",
      amount: 1750,
      status: "completed",
    },
    {
      id: "#ORD-1238",
      customer: "Mike Johnson",
      date: "Feb 1, 2026",
      amount: 3200,
      status: "processing",
    },
  ]);

  const viewOrder = (orderId) => {
    alert(`Viewing order ${orderId} - Details coming soon!`);
  };

  return (
    <BusinessLayout>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Orders</h3>
          <button
            className="btn btn-primary"
            style={{
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => alert("Add New Order - Coming soon!")}
          >
            + Add New Order
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <strong>{order.id}</strong>
                </td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>
                  <strong>₹{order.amount.toLocaleString()}</strong>
                </td>
                <td>
                  <span className={`order-status ${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button
                      className="icon-btn edit"
                      onClick={() => viewOrder(order.id)}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BusinessLayout>
  );
};

export default BusinessOrders;