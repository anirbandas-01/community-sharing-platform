<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile - LocalHub</title>
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
            max-width: 900px;
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

        .profile-header {
            text-align: center;
            padding: 32px;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            border-radius: 12px;
            color: white;
            margin-bottom: 24px;
        }

        .profile-avatar-large {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 48px;
            font-weight: 700;
            color: #2563eb;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .profile-name {
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .profile-email {
            opacity: 0.9;
            font-size: 15px;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }

        .form-group {
            margin-bottom: 0;
        }

        .form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #475569;
            margin-bottom: 8px;
        }

        .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s;
        }

        .form-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-input:disabled {
            background: #f8fafc;
            color: #94a3b8;
            cursor: not-allowed;
        }

        .btn {
            padding: 12px 24px;
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

        .btn-outline {
            background: white;
            border: 1px solid #e2e8f0;
            color: #64748b;
        }

        .btn-outline:hover {
            background: #f1f5f9;
        }

        .edit-mode-buttons {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-label {
            color: #64748b;
            font-size: 14px;
        }

        .info-value {
            font-weight: 500;
            color: #1e293b;
        }

        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
            }

            .main-content {
                margin-left: 0;
                padding: 16px;
            }

            .form-grid {
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
                <div class="user-avatar" id="nav-avatar">R</div>
                <span id="nav-name">Loading...</span>
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
        <a href="/resident/bookings" class="sidebar-item">
            <i class="fas fa-calendar-check"></i>
            My Bookings
        </a>
        <a href="/resident/messages" class="sidebar-item">
            <i class="fas fa-comments"></i>
            Messages
        </a>
        <a href="/resident/profile" class="sidebar-item active">
            <i class="fas fa-user"></i>
            My Profile
        </a>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <div class="page-header">
            <h1 class="page-title">My Profile</h1>
            <p class="page-subtitle">Manage your personal information</p>
        </div>

        <!-- Profile Header -->
        <div class="profile-header">
            <div class="profile-avatar-large" id="profile-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="profile-name" id="profile-name">Loading...</div>
            <div class="profile-email" id="profile-email">loading@example.com</div>
        </div>

        <!-- Profile Information -->
        <div class="section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 class="section-title" style="margin: 0;">Personal Information</h2>
                <button onclick="toggleEditMode()" class="btn btn-outline" id="edit-btn">
                    <i class="fas fa-edit"></i> Edit Profile
                </button>
            </div>

            <!-- View Mode -->
            <div id="view-mode">
                <div class="info-row">
                    <span class="info-label">Full Name</span>
                    <span class="info-value" id="view-name">-</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email Address</span>
                    <span class="info-value" id="view-email">-</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone Number</span>
                    <span class="info-value" id="view-phone">-</span>
                </div>
                <div class="info-row">
                    <span class="info-label">City</span>
                    <span class="info-value" id="view-city">-</span>
                </div>
                <div class="info-row">
                    <span class="info-label">State</span>
                    <span class="info-value" id="view-state">-</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Member Since</span>
                    <span class="info-value" id="view-member-since">-</span>
                </div>
            </div>

            <!-- Edit Mode -->
            <div id="edit-mode" style="display: none;">
                <form id="profile-form" onsubmit="saveProfile(event)">
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Full Name *</label>
                            <input type="text" id="edit-name" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email Address</label>
                            <input type="email" id="edit-email" class="form-input" disabled>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Phone Number</label>
                            <input type="tel" id="edit-phone" class="form-input">
                        </div>
                        <div class="form-group">
                            <label class="form-label">City</label>
                            <input type="text" id="edit-city" class="form-input">
                        </div>
                        <div class="form-group">
                            <label class="form-label">State</label>
                            <input type="text" id="edit-state" class="form-input">
                        </div>
                    </div>

                    <div class="edit-mode-buttons">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                        <button type="button" onclick="cancelEdit()" class="btn btn-outline">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Account Settings -->
        <div class="section">
            <h2 class="section-title">Account Settings</h2>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <button onclick="changePassword()" class="btn btn-outline">
                    <i class="fas fa-key"></i> Change Password
                </button>
                <button onclick="logout()" class="btn btn-outline" style="color: #dc2626;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
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

        let userData = null;

        // Load user data
        async function loadUserData() {
            try {
                const response = await fetch(`${API_BASE}/user/profile`, {
                    headers: authHeaders
                });

                if (!response.ok) throw new Error('Failed to load profile');

                const data = await response.json();
                userData = data.user || data;

                updateUI(userData);
            } catch (error) {
                console.error('Error loading user data:', error);
                alert('Failed to load profile data');
            }
        }

        // Update UI with user data
        function updateUI(user) {
            // Navigation
            document.getElementById('nav-name').textContent = user.name || 'Resident';
            const navAvatar = document.getElementById('nav-avatar');
            if (user.name) {
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                navAvatar.textContent = initials;
            }

            // Profile Header
            document.getElementById('profile-name').textContent = user.name || 'User';
            document.getElementById('profile-email').textContent = user.email || '';

            const profileAvatar = document.getElementById('profile-avatar');
            if (user.name) {
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                profileAvatar.textContent = initials;
                profileAvatar.innerHTML = initials;
            }

            // View Mode
            document.getElementById('view-name').textContent = user.name || '-';
            document.getElementById('view-email').textContent = user.email || '-';
            document.getElementById('view-phone').textContent = user.phone || '-';
            document.getElementById('view-city').textContent = user.city || '-';
            document.getElementById('view-state').textContent = user.state || '-';

            if (user.created_at) {
                const date = new Date(user.created_at);
                document.getElementById('view-member-since').textContent = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }

            // Edit Mode
            document.getElementById('edit-name').value = user.name || '';
            document.getElementById('edit-email').value = user.email || '';
            document.getElementById('edit-phone').value = user.phone || '';
            document.getElementById('edit-city').value = user.city || '';
            document.getElementById('edit-state').value = user.state || '';
        }

        // Toggle edit mode
        function toggleEditMode() {
            const viewMode = document.getElementById('view-mode');
            const editMode = document.getElementById('edit-mode');
            const editBtn = document.getElementById('edit-btn');

            if (viewMode.style.display === 'none') {
                cancelEdit();
            } else {
                viewMode.style.display = 'none';
                editMode.style.display = 'block';
                editBtn.style.display = 'none';
            }
        }

        // Cancel edit
        function cancelEdit() {
            document.getElementById('view-mode').style.display = 'block';
            document.getElementById('edit-mode').style.display = 'none';
            document.getElementById('edit-btn').style.display = 'block';

            // Reset form to original values
            updateUI(userData);
        }

        // Save profile
        async function saveProfile(event) {
            event.preventDefault();

            const updatedData = {
                name: document.getElementById('edit-name').value,
                phone: document.getElementById('edit-phone').value,
                city: document.getElementById('edit-city').value,
                state: document.getElementById('edit-state').value
            };

            try {
                const response = await fetch(`${API_BASE}/user/profile`, {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify(updatedData)
                });

                if (!response.ok) throw new Error('Failed to update profile');

                const data = await response.json();
                alert('Profile updated successfully!');

                // Reload user data
                await loadUserData();
                cancelEdit();
            } catch (error) {
                console.error('Error saving profile:', error);
                alert('Failed to update profile. Please try again.');
            }
        }

        // Change password
        function changePassword() {
            const currentPassword = prompt('Enter your current password:');
            if (!currentPassword) return;

            const newPassword = prompt('Enter your new password:');
            if (!newPassword) return;

            const confirmPassword = prompt('Confirm your new password:');
            if (newPassword !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            fetch(`${API_BASE}/user/change-password`, {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify({
                        current_password: currentPassword,
                        new_password: newPassword,
                        new_password_confirmation: confirmPassword
                    })
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.message.includes('successfully')) {
                        localStorage.removeItem('auth_token');
                        window.location.href = '/login';
                    }
                })
                .catch(error => {
                    console.error('Error changing password:', error);
                    alert('Failed to change password');
                });
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
        });
    </script>
</body>

</html>