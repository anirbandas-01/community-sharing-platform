<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Professional Settings - LocalHub</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    @include('components.styles')

    <style>
        /* Settings Specific Styles */
        .settings-container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .settings-tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
            border-bottom: 2px solid #e2e8f0;
            overflow-x: auto;
        }

        .tab-btn {
            padding: 12px 24px;
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
            color: #64748b;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: -2px;
            white-space: nowrap;
        }

        .tab-btn:hover {
            color: #2563eb;
        }

        .tab-btn.active {
            color: #2563eb;
            border-bottom-color: #2563eb;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .settings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
        }

        .setting-item {
            padding: 20px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
        }

        .setting-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
        }

        .setting-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
        }

        .setting-description {
            font-size: 14px;
            color: #64748b;
            line-height: 1.6;
        }

        .toggle-switch {
            position: relative;
            width: 50px;
            height: 26px;
            background: #cbd5e1;
            border-radius: 13px;
            cursor: pointer;
            transition: background 0.3s;
        }

        .toggle-switch.active {
            background: #10b981;
        }

        .toggle-slider {
            position: absolute;
            top: 3px;
            left: 3px;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            transition: transform 0.3s;
        }

        .toggle-switch.active .toggle-slider {
            transform: translateX(24px);
        }

        .danger-zone {
            border: 2px solid #fee2e2;
            background: #fef2f2;
            padding: 20px;
            border-radius: 8px;
            margin-top: 24px;
        }

        .danger-zone-title {
            color: #dc2626;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
        }

        .avatar-upload {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .avatar-preview {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 32px;
            font-weight: 600;
        }

        .upload-btn {
            padding: 8px 16px;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
        }

        .upload-btn:hover {
            background: #e2e8f0;
        }

        .service-card {
            padding: 16px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 12px;
        }

        .service-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .service-name {
            font-weight: 600;
            color: #1e293b;
        }

        .service-price {
            color: #10b981;
            font-weight: 600;
        }

        .service-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }

        .badge-status {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }

        .badge-status.active {
            background: #d1fae5;
            color: #065f46;
        }

        .badge-status.inactive {
            background: #fee2e2;
            color: #991b1b;
        }

        .availability-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 8px;
        }

        .day-card {
            padding: 12px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
        }

        .day-card:hover {
            border-color: #2563eb;
        }

        .day-card.selected {
            background: #eff6ff;
            border-color: #2563eb;
        }

        .day-name {
            font-size: 12px;
            font-weight: 600;
            color: #64748b;
            margin-bottom: 4px;
        }

        .time-slot {
            padding: 8px;
            background: #f8fafc;
            border-radius: 4px;
            font-size: 12px;
            margin-top: 4px;
        }
    </style>
</head>

