import { useState, useEffect } from "react";
import ProfessionalLayout from "../../components/professional/ProfessionalLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const ProfessionalEarnings = () => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    availableBalance: 0,
    pendingAmount: 0,
    totalBookings: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [currentPeriod, setCurrentPeriod] = useState("week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, [currentPeriod]);

  const loadEarnings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/professional/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load earnings");

      const data = await response.json();
      
      // Update earnings stats
      setStats({
        totalEarnings: data.earnings?.total || 0,
        availableBalance: data.earnings?.available || 0,
        pendingAmount: data.earnings?.pending || 0,
        totalBookings: data.appointments?.total || 0,
      });

      // Update transactions
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Error loading earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  const changePeriod = (period) => {
    setCurrentPeriod(period);
  };

  const requestPayout = () => {
    alert("Payout request feature coming soon! You will be able to withdraw your available balance.");
  };

  if (loading) {
    return (
      <ProfessionalLayout>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading earnings...</p>
        </div>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout>
      <div className="page-header">
        <h1 className="page-title">My Earnings</h1>
        <p className="page-subtitle">Track your income and transactions</p>
      </div>

      {/* Period Selector */}
      <div className="period-selector">
        <button
          className={`period-btn ${currentPeriod === "week" ? "active" : ""}`}
          onClick={() => changePeriod("week")}
        >
          This Week
        </button>
        <button
          className={`period-btn ${currentPeriod === "month" ? "active" : ""}`}
          onClick={() => changePeriod("month")}
        >
          This Month
        </button>
        <button
          className={`period-btn ${currentPeriod === "year" ? "active" : ""}`}
          onClick={() => changePeriod("year")}
        >
          This Year
        </button>
        <button
          className={`period-btn ${currentPeriod === "all" ? "active" : ""}`}
          onClick={() => changePeriod("all")}
        >
          All Time
        </button>
      </div>

      {/* Earnings Stats */}
      <div className="earnings-stats">
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="fas fa-rupee-sign"></i>
          </div>
          <div className="stat-value">₹{stats.totalEarnings.toLocaleString()}</div>
          <div className="stat-label">Total Earnings</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="stat-value">₹{stats.availableBalance.toLocaleString()}</div>
          <div className="stat-label">Available Balance</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-value">₹{stats.pendingAmount.toLocaleString()}</div>
          <div className="stat-label">Pending Payments</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-value">{stats.totalBookings}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="section">
        <div className="section-header-row">
          <h2 className="section-title">Recent Transactions</h2>
          <button onClick={requestPayout} className="btn btn-primary">
            <i className="fas fa-money-bill-wave"></i> Request Payout
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-receipt"></i>
            <h3>No Transactions Yet</h3>
            <p>Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="earnings-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, index) => (
                  <tr key={index}>
                    <td>{txn.date || "N/A"}</td>
                    <td>{txn.client_name || "Client"}</td>
                    <td>{txn.service_name || "Service"}</td>
                    <td className={txn.status === "paid" ? "amount-positive" : "amount-pending"}>
                      ₹{txn.amount || 0}
                    </td>
                    <td>
                      <span className={`badge ${txn.status || "pending"}`}>
                        {(txn.status || "pending").toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProfessionalLayout>
  );
};

export default ProfessionalEarnings;