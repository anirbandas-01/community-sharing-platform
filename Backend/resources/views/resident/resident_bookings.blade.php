<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Bookings - LocalHub</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #f8fafc;
            color: #1e293b;
        }

        .top-nav {
            background: white;
            height: 70px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 20px;
            font-weight: 700;
            color: #2563eb;
        }

        .logo i {
            font-size: 28px;
        }

        .nav-right {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .user-menu {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 16px;
            background: #f1f5f9;
            border-radius: 8px;
            cursor: pointer;
        }

        .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 14px;
        }

        .sidebar {
            position: fixed;
            left: 0;
            top: 70px;
            bottom: 0;
            width: 260px;
            background: white;
            border-right: 1px solid #e2e8f0;
            padding: 24px 0;
            overflow-y: auto;
        }

        .sidebar-item {
            padding: 12px 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            color: #64748b;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
        }

        .sidebar-item:hover {
            background: #f1f5f9;
            color: #2563eb;
        }

        .sidebar-item.active {
            background: #eff6ff;
            color: #2563eb;
            border-right: 3px solid #2563eb;
        }

        .sidebar-item i {
            width: 20px;
            font-size: 18px;
        }

        .main-content {
            margin-left: 260px;
            margin-top: 70px;
            padding: 32px;
        }

        .page-header {
            margin-bottom: 32px;
        }

        .page-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .page-subtitle {
            color: #64748b;
            font-size: 15px;
        }

        .tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
            border-bottom: 2px solid #e2e8f0;
        }

        .tab {
            padding: 12px 24px;
            background: none;
            border: none;
            color: #64748b;
            font-weight: 500;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            margin-bottom: -2px;
            transition: all 0.2s;
        }

        .tab:hover {
            color: #2563eb;
        }

        .tab.active {
            color: #2563eb;
            border-bottom-color: #2563eb;
        }

        .booking-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .booking-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.2s;
        }

        .booking-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .booking-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
        }

        .booking-info {
            display: flex;
            gap: 16px;
            align-items: center;
        }

        .booking-avatar {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 20px;
        }

        .booking-details h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .booking-details p {
            font-size: 14px;
            color: #64748b;
        }

        .badge {
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            text-transform: capitalize;
        }

        .badge.pending {
            background: #dbeafe;
            color: #2563eb;
        }

        .badge.confirmed {
            background: #d1fae5;
            color: #059669;
        }

        .badge.cancelled {
            background: #fee2e2;
            color: #dc2626;
        }

        .badge.completed {
            background: #e9d5ff;
            color: #9333ea;
        }

        .booking-meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin: 16px 0;
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
        }

        .meta-item {
            font-size: 13px;
        }

        .meta-label {
            color: #64748b;
            margin-bottom: 4px;
        }

        .meta-value {
            font-weight: 600;
            color: #1e293b;
        }

        .booking-actions {
            display: flex;
            gap: 8px;
            margin-top: 16px;
        }

        .btn {
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        }

        .btn-primary {
            background: #2563eb;
            color: white;
        }

        .btn-primary:hover {
            background: #1d4ed8;
        }

        .btn-danger {
            background: #ef4444;
            color: white;
        }

        .btn-danger:hover {
            background: #dc2626;
        }

        .btn-outline {
            background: white;
            border: 1px solid #e2e8f0;
            color: #64748b;
        }

        .btn-outline:hover {
            background: #f1f5f9;
        }

        .btn-sm {
            padding: 8px 16px;
            font-size: 13px;
        }

        .empty-state {
            text-align: center;
            padding: 64px 24px;
            color: #94a3b8;
        }

        .empty-state i {
            font-size: 64px;
            margin-bottom: 20px;
            opacity: 0.3;
        }

        .empty-state h3 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #64748b;
        }

        .empty-state p {
            font-size: 15px;
        }

        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
            }

            .main-content {
                margin-left: 0;
                padding: 16px;
            }

            .booking-header {
                flex-direction: column;
                gap: 12px;
            }

            .booking-meta {
                grid-template-columns: 1fr;
            }

            .tabs {
                overflow-x: auto;
            }
        }
    </style>
</head>

