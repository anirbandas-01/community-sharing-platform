<!-- Navigation Bar Component -->
<nav class="top-nav">
    <button class="mobile-menu-btn" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
    <div class="logo-section">
        <i class="fas fa-network-wired"></i>
        <span>LocalHub</span>
    </div>
    <div class="nav-right">
        <div class="search-bar">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="{{ $searchPlaceholder ?? 'Search...' }}">
        </div>
        <div class="nav-icons">
            <div class="notification-dropdown">
                <button class="icon-btn" onclick="toggleNotifications()">
                    <i class="fas fa-bell"></i>
                    <span class="badge" id="notif-count" style="display: none;">0</span>
                </button>
                <div class="notification-panel" id="notification-panel">
                    <div class="notification-header">
                        <div class="notification-title">Notifications</div>
                        <button class="mark-all-read" onclick="markAllRead()">Mark all as read</button>
                    </div>
                    <div class="notification-list" id="notification-list">
                        <!-- Notifications will be loaded here -->
                    </div>
                    <div class="notification-footer">
                        <a href="#" class="view-all-notifications" onclick="viewAllNotifications()">View All Notifications</a>
                    </div>
                </div>
            </div>
            <div class="profile-dropdown">
                <button class="profile-btn" onclick="toggleDropdown()">
                    <div class="profile-avatar" id="profile-avatar"></div>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu" id="dropdown-menu">
                    <button class="dropdown-item" onclick="viewProfile()"><i class="fas fa-user"></i> View Profile</button>
                    <button class="dropdown-item" onclick="openSettings()"><i class="fas fa-cog"></i> Settings</button>
                    <button class="dropdown-item" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
                </div>
            </div>
        </div>
    </div>
</nav>