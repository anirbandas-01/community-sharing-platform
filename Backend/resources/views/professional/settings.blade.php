<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Settings - LocalHub</title>
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
    </style>
</head>

<body>
    @include('components.navbar', [
    'title' => 'LocalHub',
    'searchPlaceholder' => 'Search settings...',
    'userInitials' => 'JD'
    ])

    @include('components.professional-sidebar')

    <main class="main-content">
        <div class="settings-container">
            <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">Settings</h1>
            <p style="color: #64748b; margin-bottom: 32px;">Manage your account settings and preferences</p>

            <!-- Settings Tabs -->
            <div class="settings-tabs">
                <button class="tab-btn active" onclick="switchTab('profile')">Profile</button>
                <button class="tab-btn" onclick="switchTab('account')">Account</button>
                <button class="tab-btn" onclick="switchTab('notifications')">Notifications</button>
                <button class="tab-btn" onclick="switchTab('privacy')">Privacy & Security</button>
                <button class="tab-btn" onclick="switchTab('preferences')">Preferences</button>
            </div>

            <!-- Profile Tab -->
            <div id="profile-tab" class="tab-content active">
                <div class="section">
                    <div class="section-header">
                        <h2 class="section-title">Profile Information</h2>
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
                        <label class="form-label">Full Name</label>
                        <input type="text" class="form-input" id="full-name" placeholder="Enter your full name" value="John Doe">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Email Address</label>
                        <input type="email" class="form-input" id="email" placeholder="your.email@example.com" value="john.doe@example.com">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Phone Number</label>
                        <input type="tel" class="form-input" id="phone" placeholder="+91-XXXXXXXXXX" value="+91-9876543210">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Bio</label>
                        <textarea class="form-textarea" id="bio" placeholder="Tell us about yourself...">Professional service provider with 5+ years of experience.</textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Location</label>
                        <input type="text" class="form-input" id="location" placeholder="City, State" value="Mumbai, Maharashtra">
                    </div>

                    <button class="btn btn-primary" onclick="saveProfile()">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                </div>
            </div>

            <!-- Account Tab -->
            <div id="account-tab" class="tab-content">
                <div class="section">
                    <div class="section-header">
                        <h2 class="section-title">Account Settings</h2>
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

                <div class="danger-zone">
                    <div class="danger-zone-title"><i class="fas fa-exclamation-triangle"></i> Danger Zone</div>
                    <p style="color: #64748b; margin-bottom: 16px;">Once you delete your account, there is no going back. Please be certain.</p>
                    <button class="btn btn-danger" onclick="deleteAccount()">
                        <i class="fas fa-trash"></i> Delete Account
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
                                    <div class="setting-title">Push Notifications</div>
                                    <div class="setting-description">Get push notifications on your device</div>
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
                                    <div class="setting-description">Receive reminders for upcoming appointments</div>
                                </div>
                                <div class="toggle-switch active" onclick="toggleSetting(this)">
                                    <div class="toggle-slider"></div>
                                </div>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-header">
                                <div>
                                    <div class="setting-title">New Review Alerts</div>
                                    <div class="setting-description">Get notified when you receive a new review</div>
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
                                    <div class="setting-description">Receive notifications for payment updates</div>
                                </div>
                                <div class="toggle-switch active" onclick="toggleSetting(this)">
                                    <div class="toggle-slider"></div>
                                </div>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-header">
                                <div>
                                    <div class="setting-title">Marketing Emails</div>
                                    <div class="setting-description">Receive promotional and marketing emails</div>
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

            <!-- Privacy Tab -->
            <div id="privacy-tab" class="tab-content">
                <div class="section">
                    <div class="section-header">
                        <h2 class="section-title">Privacy & Security</h2>
                    </div>

                    <div class="settings-grid">
                        <div class="setting-item">
                            <div class="setting-header">
                                <div>
                                    <div class="setting-title">Profile Visibility</div>
                                    <div class="setting-description">Make your profile visible to other users</div>
                                </div>
                                <div class="toggle-switch active" onclick="toggleSetting(this)">
                                    <div class="toggle-slider"></div>
                                </div>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-header">
                                <div>
                                    <div class="setting-title">Show Online Status</div>
                                    <div class="setting-description">Let others see when you're online</div>
                                </div>
                                <div class="toggle-switch active" onclick="toggleSetting(this)">
                                    <div class="toggle-slider"></div>
                                </div>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-header">
                                <div>
                                    <div class="setting-title">Two-Factor Authentication</div>
                                    <div class="setting-description">Add an extra layer of security</div>
                                </div>
                                <div class="toggle-switch" onclick="toggleSetting(this)">
                                    <div class="toggle-slider"></div>
                                </div>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-header">
                                <div>
                                    <div class="setting-title">Data Sharing</div>
                                    <div class="setting-description">Share analytics data to improve services</div>
                                </div>
                                <div class="toggle-switch active" onclick="toggleSetting(this)">
                                    <div class="toggle-slider"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button class="btn btn-primary" onclick="savePrivacySettings()" style="margin-top: 24px;">
                        <i class="fas fa-save"></i> Save Settings
                    </button>
                </div>
            </div>

            <!-- Preferences Tab -->
            <div id="preferences-tab" class="tab-content">
                <div class="section">
                    <div class="section-header">
                        <h2 class="section-title">General Preferences</h2>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Language</label>
                        <select class="form-select" id="language">
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="mr">Marathi</option>
                            <option value="ta">Tamil</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Timezone</label>
                        <select class="form-select" id="timezone">
                            <option value="IST">India Standard Time (IST)</option>
                            <option value="UTC">UTC</option>
                            <option value="EST">Eastern Standard Time (EST)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Currency</label>
                        <select class="form-select" id="currency">
                            <option value="INR">Indian Rupee (₹)</option>
                            <option value="USD">US Dollar ($)</option>
                            <option value="EUR">Euro (€)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Date Format</label>
                        <select class="form-select" id="date-format">
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                    </div>

                    <button class="btn btn-primary" onclick="savePreferences()">
                        <i class="fas fa-save"></i> Save Preferences
                    </button>
                </div>
            </div>
        </div>
    </main>

    @include('components.scripts')

    <script>
        // Tab Switching
        function switchTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

            // Show selected tab
            document.getElementById(`${tabName}-tab`).classList.add('active');
            event.target.classList.add('active');
        }

        // Toggle Settings
        function toggleSetting(element) {
            element.classList.toggle('active');
        }

        // Avatar Upload
        function handleAvatarUpload(event) {
            const file = event.target.files[0];
            if (file) {
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
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                bio: document.getElementById('bio').value,
                location: document.getElementById('location').value
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

        async function changePassword() {
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

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

        function saveNotificationSettings() {
            alert('Notification settings saved!');
        }

        function savePrivacySettings() {
            alert('Privacy settings saved!');
        }

        function savePreferences() {
            alert('Preferences saved!');
        }

        function deleteAccount() {
            if (confirm('Are you absolutely sure? This action cannot be undone!')) {
                if (confirm('This will permanently delete your account and all associated data. Continue?')) {
                    alert('Account deletion feature - Contact support to proceed');
                }
            }
        }
    </script>
</body>

</html>