<body>
    <!-- Navigation -->
    <nav class="top-nav">
        <div class="logo">
            <i class="fas fa-network-wired"></i>
            <span>LocalHub</span>
        </div>
        <div class="nav-right">
            <div class="user-menu" onclick="logout()">
                <div class="user-avatar" id="user-avatar">R</div>
                <span id="user-name">Loading...</span>
                <i class="fas fa-sign-out-alt"></i>
            </div>
        </div>
    </nav>

    <!-- Sidebar -->
    <aside class="sidebar">
        <a href="/resident/dashboard" class="sidebar-item">
            <i class="fas fa-home"></i>
            Dashboard
        </a>
        <a href="/resident/services" class="sidebar-item">
            <i class="fas fa-search"></i>
            Find Services
        </a>
        <a href="/resident/bookings" class="sidebar-item active">
            <i class="fas fa-calendar-check"></i>
            My Bookings
        </a>
        <a href="/resident/messages" class="sidebar-item">
            <i class="fas fa-comments"></i>
            Messages
        </a>
        <a href="/resident/profile" class="sidebar-item">
            <i class="fas fa-user"></i>
            My Profile
        </a>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <div class="page-header">
            <h1 class="page-title">My Bookings</h1>
            <p class="page-subtitle">Manage your appointments and service bookings</p>
        </div>

        <!-- Filter Tabs -->
        <div class="tabs">
            <button class="tab active" onclick="filterBookings('all')">All Bookings</button>
            <button class="tab" onclick="filterBookings('upcoming')">Upcoming</button>
            <button class="tab" onclick="filterBookings('pending')">Pending</button>
            <button class="tab" onclick="filterBookings('completed')">Completed</button>
            <button class="tab" onclick="filterBookings('cancelled')">Cancelled</button>
        </div>

        <!-- Bookings List -->
        <div id="bookings-container" class="booking-list">
            <!-- Bookings will load here -->
        </div>
    </main>

    <script>
        const API_BASE = '/api';
        const token = localStorage.getItem('auth_token');

        if (!token) {
            window.location.href = '/login';
        }

        const authHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        };

        let allBookings = [];
        let currentFilter = 'all';

        // Load user data
        async function loadUserData() {
            try {
                const response = await fetch(`${API_BASE}/user/profile`, {
                    headers: authHeaders
                });

                if (!response.ok) throw new Error('Failed to load profile');

                const data = await response.json();
                const user = data.user || data;

                document.getElementById('user-name').textContent = user.name || 'Resident';

                const avatar = document.getElementById('user-avatar');
                if (user.name) {
                    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    avatar.textContent = initials;
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        }

        // Load bookings
        async function loadBookings() {
            try {
                const response = await fetch(`${API_BASE}/resident/appointments`, {
                    headers: authHeaders
                });

                if (!response.ok) {
                    showEmptyState('No bookings found', 'You haven\'t made any bookings yet');
                    return;
                }

                const data = await response.json();
                allBookings = data.appointments || [];

                if (allBookings.length === 0) {
                    showEmptyState('No bookings found', 'You haven\'t made any bookings yet');
                } else {
                    displayBookings(allBookings);
                }
            } catch (error) {
                console.error('Error loading bookings:', error);
                showEmptyState('Error loading bookings', 'Please try again later');
            }
        }

        // Display bookings
        function displayBookings(bookings) {
            const container = document.getElementById('bookings-container');

            if (bookings.length === 0) {
                showEmptyState('No bookings found', 'Try adjusting your filters');
                return;
            }

            container.innerHTML = bookings.map(booking => {
                const professional = booking.professional || {};
                const service = booking.service || {};
                const date = new Date(booking.appointment_time);
                const initials = professional.name ?
                    professional.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) :
                    'P';

                const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
                const isUpcoming = date > new Date();
                
                let statusMessage = '';
                if (booking.status === 'pending') {
                    statusMessage = '<div style="background: #fef3c7; padding: 8px; border-radius: 6px; margin-top: 12px; font-size: 13px; color: #92400e;"><i class="fas fa-clock"></i> Waiting for professional to accept</div>';
                } else if (booking.status === 'confirmed') {
                    statusMessage = '<div style="background: #d1fae5; padding: 8px; border-radius: 6px; margin-top: 12px; font-size: 13px; color: #065f46;"><i class="fas fa-check-circle"></i> Confirmed! Professional will contact you soon</div>';
                } else if (booking.status === 'cancelled') {
                    statusMessage = '<div style="background: #fee2e2; padding: 8px; border-radius: 6px; margin-top: 12px; font-size: 13px; color: #991b1b;"><i class="fas fa-times-circle"></i> This booking was cancelled</div>';
                }

                return `
                    <div class="booking-card">
                        <div class="booking-header">
                            <div class="booking-info">
                                <div class="booking-avatar">${initials}</div>
                                <div class="booking-details">
                                    <h3>${professional.name || 'Professional'}</h3>
                                    <p>${service.name || 'Service'}</p>
                                </div>
                            </div>
                            <span class="badge ${booking.status}">${booking.status}</span>
                        </div>

                        <div class="booking-meta">
                            <div class="meta-item">
                                <div class="meta-label">Date & Time</div>
                                <div class="meta-value">
                                    <i class="fas fa-calendar"></i> ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                            ${booking.total_price ? `
                                <div class="meta-item">
                                    <div class="meta-label">Amount</div>
                                    <div class="meta-value">₹${booking.total_price}</div>
                                </div>
                            ` : ''}
                            ${booking.notes ? `
                                <div class="meta-item">
                                    <div class="meta-label">Notes</div>
                                    <div class="meta-value">${booking.notes}</div>
                                </div>
                            ` : ''}
                        </div>
                              
                         ${statusMessage}

                        <div class="booking-actions">
                            ${canCancel && isUpcoming ? `
                                <button onclick="cancelBooking(${booking.id})" class="btn btn-danger btn-sm">
                                    <i class="fas fa-times"></i> Cancel Booking
                                </button>
                            ` : ''}
                            <button onclick="viewDetails(${booking.id})" class="btn btn-outline btn-sm">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Filter bookings
        function filterBookings(filter) {
            currentFilter = filter;

            // Update active tab
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');

            let filtered = [];

            switch (filter) {
                case 'all':
                    filtered = allBookings;
                    break;
                case 'upcoming':
                    filtered = allBookings.filter(b => new Date(b.appointment_time) > new Date() && b.status !== 'cancelled');
                    break;
                case 'pending':
                    filtered = allBookings.filter(b => b.status === 'pending');
                    break;
                case 'completed':
                    filtered = allBookings.filter(b => b.status === 'completed');
                    break;
                case 'cancelled':
                    filtered = allBookings.filter(b => b.status === 'cancelled');
                    break;
            }

            displayBookings(filtered);
        }

        // Cancel booking
        async function cancelBooking(bookingId) {
            if (!confirm('Are you sure you want to cancel this booking?')) return;

            try {
                const response = await fetch(`${API_BASE}/resident/appointments/${bookingId}/cancel`, {
                    method: 'PUT',
                    headers: authHeaders
                });

                if (!response.ok) throw new Error('Failed to cancel booking');

                alert('Booking cancelled successfully');
                loadBookings(); // Reload bookings
            } catch (error) {
                console.error('Error cancelling booking:', error);
                alert('Failed to cancel booking. Please try again.');
            }
        }

        // View details
        function viewDetails(bookingId) {
            alert(`Viewing details for booking #${bookingId}`);
            // TODO: Open modal or navigate to details page
        }

        // Show empty state
        function showEmptyState(title, message) {
            const container = document.getElementById('bookings-container');
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>${title}</h3>
                    <p>${message}</p>
                    ${currentFilter === 'all' ? `
                        <a href="/resident/services" class="btn btn-primary" style="margin-top: 20px;">
                            <i class="fas fa-search"></i> Find Professionals
                        </a>
                    ` : ''}
                </div>
            `;
        }

        // Logout
        function logout() {
            if (!confirm('Are you sure you want to logout?')) return;

            fetch(`${API_BASE}/logout`, {
                    method: 'POST',
                    headers: authHeaders
                })
                .then(() => {
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                })
                .catch(() => {
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                });
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadUserData();
            loadBookings();
        });
    </script>
</body>

</html>