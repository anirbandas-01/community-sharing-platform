import BusinessLayout from "../../components/business/BusinessLayout";

const BusinessDashboard = () => {
  return (
    <BusinessLayout>
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon revenue">💰</div>
            <div className="stat-trend up">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              12%
            </div>
          </div>
          <div className="stat-number">₹45,231</div>
          <div className="stat-label">Total Revenue</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon orders">📦</div>
            <div className="stat-trend up">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              8%
            </div>
          </div>
          <div className="stat-number">124</div>
          <div className="stat-label">Total Orders</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon products">🛍️</div>
            <div className="stat-trend up">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              5%
            </div>
          </div>
          <div className="stat-number">89</div>
          <div className="stat-label">Products Listed</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon customers">👥</div>
            <div className="stat-trend up">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              15%
            </div>
          </div>
          <div className="stat-number">456</div>
          <div className="stat-label">Customers</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <a href="/business/orders" className="action-card">
          <div className="action-icon">📋</div>
          <div className="action-title">Add New Order</div>
          <div className="action-desc">Create and manage orders</div>
        </a>
        <a href="/business/inventory" className="action-card">
          <div className="action-icon">📦</div>
          <div className="action-title">Manage Inventory</div>
          <div className="action-desc">Update stock levels</div>
        </a>
        <a href="/business/revenue" className="action-card">
          <div className="action-icon">💵</div>
          <div className="action-title">View Revenue</div>
          <div className="action-desc">Track your earnings</div>
        </a>
        <a href="/business/contact" className="action-card">
          <div className="action-icon">📧</div>
          <div className="action-title">Contact Support</div>
          <div className="action-desc">Get help anytime</div>
        </a>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Orders</h3>
            <a href="/business/orders" className="card-action">View All</a>
          </div>
          <div className="order-item">
            <div>
              <div className="order-id">#ORD-1234</div>
              <span className="order-customer">John Doe</span>
            </div>
            <div className="order-amount">₹1,250</div>
            <div className="order-status completed">Completed</div>
          </div>
          <div className="order-item">
            <div>
              <div className="order-id">#ORD-1235</div>
              <span className="order-customer">Sarah Miller</span>
            </div>
            <div className="order-amount">₹890</div>
            <div className="order-status processing">Processing</div>
          </div>
          <div className="order-item">
            <div>
              <div className="order-id">#ORD-1236</div>
              <span className="order-customer">Raj Kumar</span>
            </div>
            <div className="order-amount">₹2,100</div>
            <div className="order-status pending">Pending</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon order">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-title">New order received</div>
                <div className="activity-time">2 minutes ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon product">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-title">Product stock updated</div>
                <div className="activity-time">1 hour ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessDashboard;