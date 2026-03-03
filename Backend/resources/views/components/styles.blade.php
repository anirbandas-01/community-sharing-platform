<!-- Common Styles Component -->
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

    /* Top Navigation */
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

    .logo-section {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 20px;
        font-weight: 700;
        color: #2563eb;
    }

    .logo-section i {
        font-size: 28px;
    }

    .nav-right {
        display: flex;
        align-items: center;
        gap: 24px;
    }

    .search-bar {
        max-width: 400px;
        width: 400px;
        position: relative;
    }

    .search-bar input {
        width: 100%;
        padding: 10px 16px 10px 40px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
    }

    .search-bar i {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
    }

    .nav-icons {
        display: flex;
        gap: 24px;
        align-items: center;
    }

    .icon-btn {
        position: relative;
        background: none;
        border: none;
        font-size: 20px;
        color: #64748b;
        cursor: pointer;
        transition: color 0.2s;
    }

    .icon-btn:hover {
        color: #2563eb;
    }

    .badge {
        position: absolute;
        top: -6px;
        right: -6px;
        background: #ef4444;
        color: white;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 10px;
        font-weight: 600;
    }

    .profile-dropdown {
        position: relative;
    }

    .profile-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: background 0.2s;
    }

    .profile-btn:hover {
        background: #f1f5f9;
    }

    .profile-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        min-width: 200px;
        margin-top: 8px;
        display: none;
    }

    .dropdown-menu.active {
        display: block;
    }

    .dropdown-item {
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: #475569;
        cursor: pointer;
        transition: background 0.2s;
        border: none;
        width: 100%;
        text-align: left;
        background: none;
        font-size: 14px;
    }

    .dropdown-item:hover {
        background: #f1f5f9;
    }

    .dropdown-item i {
        width: 20px;
    }

    /* Notification Dropdown */
    .notification-dropdown {
        position: relative;
    }

    .notification-panel {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        width: 380px;
        margin-top: 12px;
        display: none;
        max-height: 500px;
        overflow: hidden;
        z-index: 1000;
    }

    .notification-panel.active {
        display: block;
    }

    .notification-header {
        padding: 16px 20px;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .notification-title {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
    }

    .mark-all-read {
        font-size: 13px;
        color: #2563eb;
        cursor: pointer;
        background: none;
        border: none;
        font-weight: 500;
    }

    .mark-all-read:hover {
        text-decoration: underline;
    }

    .notification-list {
        max-height: 400px;
        overflow-y: auto;
    }

    .notification-item {
        padding: 16px 20px;
        border-bottom: 1px solid #f1f5f9;
        cursor: pointer;
        transition: background 0.2s;
        display: flex;
        gap: 12px;
    }

    .notification-item:hover {
        background: #f8fafc;
    }

    .notification-item.unread {
        background: #eff6ff;
    }

    .notification-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 18px;
    }

    .notification-icon.info {
        background: #dbeafe;
        color: #2563eb;
    }

    .notification-icon.success {
        background: #d1fae5;
        color: #10b981;
    }

    .notification-icon.warning {
        background: #fef3c7;
        color: #f59e0b;
    }

    .notification-content {
        flex: 1;
    }

    .notification-text {
        font-size: 14px;
        color: #1e293b;
        margin-bottom: 4px;
        line-height: 1.5;
    }

    .notification-time {
        font-size: 12px;
        color: #94a3b8;
    }

    .notification-footer {
        padding: 12px 20px;
        border-top: 1px solid #e2e8f0;
        text-align: center;
    }

    .view-all-notifications {
        color: #2563eb;
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
    }

    .view-all-notifications:hover {
        text-decoration: underline;
    }

    .empty-notifications {
        padding: 48px 20px;
        text-align: center;
        color: #94a3b8;
    }

    .empty-notifications i {
        font-size: 48px;
        margin-bottom: 12px;
        opacity: 0.3;
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
        transition: transform 0.3s;
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

    /* Section */
    .section {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        margin-bottom: 24px;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .section-title {
        font-size: 18px;
        font-weight: 600;
    }

    /* Form Elements */
    .form-group {
        margin-bottom: 20px;
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
        padding: 10px 14px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
        transition: border-color 0.2s;
    }

    .form-input:focus {
        outline: none;
        border-color: #2563eb;
    }

    .form-select {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
        background: white;
        cursor: pointer;
    }

    .form-textarea {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
        min-height: 100px;
        resize: vertical;
    }

    /* Buttons */
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

    .btn-secondary {
        background: #64748b;
        color: white;
    }

    .btn-secondary:hover {
        background: #475569;
    }

    .btn-outline {
        background: white;
        border: 1px solid #e2e8f0;
        color: #64748b;
    }

    .btn-outline:hover {
        background: #f1f5f9;
    }

    .btn-danger {
        background: #ef4444;
        color: white;
    }

    .btn-danger:hover {
        background: #dc2626;
    }

    /* Mobile Menu */
    .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        font-size: 24px;
        color: #64748b;
        cursor: pointer;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .sidebar {
            transform: translateX(-100%);
        }

        .sidebar.active {
            transform: translateX(0);
        }

        .main-content {
            margin-left: 0;
            padding: 16px;
        }

        .mobile-menu-btn {
            display: block;
        }

        .search-bar {
            display: none;
        }

        .logo-section span {
            display: none;
        }
    }
</style>