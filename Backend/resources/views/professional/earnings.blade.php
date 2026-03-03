<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>My Earnings - LocalHub</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    @include('components.styles')

    <style>
        /* Earnings Specific Styles */
        .earnings-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-bottom: 16px;
        }

        .stat-icon.green {
            background: #f0fdf4;
            color: #10b981;
        }

        .stat-icon.blue {
            background: #eff6ff;
            color: #2563eb;
        }

        .stat-icon.purple {
            background: #faf5ff;
            color: #a855f7;
        }

        .stat-icon.orange {
            background: #fff7ed;
            color: #f97316;
        }

        .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 4px;
        }

        .stat-label {
            font-size: 14px;
            color: #64748b;
        }

        .earnings-table {
            width: 100%;
            border-collapse: collapse;
        }

        .earnings-table th {
            text-align: left;
            padding: 12px;
            border-bottom: 2px solid #e2e8f0;
            color: #64748b;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .earnings-table td {
            padding: 16px 12px;
            border-bottom: 1px solid #f1f5f9;
        }

        .earnings-table tr:hover {
            background: #f8fafc;
        }

        .amount-positive {
            color: #10b981;
            font-weight: 600;
        }

        .amount-pending {
            color: #f59e0b;
            font-weight: 600;
        }

        .period-selector {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
        }

        .period-btn {
            padding: 8px 16px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }

        .period-btn:hover {
            background: #f1f5f9;
        }

        .period-btn.active {
            background: #2563eb;
            color: white;
            border-color: #2563eb;
        }
    </style>
</head>

<body>
    @include('components.navbar', [
    'title' => 'My Earnings',
    'searchPlaceholder' => 'Search transactions...',
    'userInitials' => 'JD'
    ])

    @include('components.professional-sidebar')

    <main class="main-content">
        <div>
            <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">My Earnings</h1>
            <p style="color: #64748b; margin-bottom: 32px;">Track your income and transactions</p>

            <!-- Period Selector -->
            <div class="period-selector">
                <button class="period-btn active" onclick="changePeriod('week')">This Week</button>
                <button class="period-btn" onclick="changePeriod('month')">This Month</button>
                <button class="period-btn" onclick="changePeriod('year')">This Year</button>
                <button class="period-btn" onclick="changePeriod('all')">All Time</button>
            </div>

            <!-- Earnings Stats -->
            <div class="earnings-stats">
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="fas fa-rupee-sign"></i>
                    </div>
                    <div class="stat-value" id="total-earnings">₹0</div>
                    <div class="stat-label">Total Earnings</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="fas fa-wallet"></i>
                    </div>
                    <div class="stat-value" id="available-balance">₹0</div>
                    <div class="stat-label">Available Balance</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-value" id="pending-amount">₹0</div>
                    <div class="stat-label">Pending Payments</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon purple">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-value" id="total-bookings">0</div>
                    <div class="stat-label">Total Bookings</div>
                </div>
            </div>

            <!-- Transactions Table -->
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">Recent Transactions</h2>
                    <button class="btn btn-primary" onclick="requestPayout()">
                        <i class="fas fa-money-bill-wave"></i> Request Payout
                    </button>
                </div>

                <div id="transactions-container">
                    <div style="text-align: center; padding: 48px;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #cbd5e1;"></i>
                        <p style="color: #94a3b8; margin-top: 16px;">Loading transactions...</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    @include('components.profile-modal')

    @include('components.scripts')

    <script>
        let currentPeriod = 'week';

        document.addEventListener('DOMContentLoaded', function() {
            loadEarnings();
        });

        // Load earnings data
        async function loadEarnings() {
            try {
                const response = await fetch(`${API_BASE}/professional/dashboard`, {
                    method: 'GET',
                    headers: authHeaders
                });

                if (!response.ok) throw new Error('Failed to load earnings');

                const data = await response.json();
                updateEarningsStats(data);
                renderTransactions(data.transactions || []);
            } catch (error) {
                console.error('Error loading earnings:', error);
                showEmptyState();
            }
        }

        // Update earnings statistics
        function updateEarningsStats(data) {
            document.getElementById('total-earnings').textContent = `₹${data.earnings?.total || 0}`;
            document.getElementById('available-balance').textContent = `₹${data.earnings?.available || 0}`;
            document.getElementById('pending-amount').textContent = `₹${data.earnings?.pending || 0}`;
            document.getElementById('total-bookings').textContent = data.appointments?.total || 0;
        }

        // Render transactions table
        function renderTransactions(transactions) {
            const container = document.getElementById('transactions-container');

            if (transactions.length === 0) {
                showEmptyState();
                return;
            }

            container.innerHTML = `
                <table class="earnings-table">
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
                        ${transactions.map(txn => `
                            <tr>
                                <td>${txn.date || 'N/A'}</td>
                                <td>${txn.client_name || 'Client'}</td>
                                <td>${txn.service_name || 'Service'}</td>
                                <td class="${txn.status === 'paid' ? 'amount-positive' : 'amount-pending'}">
                                    ₹${txn.amount || 0}
                                </td>
                                <td>
                                    <span class="status-badge ${txn.status || 'pending'}">
                                        ${(txn.status || 'pending').toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        // Change period
        function changePeriod(period) {
            currentPeriod = period;

            // Update active button
            document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            // Reload data for the selected period
            loadEarnings();
        }

        // Request payout
        function requestPayout() {
            alert('Payout request feature coming soon! You will be able to withdraw your available balance.');
        }

        // Show empty state
        function showEmptyState() {
            const container = document.getElementById('transactions-container');
            container.innerHTML = `
                <div style="text-align: center; padding: 64px 32px;">
                    <i class="fas fa-receipt" style="font-size: 64px; color: #cbd5e1; margin-bottom: 16px;"></i>
                    <h3 style="font-size: 20px; font-weight: 600; color: #1e293b; margin-bottom: 8px;">No Transactions Yet</h3>
                    <p style="color: #64748b;">Your transaction history will appear here</p>
                </div>
            `;
        }
    </script>
</body>

</html>