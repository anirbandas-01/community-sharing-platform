<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - LocalHub</title>
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

        /* Navigation */
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

        /* Sidebar */
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

        /* Main Content */
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

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stat-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        .stat-icon.blue {
            background: #dbeafe;
            color: #2563eb;
        }

        .stat-icon.green {
            background: #d1fae5;
            color: #10b981;
        }

        .stat-icon.orange {
            background: #fed7aa;
            color: #f97316;
        }

        .stat-icon.purple {
            background: #e9d5ff;
            color: #9333ea;
        }

        .stat-label {
            font-size: 13px;
            color: #64748b;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: #1e293b;
        }

        /* Section */
        .section {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-bottom: 24px;
        }

        .section-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
        }

        /* Appointment List */
        .appointment-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .appointment-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            transition: all 0.2s;
        }

        .appointment-item:hover {
            border-color: #2563eb;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
        }

        .appointment-info {
            display: flex;
            gap: 16px;
            align-items: center;
        }

        .appointment-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
        }

        .appointment-details h4 {
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .appointment-details p {
            font-size: 13px;
            color: #64748b;
        }

        .badge {
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
        }

        .badge.success {
            background: #d1fae5;
            color: #059669;
        }

        .badge.warning {
            background: #fef3c7;
            color: #d97706;
        }

        .badge.pending {
            background: #dbeafe;
            color: #2563eb;
        }

        /* Button */
        .btn {
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-block;
        }

        .btn-primary {
            background: #2563eb;
            color: white;
        }

        .btn-primary:hover {
            background: #1d4ed8;
        }

        .btn-outline {
            background: white;
            border: 1px solid #e2e8f0;
            color: #64748b;
        }

        .btn-outline:hover {
            background: #f1f5f9;
        }

        .empty-state {
            text-align: center;
            padding: 48px 24px;
            color: #94a3b8;
        }

        .empty-state i {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.3;
        }

        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
            }

            .main-content {
                margin-left: 0;
                padding: 16px;
            }

            .stats-grid {
                grid-template-columns: 1fr;
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

    @include('components.resident-sidebar')

    <!-- Main Content -->
    <main class="main-content">
        <div class="page-header">
            <h1 class="page-title">Welcome back, <span id="welcome-name">Resident</span>! 👋</h1>
            <p class="page-subtitle">Here's what's happening with your bookings</p>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-label">Total Bookings</div>
                        <div class="stat-value" id="total-bookings">0</div>
                    </div>
                    <div class="stat-icon blue">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-label">Active Bookings</div>
                        <div class="stat-value" id="active-bookings">0</div>
                    </div>
                    <div class="stat-icon green">
                        <i class="fas fa-clock"></i>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-label">Pending Requests</div>
                        <div class="stat-value" id="pending-bookings">0</div>
                    </div>
                    <div class="stat-icon orange">
                        <i class="fas fa-hourglass-half"></i>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-label">Completed</div>
                        <div class="stat-value" id="completed-bookings">0</div>
                    </div>
                    <div class="stat-icon purple">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Upcoming Appointments -->
        <div class="section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 class="section-title" style="margin: 0;">Upcoming Appointments</h2>
                <a href="/resident/bookings" class="btn btn-outline">View All</a>
            </div>
            <div class="appointment-list" id="appointment-list">
                <!-- Appointments will load here -->
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="section">
            <h2 class="section-title">Quick Actions</h2>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <a href="/resident/services" class="btn btn-primary">
                    <i class="fas fa-search"></i> Find Professionals
                </a>
                <a href="/resident/bookings" class="btn btn-outline">
                    <i class="fas fa-calendar"></i> View Bookings
                </a>
                <a href="/resident/profile" class="btn btn-outline">
                    <i class="fas fa-user"></i> Edit Profile
                </a>
            </div>
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
                document.getElementById('welcome-name').textContent = user.name?.split(' ')[0] || 'Resident';

                // Update avatar
                const avatar = document.getElementById('user-avatar');
                if (user.name) {
                    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    avatar.textContent = initials;
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        }

        // Load appointments
        async function loadAppointments() {
            try {
                const response = await fetch(`${API_BASE}/resident/appointments`, {
                    headers: authHeaders
                });

                if (!response.ok) {
                    // If endpoint doesn't exist yet, show empty state
                    showEmptyAppointments();
                    return;
                }

                const data = await response.json();
                const appointments = data.appointments || data.data || [];

                if (appointments.length === 0) {
                    showEmptyAppointments();
                    return;
                }

                updateStats(appointments);
                displayUpcomingAppointments(appointments);
            } catch (error) {
                console.error('Error loading appointments:', error);
                showEmptyAppointments();
            }
        }

        function updateStats(appointments) {
            const total = appointments.length;
            const active = appointments.filter(a => a.status === 'confirmed').length;
            const pending = appointments.filter(a => a.status === 'pending').length;
            const completed = appointments.filter(a => a.status === 'completed').length;

            document.getElementById('total-bookings').textContent = total;
            document.getElementById('active-bookings').textContent = active;
            document.getElementById('pending-bookings').textContent = pending;
            document.getElementById('completed-bookings').textContent = completed;
        }

        function displayUpcomingAppointments(appointments) {
            const upcoming = appointments
                .filter(a => new Date(a.appointment_time) > new Date())
                .sort((a, b) => new Date(a.appointment_time) - new Date(b.appointment_time))
                .slice(0, 5);

            const container = document.getElementById('appointment-list');

            if (upcoming.length === 0) {
                showEmptyAppointments();
                return;
            }

            container.innerHTML = upcoming.map(apt => {
                const date = new Date(apt.appointment_time);
                const professional = apt.professional || {};
                const initials = professional.name ? professional.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'P';

                return `
                    <div class="appointment-item">
                        <div class="appointment-info">
                            <div class="appointment-avatar">${initials}</div>
                            <div class="appointment-details">
                                <h4>${professional.name || 'Professional'}</h4>
                                <p><i class="fas fa-calendar"></i> ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                        </div>
                        <span class="badge ${apt.status}">${apt.status}</span>
                    </div>
                `;
            }).join('');
        }

        function showEmptyAppointments() {
            const container = document.getElementById('appointment-list');
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <p>No upcoming appointments</p>
                    <a href="/resident/services" class="btn btn-primary" style="margin-top: 16px;">
                        Find Professionals
                    </a>
                </div>
            `;

            // Set all stats to 0
            document.getElementById('total-bookings').textContent = '0';
            document.getElementById('active-bookings').textContent = '0';
            document.getElementById('pending-bookings').textContent = '0';
            document.getElementById('completed-bookings').textContent = '0';
        }

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
            loadAppointments();
        });
    </script>

    <!-- Global Chatbot -->
    @include('components.chatbot')

</body>

</html>