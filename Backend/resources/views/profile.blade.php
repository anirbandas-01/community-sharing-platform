<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>My Profile - LocalHub</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    @include('components.styles')
</head>

<body>
    @include('components.navbar', [
    'title' => 'My Profile',
    'searchPlaceholder' => 'Search...',
    'userInitials' => 'JD'
    ])

    @include('components.sidebar', [
    'menuItems' => [
    ['icon' => 'th-large', 'label' => 'Dashboard Overview', 'route' => 'professional', 'active' => false],
    ['icon' => 'briefcase', 'label' => 'My Services', 'route' => 'my-services', 'active' => false],
    ['icon' => 'calendar-check', 'label' => 'Appointments', 'route' => 'appointments', 'active' => false],
    ['icon' => 'dollar-sign', 'label' => 'My Earnings', 'route' => 'earnings', 'active' => false],
    ['icon' => 'star', 'label' => 'Reviews & Ratings', 'route' => 'reviews', 'active' => false],
    ['icon' => 'comments', 'label' => 'Messages', 'route' => 'messages', 'active' => false],
    ['icon' => 'cog', 'label' => 'Settings', 'route' => 'professional-settings', 'active' => false],
    ['icon' => 'sign-out-alt', 'label' => 'Logout', 'route' => 'logout', 'active' => false]
    ]
    ])

    <main class="main-content">
        <div style="max-width: 900px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                <div>
                    <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">My Profile</h1>
                    <p style="color: #64748b;">View and manage your profile information</p>
                </div>
                <button class="btn btn-primary" onclick="window.location.href='/professional-settings'">
                    <i class="fas fa-edit"></i> Edit Profile
                </button>
            </div>

            <!-- Profile Header Card -->
            <div class="section" style="text-align: center; margin-bottom: 24px;">
                <div id="profile-avatar" style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #7c3aed); display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; font-weight: 700; margin: 0 auto 20px;">
                    JD
                </div>
                <h2 id="profile-name" style="font-size: 26px; font-weight: 700; margin-bottom: 6px; color: #1e293b;">Loading...</h2>
                <p id="profile-specialization" style="color: #7c3aed; font-weight: 600; font-size: 16px; margin-bottom: 4px;">...</p>
                <p id="profile-email" style="color: #64748b; font-size: 15px;">...</p>
            </div>

            <!-- Basic Information -->
            <div class="section">
                <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 20px; color: #1e293b;">Basic Information</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
                    <div>
                        <label style="display: block; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Full Name</label>
                        <p id="display-name" style="font-size: 16px; color: #1e293b; font-weight: 500;">-</p>
                    </div>

                    <div>
                        <label style="display: block; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Email Address</label>
                        <p id="display-email" style="font-size: 16px; color: #1e293b; font-weight: 500;">-</p>
                    </div>

                    <div>
                        <label style="display: block; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Phone Number</label>
                        <p id="display-phone" style="font-size: 16px; color: #1e293b; font-weight: 500;">-</p>
                    </div>

                    <div>
                        <label style="display: block; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Location</label>
                        <p id="display-city" style="font-size: 16px; color: #1e293b; font-weight: 500;">-</p>
                    </div>

                    <div>
                        <label style="display: block; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">User Type</label>
                        <p id="display-user-type" style="font-size: 16px; color: #1e293b; font-weight: 500; text-transform: capitalize;">-</p>
                    </div>

                    <div>
                        <label style="display: block; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Member Since</label>
                        <p id="display-created-at" style="font-size: 16px; color: #1e293b; font-weight: 500;">-</p>
                    </div>
                </div>
            </div>

            <!-- Professional Information -->
            <div id="professional-info" class="section" style="display: none;">
                <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 20px; color: #1e293b;">Professional Information</h3>

                <div style="display: grid; gap: 24px;">
                    <div>
                        <label style="display: block; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Specialization</label>
                        <p id="display-specialization" style="font-size: 16px; color: #1e293b; font-weight: 500;">-</p>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px;">
                        <div>
                            <label style="display: block; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Experience</label>
                            <p id="display-experience" style="font-size: 16px; color: #1e293b; font-weight: 500;">-</p>
                        </div>

                        <div>
                            <label style="display: block; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Hourly Rate</label>
                            <p id="display-hourly-rate" style="font-size: 16px; color: #1e293b; font-weight: 500;">-</p>
                        </div>
                    </div>

                    <div>
                        <label style="display: block; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Qualifications</label>
                        <p id="display-qualifications" style="font-size: 16px; color: #1e293b; font-weight: 500; line-height: 1.6;">-</p>
                    </div>

                    <div>
                        <label style="display: block; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Professional Bio</label>
                        <p id="display-bio" style="font-size: 16px; color: #1e293b; font-weight: 500; line-height: 1.6;">-</p>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div style="margin-top: 32px; display: flex; gap: 12px; justify-content: center;">
                <button class="btn btn-primary" onclick="window.location.href='/professional-settings'">
                    <i class="fas fa-edit"></i> Edit Profile
                </button>
                <button class="btn btn-outline" onclick="window.history.back()">
                    <i class="fas fa-arrow-left"></i> Go Back
                </button>
            </div>
        </div>
    </main>

    @include('components.scripts')

    <script>
        const API_BASE = '/api';
        const token = localStorage.getItem('auth_token');
        const authHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        };

        document.addEventListener('DOMContentLoaded', function() {
            checkAuth();
            loadProfileData();
        });

        function checkAuth() {
            if (!token) {
                window.location.href = '/login';
            }
        }

        async function loadProfileData() {
            try {
                // Load user data
                const userResponse = await fetch(`${API_BASE}/user/profile`, {
                    headers: authHeaders
                });

                if (!userResponse.ok) {
                    throw new Error('Failed to load profile');
                }

                const userData = await userResponse.json();
                const user = userData.user;

                // Update basic info
                document.getElementById('profile-name').textContent = user.name || 'User';
                document.getElementById('profile-email').textContent = user.email || '';
                document.getElementById('display-name').textContent = user.name || '-';
                document.getElementById('display-email').textContent = user.email || '-';
                document.getElementById('display-phone').textContent = user.phone || '-';
                document.getElementById('display-city').textContent = user.city || '-';
                document.getElementById('display-user-type').textContent = user.user_type || '-';

                // Format and display member since date
                if (user.created_at) {
                    const date = new Date(user.created_at);
                    document.getElementById('display-created-at').textContent = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                    });
                }

                // Update avatar
                const avatar = document.getElementById('profile-avatar');
                if (user.profile_image) {
                    const imageUrl = `/uploads/profiles/${user.profile_image}`;
                    avatar.style.backgroundImage = `url('${imageUrl}')`;
                    avatar.style.backgroundSize = 'cover';
                    avatar.style.backgroundPosition = 'center';
                    avatar.textContent = '';
                } else if (user.name) {
                    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    avatar.textContent = initials;
                }

                // If professional, load professional data
                if (user.user_type === 'professional') {
                    loadProfessionalData();
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                alert('Failed to load profile data. Please try again.');
            }
        }

        async function loadProfessionalData() {
            try {
                const response = await fetch(`${API_BASE}/professional/profile`, {
                    headers: authHeaders
                });

                if (response.ok) {
                    const profile = await response.json();

                    // Show professional section
                    document.getElementById('professional-info').style.display = 'block';

                    // Update header specialization
                    document.getElementById('profile-specialization').textContent = profile.specialization || 'Professional';

                    // Update professional fields
                    document.getElementById('display-specialization').textContent = profile.specialization || '-';
                    document.getElementById('display-experience').textContent = profile.experience_years ?
                        `${profile.experience_years} years` : '-';
                    document.getElementById('display-hourly-rate').textContent = profile.hourly_rate ?
                        `₹${profile.hourly_rate}/hour` : '-';
                    document.getElementById('display-qualifications').textContent = profile.qualifications || '-';
                    document.getElementById('display-bio').textContent = profile.bio || '-';
                }
            } catch (error) {
                console.error('Error loading professional data:', error);
            }
        }

        function navigate(route) {
            window.location.href = `/${route}`;
        }
    </script>
</body>

</html>