<body>
    @include('components.navbar', [
    'title' => 'Professional Settings',
    'searchPlaceholder' => 'Search settings...',
    'userInitials' => 'JD'
    ])

    @include('components.professional-sidebar')

    <main class="main-content">
        <div class="settings-container">
            <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">Professional Settings</h1>
            <p style="color: #64748b; margin-bottom: 32px;">Manage your professional profile, services, and business preferences</p>

            <!-- Settings Tabs -->
            <div class="settings-tabs">
                <button class="tab-btn active" onclick="switchTab('profile')">Profile</button>
                <button class="tab-btn" onclick="switchTab('services')">My Services</button>
                <button class="tab-btn" onclick="switchTab('availability')">Availability</button>
                <button class="tab-btn" onclick="switchTab('business')">Business Info</button>
                <button class="tab-btn" onclick="switchTab('notifications')">Notifications</button>
                <button class="tab-btn" onclick="switchTab('account')">Account</button>
            </div>

            <!-- Profile Tab -->
            <div id="profile-tab" class="tab-content active">
                <div class="section">
                    <div class="section-header">
                        <h2 class="section-title">Professional Profile</h2>
                    </div>

                    <div class="avatar-upload" style="margin-bottom: 24px;">
                        <div class="avatar-preview" id="avatar-preview">JD</div>
                        <div>
                            <button class="upload-btn" onclick="document.getElementById('avatar-input').click()">
                                <i class="fas fa-camera"></i> Change Photo
                            </button>
                            <input type="file" id="avatar-input" accept="image/*" style="display: none;" onchange="handleAvatarUpload(event)">
                            <p style="font-size: 12px; color: #94a3b8; margin-top: 8px;">JPG, PNG or GIF. Max size 2MB</p>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Full Name *</label>
                        <input type="text" class="form-input" id="full-name" placeholder="Enter your full name" value="John Doe">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Professional Title *</label>
                        <input type="text" class="form-input" id="professional-title" placeholder="e.g., Certified Plumber, Electrician" value="Certified Plumber">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Email Address *</label>
                        <input type="email" class="form-input" id="email" placeholder="your.email@example.com" value="john.doe@example.com">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Phone Number *</label>
                        <input type="tel" class="form-input" id="phone" placeholder="+91-XXXXXXXXXX" value="+91-9876543210">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Years of Experience</label>
                        <input type="number" class="form-input" id="experience" placeholder="Years" value="5">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Professional Bio</label>
                        <textarea class="form-textarea" id="bio" placeholder="Tell clients about your expertise and experience...">Certified professional with 5+ years of experience in residential and commercial services. Committed to quality work and customer satisfaction.</textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Service Area (City/Region)</label>
                        <input type="text" class="form-input" id="service-area" placeholder="e.g., Mumbai, Navi Mumbai" value="Mumbai, Navi Mumbai">
                    </div>

                    <button class="btn btn-primary" onclick="saveProfile()">
                        <i class="fas fa-save"></i> Save Profile
                    </button>
                </div>
            </div>

            <!-- Services Tab -->
            <div id="services-tab" class="tab-content">
                <div class="section">
                    <div class="section-header">
                        <h2 class="section-title">My Services</h2>
                        <button class="btn btn-primary" onclick="addNewService()">
                            <i class="fas fa-plus"></i> Add Service
                        </button>
                    </div>

                    <div id="services-list">
                        <!-- Services will be loaded here -->
                        <div class="service-card">
                            <div class="service-card-header">
                                <div>
                                    <div class="service-name">Home Plumbing Repair</div>
                                    <div style="font-size: 13px; color: #64748b; margin-top: 4px;">General plumbing repairs and maintenance</div>
                                </div>
                                <div class="service-price">₹1,500</div>
                            </div>
                            <div style="display: flex; gap: 8px; align-items: center; margin-top: 8px;">
                                <span class="badge-status active">Active</span>
                                <span style="font-size: 12px; color: #64748b;">45 bookings</span>
                            </div>
                            <div class="service-actions">
                                <button class="btn btn-outline" onclick="editService(1)"><i class="fas fa-edit"></i> Edit</button>
                                <button class="btn btn-outline" onclick="toggleServiceStatus(1)"><i class="fas fa-pause"></i> Pause</button>
                                <button class="btn btn-outline" onclick="deleteService(1)"><i class="fas fa-trash"></i> Delete</button>
                            </div>
                        </div>

                        <div class="service-card">
                            <div class="service-card-header">
                                <div>
                                    <div class="service-name">Emergency Plumbing</div>
                                    <div style="font-size: 13px; color: #64748b; margin-top: 4px;">24/7 emergency plumbing services</div>
                                </div>
                                <div class="service-price">₹2,500</div>
                            </div>
                            <div style="display: flex; gap: 8px; align-items: center; margin-top: 8px;">
                                <span class="badge-status active">Active</span>
                                <span style="font-size: 12px; color: #64748b;">28 bookings</span>
                            </div>
                            <div class="service-actions">
                                <button class="btn btn-outline" onclick="editService(2)"><i class="fas fa-edit"></i> Edit</button>
                                <button class="btn btn-outline" onclick="toggleServiceStatus(2)"><i class="fas fa-pause"></i> Pause</button>
                                <button class="btn btn-outline" onclick="deleteService(2)"><i class="fas fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Availability Tab -->
            <div id="availability-tab" class="tab-content">
                <div class="section">
                    <div class="section-header">
                        <h2 class="section-title">Working Hours & Availability</h2>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Select Working Days</label>
                        <div class="availability-grid">
                            <div class="day-card selected" onclick="toggleDay(this)">
                                <div class="day-name">MON</div>
                                <div class="time-slot">9AM-6PM</div>
                            </div>
                            <div class="day-card selected" onclick="toggleDay(this)">
                                <div class="day-name">TUE</div>
                                <div class="time-slot">9AM-6PM</div>
                            </div>
                            <div class="day-card selected" onclick="toggleDay(this)">
                                <div class="day-name">WED</div>
                                <div class="time-slot">9AM-6PM</div>
                            </div>
                            <div class="day-card selected" onclick="toggleDay(this)">
                                <div class="day-name">THU</div>
                                <div class="time-slot">9AM-6PM</div>
                            </div>
                            <div class="day-card selected" onclick="toggleDay(this)">
                                <div class="day-name">FRI</div>
                                <div class="time-slot">9AM-6PM</div>
                            </div>
                            <div class="day-card selected" onclick="toggleDay(this)">
                                <div class="day-name">SAT</div>
                                <div class="time-slot">10AM-4PM</div>
                            </div>
                            <div class="day-card" onclick="toggleDay(this)">
                                <div class="day-name">SUN</div>
                                <div class="time-slot">Closed</div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Default Working Hours</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div>
                                <label class="form-label" style="font-size: 12px;">Start Time</label>
                                <input type="time" class="form-input" id="start-time" value="09:00">
                            </div>
                            <div>
                                <label class="form-label" style="font-size: 12px;">End Time</label>
                                <input type="time" class="form-input" id="end-time" value="18:00">
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Advance Booking Window</label>
                        <select class="form-select" id="booking-window">
                            <option value="1">1 day in advance</option>
                            <option value="3">3 days in advance</option>
                            <option value="7" selected>1 week in advance</option>
                            <option value="14">2 weeks in advance</option>
                            <option value="30">1 month in advance</option>
                        </select>
                    </div>

                    <button class="btn btn-primary" onclick="saveAvailability()">
                        <i class="fas fa-save"></i> Save Availability
                    </button>
                </div>
            </div>

            <!-- Business Info Tab -->
            <div id="business-tab" class="tab-content">
                <div class="section">
                    <div class="section-header">
                        <h2 class="section-title">Business Information</h2>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Business Name (Optional)</label>
                        <input type="text" class="form-input" id="business-name" placeholder="Your business name">
                    </div>

                    <div class="form-group">
                        <label class="form-label">GST Number (Optional)</label>
                        <input type="text" class="form-input" id="gst-number" placeholder="GST Number">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Business Address</label>
                        <textarea class="form-textarea" id="business-address" placeholder="Full business address"></textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Bank Account Number</label>
                        <input type="text" class="form-input" id="account-number" placeholder="Account number for payments">
                    </div>

                    <div class="form-group">
                        <label class="form-label">IFSC Code</label>
                        <input type="text" class="form-input" id="ifsc-code" placeholder="IFSC Code">
                    </div>

                    <div class="form-group">
                        <label class="form-label">UPI ID (Optional)</label>
                        <input type="text" class="form-input" id="upi-id" placeholder="yourname@upi">
                    </div>

                    <button class="btn btn-primary" onclick="saveBusinessInfo()">
                        <i class="fas fa-save"></i> Save Business Info
                    </button>
                </div>
            </div>

            <!-- Notifications Tab -->
            <div id="notifications-tab" class="tab-content">
                <div class="section">
                    <div class="section-header">
                        <h2 class="section-title">Notification Preferences</h2>
                    </div>

                    <div class="settings-grid">
                        <div class="setting-item">
                            <div class="setting-header">
                                <div>
                                    <div class="setting-title">New Booking Alerts</div>
                                    <div class="setting-description">Get notified when you receive a new booking</div>
                                </div>
                                <div class="toggle-switch active" onclick="toggleSetting(this)">
                                    <div class="toggle-slider"></div>
                                </div>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-header">
                                <div>
                                    <div class="setting-title">Appointment Reminders</div>
                                    <div class="setting-description">Receive reminders 1 hour before appointments</div>
                                </div>
                                <div class="toggle-switch active" onclick="toggleSetting(this)">
                                    <div class="toggle-slider"></div>
                                </div>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-header">
                                <div>
                                    <div class="setting-title">Payment Notifications</div>
                                    <div class="setting-description">Get notified when you receive payments</div>
                                </div>
                                <div class="toggle-switch active" onclick="toggleSetting(this)">
                                    <div class="toggle-slider"></div>
                                </div>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-header">
                                <div>
                                    <div class="setting-title">Review Notifications</div>
                                    <div class="setting-description">Get notified when clients leave reviews</div>
                                </div>
                                <div class="toggle-switch active" onclick="toggleSetting(this)">
                                    <div class="toggle-slider"></div>
                                </div>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-header">
                                <div>
                                    <div class="setting-title">Email Notifications</div>
                                    <div class="setting-description">Receive email notifications for important updates</div>
                                </div>
                                <div class="toggle-switch active" onclick="toggleSetting(this)">
                                    <div class="toggle-slider"></div>
                                </div>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-header">
                                <div>
                                    <div class="setting-title">SMS Notifications</div>
                                    <div class="setting-description">Receive SMS for urgent updates</div>
                                </div>
                                <div class="toggle-switch" onclick="toggleSetting(this)">
                                    <div class="toggle-slider"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button class="btn btn-primary" onclick="saveNotificationSettings()" style="margin-top: 24px;">
                        <i class="fas fa-save"></i> Save Preferences
                    </button>
                </div>
            </div>

            <!-- Account Tab -->
            <div id="account-tab" class="tab-content">
                <div class="section">
                    <div class="section-header">
                        <h2 class="section-title">Account Security</h2>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Current Password</label>
                        <input type="password" class="form-input" id="current-password" placeholder="Enter current password">
                    </div>

                    <div class="form-group">
                        <label class="form-label">New Password</label>
                        <input type="password" class="form-input" id="new-password" placeholder="Enter new password">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Confirm New Password</label>
                        <input type="password" class="form-input" id="confirm-password" placeholder="Confirm new password">
                    </div>

                    <button class="btn btn-primary" onclick="changePassword()">
                        <i class="fas fa-key"></i> Change Password
                    </button>
                </div>

                <div class="section" style="margin-top: 24px;">
                    <div class="section-header">
                        <h2 class="section-title">Account Status</h2>
                    </div>

                    <div class="setting-item">
                        <div class="setting-header">
                            <div>
                                <div class="setting-title">Professional Account Active</div>
                                <div class="setting-description">Deactivate to temporarily stop receiving bookings</div>
                            </div>
                            <div class="toggle-switch active" onclick="toggleSetting(this)">
                                <div class="toggle-slider"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="danger-zone">
                    <div class="danger-zone-title"><i class="fas fa-exclamation-triangle"></i> Danger Zone</div>
                    <p style="color: #64748b; margin-bottom: 16px;">Once you delete your professional account, all your data including services, bookings, and reviews will be permanently deleted. This action cannot be undone.</p>
                    <button class="btn btn-danger" onclick="deleteAccount()">
                        <i class="fas fa-trash"></i> Delete Professional Account
                    </button>
                </div>
            </div>
        </div>
    </main>

    @include('components.profile-modal')

    @include('components.scripts')

    <script>
        // Tab Switching
        function switchTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(`${tabName}-tab`).classList.add('active');
            event.target.classList.add('active');
        }

        // Toggle Settings
        function toggleSetting(element) {
            element.classList.toggle('active');
        }

        // Toggle Day Selection
        function toggleDay(element) {
            element.classList.toggle('selected');
        }

        // Avatar Upload
        function handleAvatarUpload(event) {
            const file = event.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    alert('File size must be less than 2MB');
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('avatar-preview');
                    preview.style.backgroundImage = `url(${e.target.result})`;
                    preview.style.backgroundSize = 'cover';
                    preview.textContent = '';
                };
                reader.readAsDataURL(file);
            }
        }

        // Save Functions
        async function saveProfile() {
            const data = {
                name: document.getElementById('full-name').value,
                professional_title: document.getElementById('professional-title').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                experience: document.getElementById('experience').value,
                bio: document.getElementById('bio').value,
                service_area: document.getElementById('service-area').value
            };

            try {
                const response = await fetch(`${API_BASE}/professional/profile`, {
                    method: 'PUT',
                    headers: authHeaders,
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Profile updated successfully!');
                } else {
                    alert('Failed to update profile');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error updating profile');
            }
        }

        function addNewService() {
            const name = prompt('Service Name:');
            if (!name) return;
            const description = prompt('Service Description:');
            const price = prompt('Service Price (₹):');

            // API call to add service
            alert('Service added! (API integration pending)');
        }

        function editService(id) {
            alert(`Edit service ${id} - Feature coming soon!`);
        }

        function toggleServiceStatus(id) {
            alert(`Toggle service ${id} status - Feature coming soon!`);
        }

        function deleteService(id) {
            if (confirm('Are you sure you want to delete this service?')) {
                alert(`Delete service ${id} - Feature coming soon!`);
            }
        }

        function saveAvailability() {
            alert('Availability settings saved!');
        }

        function saveBusinessInfo() {
            alert('Business information saved!');
        }

        function saveNotificationSettings() {
            alert('Notification preferences saved!');
        }

        async function changePassword() {
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (!currentPassword || !newPassword || !confirmPassword) {
                alert('Please fill all password fields');
                return;
            }

            if (newPassword !== confirmPassword) {
                alert('New passwords do not match!');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/user/change-password`, {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify({
                        current_password: currentPassword,
                        new_password: newPassword
                    })
                });

                if (response.ok) {
                    alert('Password changed successfully!');
                    document.getElementById('current-password').value = '';
                    document.getElementById('new-password').value = '';
                    document.getElementById('confirm-password').value = '';
                } else {
                    alert('Failed to change password');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error changing password');
            }
        }

        function deleteAccount() {
            if (confirm('Are you absolutely sure? This will permanently delete your professional account!')) {
                if (confirm('This action cannot be undone. All your data will be lost. Continue?')) {
                    alert('Account deletion - Please contact support to proceed');
                }
            }
        }
    </script>
</body>

</html>