@include('business.profile_modal')
@php
$user = Auth::user();
@endphp
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Dashboard - LocalHub</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #4f46e5;
            --primary-dark: #4338ca;
            --secondary: #7c3aed;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --info: #3b82f6;
            --dark: #0f172a;
            --gray: #64748b;
            --light-gray: #f1f5f9;
            --border: #e2e8f0;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: #f8fafc;
            color: var(--dark);
        }

        /* Sidebar */
        .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            width: 280px;
            background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
            padding: 2rem 0;
            overflow-y: auto;
            z-index: 1000;
            transition: transform 0.3s;
        }

        .sidebar-logo {
            padding: 0 2rem;
            margin-bottom: 3rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .logo-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(-5deg);
        }

        .logo-icon svg {
            width: 28px;
            height: 28px;
            color: white;
            transform: rotate(5deg);
        }

        .logo-text {
            color: white;
            font-size: 1.5rem;
            font-weight: 900;
        }

        .logo-badge {
            background: var(--warning);
            color: white;
            font-size: 0.7rem;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-weight: 700;
            margin-top: 0.25rem;
        }

        .nav-menu {
            list-style: none;
        }

        .nav-section-title {
            padding: 0 2rem;
            color: #64748b;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 2rem 0 1rem;
        }

        .nav-item {
            margin: 0.25rem 1rem;
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.875rem 1rem;
            color: #94a3b8;
            text-decoration: none;
            border-radius: 12px;
            transition: all 0.3s;
            font-weight: 600;
        }

        .nav-link:hover {
            background: rgba(255, 255, 255, 0.05);
            color: white;
        }

        .nav-link.active {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
        }

        .nav-link svg {
            width: 20px;
            height: 20px;
        }

        .nav-badge {
            margin-left: auto;
            background: var(--danger);
            color: white;
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            border-radius: 50px;
            font-weight: 700;
        }

        /* Main Content */
        .main-content {
            margin-left: 280px;
            min-height: 100vh;
        }

        /* Top Bar */
        .topbar {
            background: white;
            border-bottom: 1px solid var(--border);
            padding: 1.25rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .topbar-left h1 {
            font-size: 1.75rem;
            font-weight: 900;
            color: var(--dark);
        }

        .breadcrumb {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--gray);
            font-size: 0.9rem;
            margin-top: 0.25rem;
        }

        .topbar-right {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }

        .notification-btn {
            position: relative;
            background: var(--light-gray);
            border: none;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;
        }

        .notification-btn:hover {
            background: var(--primary);
            color: white;
        }

        .notification-badge {
            position: absolute;
            top: 0;
            right: 0;
            background: var(--danger);
            color: white;
            font-size: 0.7rem;
            padding: 0.2rem 0.4rem;
            border-radius: 50px;
            font-weight: 700;
        }

        /* Notification Dropdown */
        .notification-wrapper {
            position: relative;
        }

        .notification-dropdown {
            display: none;
            position: absolute;
            top: 120%;
            right: 0;
            width: 320px;
            background: white;
            border: 1px solid var(--border);
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            z-index: 1000;
            overflow: hidden;
            animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .notification-dropdown.active {
            display: block;
        }

        .notification-header {
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8fafc;
        }

        .notification-header h4 {
            font-weight: 800;
            font-size: 1rem;
            color: var(--dark);
        }

        .notification-list {
            max-height: 350px;
            overflow-y: auto;
        }

        .notification-item {
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--border);
            display: flex;
            gap: 1rem;
            transition: background 0.2s;
            cursor: pointer;
            text-decoration: none;
            color: inherit;
        }

        .notification-item:hover {
            background: #f1f5f9;
        }

        .notification-item:last-child {
            border-bottom: none;
        }

        .notification-icon-box {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .notification-content h5 {
            font-size: 0.9rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
            color: var(--dark);
        }

        .notification-content p {
            font-size: 0.8rem;
            color: var(--gray);
            line-height: 1.4;
        }

        .notification-time {
            font-size: 0.75rem;
            color: #94a3b8;
            margin-top: 0.25rem;
            display: block;
        }

        .notification-footer {
            padding: 1rem;
            text-align: center;
            border-top: 1px solid var(--border);
            background: #f8fafc;
        }

        .notification-footer a {
            color: var(--primary);
            font-weight: 700;
            font-size: 0.9rem;
            text-decoration: none;
        }

        .notification-footer a:hover {
            text-decoration: underline;
        }

        .user-profile {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            cursor: pointer;
            padding: 0.5rem 1rem;
            border-radius: 50px;
            transition: background 0.3s;
        }

        .user-profile:hover {
            background: var(--light-gray);
        }

        .user-avatar {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            overflow: hidden;
        }

        .user-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .user-info {
            display: flex;
            flex-direction: column;
        }

        .user-name {
            font-weight: 700;
            font-size: 0.95rem;
        }

        .user-role {
            font-size: 0.8rem;
            color: var(--gray);
        }

        /* Content Area */
        .content {
            padding: 2rem;
        }

        /* Stats Cards */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: white;
            border-radius: 16px;
            padding: 1.5rem;
            border: 1px solid var(--border);
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            transform: scaleX(0);
            transition: transform 0.3s;
        }

        .stat-card:hover::before {
            transform: scaleX(1);
        }

        .stat-card:hover {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transform: translateY(-5px);
        }

        .stat-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }

        .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }

        .stat-icon.revenue {
            background: linear-gradient(135deg, #10b981, #059669);
        }

        .stat-icon.orders {
            background: linear-gradient(135deg, #3b82f6, #06b6d4);
        }

        .stat-icon.products {
            background: linear-gradient(135deg, #f59e0b, #ea580c);
        }

        .stat-icon.customers {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        }

        .stat-trend {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.85rem;
            font-weight: 600;
            padding: 0.25rem 0.5rem;
            border-radius: 50px;
        }

        .stat-trend.up {
            background: #d1fae5;
            color: #065f46;
        }

        .stat-trend.down {
            background: #fee2e2;
            color: #991b1b;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: 900;
            color: var(--dark);
            margin-bottom: 0.25rem;
        }

        .stat-label {
            color: var(--gray);
            font-size: 0.9rem;
            font-weight: 600;
        }

        /* Grid Layout */
        .dashboard-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .card {
            background: white;
            border-radius: 16px;
            border: 1px solid var(--border);
            padding: 1.5rem;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border);
        }

        .card-title {
            font-size: 1.25rem;
            font-weight: 800;
            color: var(--dark);
        }

        .card-action {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            transition: color 0.3s;
        }

        .card-action:hover {
            color: var(--secondary);
        }

        /* Orders List */
        .order-item {
            display: flex;
            align-items: center;
            padding: 1rem;
            border-radius: 12px;
            transition: all 0.3s;
            margin-bottom: 0.75rem;
            border: 1px solid var(--border);
        }

        .order-item:hover {
            background: var(--light-gray);
        }

        .order-id {
            font-weight: 700;
            color: var(--dark);
            margin-right: auto;
        }

        .order-customer {
            font-size: 0.85rem;
            color: var(--gray);
            display: block;
        }

        .order-amount {
            font-weight: 700;
            color: var(--dark);
            margin-left: 1rem;
        }

        .order-status {
            padding: 0.375rem 0.75rem;
            border-radius: 50px;
            font-size: 0.8rem;
            font-weight: 700;
            margin-left: 1rem;
        }

        .order-status.pending {
            background: #fef3c7;
            color: #92400e;
        }

        .order-status.completed {
            background: #d1fae5;
            color: #065f46;
        }

        .order-status.processing {
            background: #dbeafe;
            color: #1e40af;
        }

        /* Activity Feed */
        .activity-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .activity-item {
            display: flex;
            gap: 1rem;
            padding: 1rem;
            background: var(--light-gray);
            border-radius: 12px;
        }

        .activity-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .activity-icon.order {
            background: #dbeafe;
            color: #1e40af;
        }

        .activity-icon.product {
            background: #fef3c7;
            color: #92400e;
        }

        .activity-icon.review {
            background: #e9d5ff;
            color: #6b21a8;
        }

        .activity-content {
            flex: 1;
        }

        .activity-title {
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 0.25rem;
        }

        .activity-time {
            font-size: 0.85rem;
            color: var(--gray);
        }

        /* Quick Actions */
        .quick-actions {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .action-card {
            background: white;
            border: 2px solid var(--border);
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
        }

        .action-card:hover {
            border-color: var(--primary);
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(79, 70, 229, 0.15);
        }

        .action-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
        }

        .action-card:nth-child(1) .action-icon {
            background: linear-gradient(135deg, #3b82f6, #06b6d4);
        }

        .action-card:nth-child(2) .action-icon {
            background: linear-gradient(135deg, #10b981, #059669);
        }

        .action-card:nth-child(3) .action-icon {
            background: linear-gradient(135deg, #f59e0b, #ea580c);
        }

        .action-card:nth-child(4) .action-icon {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        }

        .action-title {
            font-weight: 700;
            font-size: 1.1rem;
            color: var(--dark);
            margin-bottom: 0.5rem;
        }

        .action-desc {
            color: var(--gray);
            font-size: 0.9rem;
        }

        /* Tabs */
        .tabs {
            display: flex;
            gap: 1rem;
            border-bottom: 2px solid var(--border);
            margin-bottom: 2rem;
        }

        .tab {
            padding: 1rem 1.5rem;
            background: none;
            border: none;
            font-weight: 700;
            color: var(--gray);
            cursor: pointer;
            position: relative;
            transition: color 0.3s;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .tab.active {
            color: var(--primary);
        }

        .tab.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--primary);
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        /* Table */
        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: var(--light-gray);
        }

        th {
            padding: 1rem;
            text-align: left;
            font-weight: 700;
            color: var(--dark);
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            padding: 1rem;
            border-bottom: 1px solid var(--border);
        }

        tbody tr {
            transition: background 0.3s;
        }

        tbody tr:hover {
            background: var(--light-gray);
        }

        .badge {
            display: inline-block;
            padding: 0.375rem 0.75rem;
            border-radius: 50px;
            font-size: 0.8rem;
            font-weight: 700;
        }

        .badge.in-stock {
            background: #d1fae5;
            color: #065f46;
        }

        .badge.low-stock {
            background: #fef3c7;
            color: #92400e;
        }

        .badge.out-of-stock {
            background: #fee2e2;
            color: #991b1b;
        }

        .action-btns {
            display: flex;
            gap: 0.5rem;
        }

        .icon-btn {
            width: 35px;
            height: 35px;
            border: none;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;
        }

        .icon-btn.edit {
            background: #dbeafe;
            color: #1e40af;
        }

        .icon-btn.delete {
            background: #fee2e2;
            color: #991b1b;
        }

        .icon-btn:hover {
            transform: scale(1.1);
        }

        .icon-btn svg {
            width: 18px;
            height: 18px;
        }

        /* Mobile Toggle */
        .mobile-toggle {
            display: none;
            background: var(--primary);
            color: white;
            border: none;
            padding: 0.75rem;
            border-radius: 8px;
            cursor: pointer;
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .sidebar {
                transform: translateX(-100%);
            }

            .sidebar.active {
                transform: translateX(0);
            }

            .main-content {
                margin-left: 0;
            }

            .mobile-toggle {
                display: block;
            }

            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .dashboard-grid {
                grid-template-columns: 1fr;
            }

            .quick-actions {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 640px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }

            .topbar {
                padding: 1rem;
            }

            .user-info {
                display: none;
            }
        }
    </style>
    <style>
        #pm:checked~.mo {
            display: flex
        }

        #pm {
            display: none
        }

        .mo {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, .6);
            align-items: center;
            justify-content: center;
            z-index: 999
        }

        .mc {
            background: #fff;
            padding: 2rem;
            border-radius: 20px;
            width: 90%;
            max-width: 480px;
            position: relative
        }

        .mh {
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 1.5rem
        }

        .fg {
            margin-bottom: 1rem
        }

        label {
            display: block;
            font-weight: 700;
            margin-bottom: .3rem
        }

        input,
        select,
        textarea {
            width: 100%;
            padding: .8rem;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            font-size: 1rem;
            box-sizing: border-box
        }

        input:focus,
        select:focus,
        textarea:focus {
            outline: none;
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, .1)
        }

        .gr {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem
        }

        .bg {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem
        }

        .bc,
        .bs {
            padding: .9rem;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            text-align: center;
            flex: 1;
            border: none
        }

        .bc {
            background: #f1f5f9;
            color: #64748b
        }

        .bs {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: #fff
        }

        .ob {
            padding: .7rem 1.5rem;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: #fff;
            border: none;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer
        }

        .cl {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: #f1f5f9;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem
        }
    </style>
    <style>
        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            background: #e5e7eb;
            flex-shrink: 0;
        }

        .user-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .user-profile {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .user-name {
            font-weight: 700;
            font-size: 0.9rem;
            color: #0f172a;
        }

        .user-role {
            font-size: 0.75rem;
            color: #64748b;
        }
    </style>
</head>

<body>
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
        <a href="/" class="sidebar-logo" style="text-decoration: none;">
            <div class="logo-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </div>
            <div>
                <div class="logo-text">LocalHub</div>
                <div class="logo-badge">BUSINESS</div>
            </div>
        </a>

        <ul class="nav-menu">
            <li class="nav-section-title">Main</li>
            <li class="nav-item">
                <a href="#dashboard" class="nav-link active" onclick="switchTab('dashboard')">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                </a>
            </li>
            <li class="nav-item">
                <a href="#orders" class="nav-link" onclick="switchTab('orders')">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Orders
                    <span class="nav-badge">5</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#inventory" class="nav-link" onclick="switchTab('inventory')">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Inventory
                </a>
            </li>

            <li class="nav-section-title">Business</li>
            <li class="nav-item">
                <a href="#profile" class="nav-link" onclick="switchTab('profile')">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Profile
                </a>
            </li>
            <li class="nav-item">
                <a href="#enterprise" class="nav-link" onclick="switchTab('enterprise')">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Register Enterprise
                </a>
            </li>
            <li class="nav-item">
                <a href="#revenue" class="nav-link" onclick="switchTab('revenue')">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Revenue
                </a>
            </li>
            <li class="nav-item">
                <a href="#contact" class="nav-link" onclick="switchTab('contact')">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Us
                </a>
            </li>

            <li class="nav-section-title">Settings</li>
            <li class="nav-item">
                <a href="#settings" class="nav-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                </a>
            </li>
            <li class="nav-item">
                <a href="/logout" class="nav-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </a>
            </li>
        </ul>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Top Bar -->
        <div class="topbar">
            <div class="topbar-left">
                <button class="mobile-toggle" id="mobileToggle">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div>
                    <h1 id="pageTitle">Dashboard</h1>
                    <div class="breadcrumb">
                        <span>Business</span>
                        <span>/</span>
                        <span id="pageBreadcrumb">Dashboard</span>
                    </div>
                </div>
            </div>
            <div class="topbar-right">
                <div class="notification-wrapper">
                    <button class="notification-btn" id="notificationBtn">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span class="notification-badge">3</span>
                    </button>

                    <!-- Dropdown -->
                    <div class="notification-dropdown" id="notificationDropdown">
                        <div class="notification-header">
                            <h4>Notifications</h4>
                            <span class="badge" style="background:var(--primary); color:white; font-size:0.75rem;">3 New</span>
                        </div>
                        <div class="notification-list">
                            <!-- Item 1 -->
                            <a href="#" class="notification-item">
                                <div class="notification-icon-box" style="background: #dbeafe; color: #1e40af;">
                                    📦
                                </div>
                                <div class="notification-content">
                                    <h5>New Order #1234</h5>
                                    <p>John Doe placed a new order of ₹1,250</p>
                                    <span class="notification-time">2 mins ago</span>
                                </div>
                            </a>
                            <!-- Item 2 -->
                            <a href="#" class="notification-item">
                                <div class="notification-icon-box" style="background: #fef3c7; color: #92400e;">
                                    ⚠️
                                </div>
                                <div class="notification-content">
                                    <h5>Low Stock Warning</h5>
                                    <p>Fresh Apples stock is running low (5 left)</p>
                                    <span class="notification-time">1 hour ago</span>
                                </div>
                            </a>
                            <!-- Item 3 -->
                            <a href="#" class="notification-item">
                                <div class="notification-icon-box" style="background: #e9d5ff; color: #6b21a8;">
                                    ⭐
                                </div>
                                <div class="notification-content">
                                    <h5>New Review</h5>
                                    <p>Sarah M. left a 5-star review</p>
                                    <span class="notification-time">3 hours ago</span>
                                </div>
                            </a>
                        </div>
                        <div class="notification-footer">
                            <a href="#">View All Notifications</a>
                        </div>
                    </div>
                </div>
                <!--User profile-->
                <label for="profileToggle" class="user-profile" style="cursor: pointer;">
                    <div class="user-avatar">
                        <img
                            src="{{ asset('uploads/profiles/' . $user->profile_image) }}"
                            alt="Profile">
                    </div>

                    <div class="user-info">
                        <div class="user-name">{{ $user->name }}</div>
                        <div class="user-role">{{ ucfirst($user->user_type) }}</div>
                    </div>
                </label>
            </div>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Dashboard Tab -->
            <div class="tab-content active" id="dashboard-content">
                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon revenue">💰</div>
                            <div class="stat-trend up">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                12%
                            </div>
                        </div>
                        <div class="stat-number">₹45,231</div>
                        <div class="stat-label">Total Revenue</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon orders">📦</div>
                            <div class="stat-trend up">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                8%
                            </div>
                        </div>
                        <div class="stat-number">124</div>
                        <div class="stat-label">Total Orders</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon products">🛍️</div>
                            <div class="stat-trend up">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                5%
                            </div>
                        </div>
                        <div class="stat-number">89</div>
                        <div class="stat-label">Products Listed</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon customers">👥</div>
                            <div class="stat-trend up">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                15%
                            </div>
                        </div>
                        <div class="stat-number">456</div>
                        <div class="stat-label">Customers</div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="quick-actions">
                    <a href="#" class="action-card" onclick="switchTab('orders'); return false;">
                        <div class="action-icon">📋</div>
                        <div class="action-title">Add New Order</div>
                        <div class="action-desc">Create and manage orders</div>
                    </a>
                    <a href="#" class="action-card" onclick="switchTab('inventory'); return false;">
                        <div class="action-icon">📦</div>
                        <div class="action-title">Manage Inventory</div>
                        <div class="action-desc">Update stock levels</div>
                    </a>
                    <a href="#" class="action-card" onclick="switchTab('revenue'); return false;">
                        <div class="action-icon">💵</div>
                        <div class="action-title">View Revenue</div>
                        <div class="action-desc">Track your earnings</div>
                    </a>
                    <a href="#" class="action-card" onclick="switchTab('contact'); return false;">
                        <div class="action-icon">📧</div>
                        <div class="action-title">Contact Support</div>
                        <div class="action-desc">Get help anytime</div>
                    </a>
                </div>

                <!-- Dashboard Grid -->
                <div class="dashboard-grid">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Recent Orders</h3>
                            <a href="#" class="card-action" onclick="switchTab('orders'); return false;">View All</a>
                        </div>
                        <div class="order-item">
                            <div>
                                <div class="order-id">#ORD-1234</div>
                                <span class="order-customer">John Doe</span>
                            </div>
                            <div class="order-amount">₹1,250</div>
                            <div class="order-status completed">Completed</div>
                        </div>
                        <div class="order-item">
                            <div>
                                <div class="order-id">#ORD-1235</div>
                                <span class="order-customer">Sarah Miller</span>
                            </div>
                            <div class="order-amount">₹890</div>
                            <div class="order-status processing">Processing</div>
                        </div>
                        <div class="order-item">
                            <div>
                                <div class="order-id">#ORD-1236</div>
                                <span class="order-customer">Raj Kumar</span>
                            </div>
                            <div class="order-amount">₹2,100</div>
                            <div class="order-status pending">Pending</div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Recent Activity</h3>
                        </div>
                        <div class="activity-list">
                            <div class="activity-item">
                                <div class="activity-icon order">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-title">New order received</div>
                                    <div class="activity-time">2 minutes ago</div>
                                </div>
                            </div>
                            <div class="activity-item">
                                <div class="activity-icon product">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-title">Product stock updated</div>
                                    <div class="activity-time">1 hour ago</div>
                                </div>
                            </div>
                            <div class="activity-item">
                                <div class="activity-icon review">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-title">New customer review</div>
                                    <div class="activity-time">3 hours ago</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Orders Tab -->
            <div class="tab-content" id="orders-content">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">All Orders</h3>
                        <button class="btn btn-primary" style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            + Add New Order
                        </button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>#ORD-1234</strong></td>
                                <td>John Doe</td>
                                <td>Feb 3, 2026</td>
                                <td><strong>₹1,250</strong></td>
                                <td><span class="order-status completed">Completed</span></td>
                                <td>
                                    <div class="action-btns">
                                        <button class="icon-btn edit">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>#ORD-1235</strong></td>
                                <td>Sarah Miller</td>
                                <td>Feb 3, 2026</td>
                                <td><strong>₹890</strong></td>
                                <td><span class="order-status processing">Processing</span></td>
                                <td>
                                    <div class="action-btns">
                                        <button class="icon-btn edit">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>#ORD-1236</strong></td>
                                <td>Raj Kumar</td>
                                <td>Feb 2, 2026</td>
                                <td><strong>₹2,100</strong></td>
                                <td><span class="order-status pending">Pending</span></td>
                                <td>
                                    <div class="action-btns">
                                        <button class="icon-btn edit">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Inventory Tab -->
            <div class="tab-content" id="inventory-content">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Inventory Management</h3>
                        <label for="pm" class="ob" for="productModalToggle" class="open-modal-btn">
                            + Add Product
                        </label>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($products as $product)
                            @php
                            if ($product->stock == 0) {
                            $status = 'Out of Stock';
                            $class = 'out-of-stock';
                            } elseif ($product->stock <= 5) {
                                $status='Low Stock' ;
                                $class='low-stock' ;
                                } else {
                                $status='In Stock' ;
                                $class='in-stock' ;
                                }
                                @endphp

                                <tr>
                                <td><strong>{{ $product->name }}</strong></td>
                                <td>{{ $product->category }}</td>
                                <td><strong>₹{{ number_format($product->price, 2) }}</strong></td>
                                <td>{{ $product->stock }} units</td>
                                <td>
                                    <span class="badge {{ $class }}">
                                        {{ $status }}
                                    </span>
                                </td>
                                <td>
                                    <div class="action-btns">
                                        <button class="icon-btn edit">
                                            ✏️
                                        </button>
                                        <button class="icon-btn delete">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                                </tr>
                                @empty
                                <tr>
                                    <td colspan="6" style="text-align:center;color:#888;">
                                        No products found
                                    </td>
                                </tr>
                                @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
            <input type="checkbox" id="pm">
            {{-- add product --}}
            <input type="checkbox" id="pm">


            <div class="mo">
                <div class="mc">
                    <label for="pm" class="cl">✕</label>

                    <h3 class="mh">Add New Product</h3>

                    <form method="POST" action="/products/store" enctype="multipart/form-data">
                        @csrf

                        <div class="fg">
                            <label>Product Name *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g., Fresh Apples"
                                required>
                        </div>

                        <div class="fg">
                            <label>Category *</label>
                            <select name="category" required>
                                <option value="">Select Category</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Dairy">Dairy</option>
                                <option value="Bakery">Bakery</option>
                                <option value="Beverages">Beverages</option>
                                <option value="Snacks">Snacks</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div class="gr">
                            <div class="fg">
                                <label>Price (₹) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    placeholder="120"
                                    required>
                            </div>

                            <div class="fg">
                                <label>Stock *</label>
                                <input
                                    type="number"
                                    name="stock"
                                    placeholder="50"
                                    min="0"
                                    required>
                            </div>
                        </div>



                        <div class="fg">
                            <label>Product Photo *</label>

                            <div class="pu">
                                <div class="pu-icon">📸</div>
                                <p class="pu-text">Upload Product Photo</p>

                                <input
                                    type="file"
                                    name="photo"
                                    accept=".jpg,.jpeg,.png"
                                    required>

                                <p class="pu-hint">JPG, PNG (Max 5MB)</p>
                            </div>
                        </div>

                        <div class="bg">
                            <label for="pm" class="bc">Cancel</label>
                            <button type="submit" class="bs">💾 Save</button>
                        </div>
                    </form>
                </div>
            </div>




            <!-- Profile Tab -->
            <div class="tab-content" id="profile-content">
                <div class="card">
                    <div class="card-header" style="display:flex; align-items:center; gap:1rem;">

                        <!-- Enterprise Logo -->
                        <img
                            id="enterpriseLogo"
                            src=""
                            alt="Enterprise Logo"
                            style="
                                width:64px;
                                height:64px;
                                border-radius:12px;
                                object-fit:cover;
                                border:1px solid var(--border);
                                display:none;
                            " />

                        <h3 class="card-title">Business Profile</h3>

                        <button
                            class="btn btn-primary"
                            style="margin-left:auto; padding:0.75rem 1.5rem; background:linear-gradient(135deg,#4f46e5,#7c3aed); color:white; border:none; border-radius:8px; font-weight:600; cursor:pointer;">
                            Edit Profile
                        </button>
                    </div>

                    <div style="padding:2rem;">
                        <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:2rem;">

                            <div>
                                <h4>Business Name</h4>
                                <p id="businessName" style="color:var(--gray);">—</p>
                            </div>

                            <div>
                                <h4>Owner Name</h4>
                                <p id="ownerName" style="color:var(--gray);">—</p>
                            </div>

                            <div>
                                <h4>Email</h4>
                                <p id="businessEmail" style="color:var(--gray);">—</p>
                            </div>

                            <div>
                                <h4>Phone</h4>
                                <p id="businessPhone" style="color:var(--gray);">—</p>
                            </div>

                            <div>
                                <h4>Category</h4>
                                <p id="businessCategory" style="color:var(--gray);">—</p>
                            </div>

                            <div>
                                <h4>Location</h4>
                                <p id="businessLocation" style="color:var(--gray);">—</p>
                            </div>

                            <div style="grid-column:1 / -1;">
                                <h4>Business Description</h4>
                                <p id="businessDescription" style="color:var(--gray);">—</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>


            <!-- Enterprise Registration Tab -->
            <div class="tab-content" id="enterprise-content">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Register as Enterprise</h3>
                    </div>
                    <div style="padding: 2rem;">
                        <!-- Enterprise Benefits Banner -->
                        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 2rem; border-radius: 16px; margin-bottom: 2rem; color: white;">
                            <div style="display: flex; align-items: center; gap: 1.5rem;">
                                <div style="font-size: 4rem;">🏢</div>
                                <div>
                                    <h3 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem;">Upgrade to Enterprise</h3>
                                    <p style="opacity: 0.9; line-height: 1.6;">
                                        Get access to advanced features including multi-location management, bulk operations, priority support, and detailed analytics.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Enterprise Benefits Grid -->
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 3rem;">
                            <div style="padding: 1.5rem; background: var(--light-gray); border-radius: 12px; text-align: center;">
                                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📍</div>
                                <h4 style="font-weight: 700; margin-bottom: 0.5rem;">Multi-Location</h4>
                                <p style="color: var(--gray); font-size: 0.9rem;">Manage multiple business locations from one dashboard</p>
                            </div>
                            <div style="padding: 1.5rem; background: var(--light-gray); border-radius: 12px; text-align: center;">
                                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📊</div>
                                <h4 style="font-weight: 700; margin-bottom: 0.5rem;">Advanced Analytics</h4>
                                <p style="color: var(--gray); font-size: 0.9rem;">Detailed insights and custom reports</p>
                            </div>
                            <div style="padding: 1.5rem; background: var(--light-gray); border-radius: 12px; text-align: center;">
                                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎯</div>
                                <h4 style="font-weight: 700; margin-bottom: 0.5rem;">Priority Support</h4>
                                <p style="color: var(--gray); font-size: 0.9rem;">24/7 dedicated support team</p>
                            </div>
                        </div>

                        <!-- Enterprise Registration Form -->
                        <form id="enterpriseForm" enctype="multipart/form-data" style="max-width: 800px; margin: 0 auto;">
                            <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 2rem; color: var(--dark);">Enterprise Registration Form</h3>

                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
                                <!-- Company Name -->
                                <div style="grid-column: 1 / -1;">
                                    <label style="display: block; font-weight: 700; margin-bottom: 0.5rem; color: var(--dark);">
                                        Company Legal Name <span style="color: var(--danger);">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        placeholder="Enter your company's legal name"
                                        required
                                        style="width: 100%; padding: 0.875rem; border: 2px solid var(--border); border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem;">
                                </div>

                                <!-- Company Registration Number -->
                                <div>
                                    <label style="display: block; font-weight: 700; margin-bottom: 0.5rem; color: var(--dark);">
                                        Registration Number <span style="color: var(--danger);">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="registrationNumber"
                                        placeholder="CIN/Registration No."
                                        required
                                        style="width: 100%; padding: 0.875rem; border: 2px solid var(--border); border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem;">
                                </div>
                                <!-- Industry Type -->
                                <div>
                                    <label style="display: block; font-weight: 700; margin-bottom: 0.5rem; color: var(--dark);">
                                        Industry Type <span style="color: var(--danger);">*</span>
                                    </label>
                                    <select
                                        name="industryType"
                                        required
                                        style="width: 100%; padding: 0.875rem; border: 2px solid var(--border); border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem; cursor: pointer;">
                                        <option value="">Select Industry</option>
                                        <option value="retail">Retail</option>
                                        <option value="food">Food & Beverages</option>
                                        <option value="fashion">Fashion & Apparel</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="services">Services</option>
                                        <option value="manufacturing">Manufacturing</option>
                                        <option value="healthcare">Healthcare</option>
                                        <option value="education">Education</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <!-- Annual Revenue -->
                                <div>
                                    <label style="display: block; font-weight: 700; margin-bottom: 0.5rem; color: var(--dark);">
                                        Annual Revenue Range <span style="color: var(--danger);">*</span>
                                    </label>
                                    <select
                                        name="revenue"
                                        required
                                        style="width: 100%; padding: 0.875rem; border: 2px solid var(--border); border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem; cursor: pointer;">
                                        <option value="">Select Range</option>
                                        <option value="0-10L">₹0 - ₹10 Lakhs</option>
                                        <option value="10L-50L">₹10 Lakhs - ₹50 Lakhs</option>
                                        <option value="50L-1Cr">₹50 Lakhs - ₹1 Crore</option>
                                        <option value="1Cr-5Cr">₹1 Crore - ₹5 Crores</option>
                                        <option value="5Cr-10Cr">₹5 Crores - ₹10 Crores</option>
                                        <option value="10Cr+">₹10 Crores+</option>
                                    </select>
                                </div>
                                <!-- Contact Person Name -->
                                <div>
                                    <label style="display: block; font-weight: 700; margin-bottom: 0.5rem; color: var(--dark);">
                                        Contact Person Name <span style="color: var(--danger);">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        placeholder="Full name"
                                        required
                                        style="width: 100%; padding: 0.875rem; border: 2px solid var(--border); border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem;">
                                </div>

                                <!-- Contact Person Designation -->
                                <div>
                                    <label style="display: block; font-weight: 700; margin-bottom: 0.5rem; color: var(--dark);">
                                        Designation <span style="color: var(--danger);">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="designation"
                                        placeholder="e.g., CEO, Director"
                                        required
                                        style="width: 100%; padding: 0.875rem; border: 2px solid var(--border); border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem;">
                                </div>

                                <!-- Email -->
                                <div>
                                    <label style="display: block; font-weight: 700; margin-bottom: 0.5rem; color: var(--dark);">
                                        Official Email <span style="color: var(--danger);">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="company@example.com"
                                        required
                                        style="width: 100%; padding: 0.875rem; border: 2px solid var(--border); border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem;">
                                </div>

                                <!-- Phone -->
                                <div>
                                    <label style="display: block; font-weight: 700; margin-bottom: 0.5rem; color: var(--dark);">
                                        Contact Number <span style="color: var(--danger);">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="10-digit number"
                                        pattern="[0-9]{10}"
                                        maxlength="10"
                                        required
                                        style="width: 100%; padding: 0.875rem; border: 2px solid var(--border); border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem;">
                                </div>

                                <!-- Registered Address -->
                                <div style="grid-column: 1 / -1;">
                                    <label style="display: block; font-weight: 700; margin-bottom: 0.5rem; color: var(--dark);">
                                        Registered Office Address <span style="color: var(--danger);">*</span>
                                    </label>
                                    <textarea
                                        name="address"
                                        rows="3"
                                        placeholder="Complete registered address"
                                        required
                                        style="width: 100%; padding: 0.875rem; border: 2px solid var(--border); border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem; resize: vertical;"></textarea>
                                </div>

                                <!-- City -->
                                <div>
                                    <label style="display: block; font-weight: 700; margin-bottom: 0.5rem; color: var(--dark);">
                                        City <span style="color: var(--danger);">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        required
                                        style="width: 100%; padding: 0.875rem; border: 2px solid var(--border); border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem;">
                                </div>
                                <!-- Business Description -->
                                <div style="grid-column: 1 / -1;">
                                    <label style="display: block; font-weight: 700; margin-bottom: 0.5rem; color: var(--dark);">
                                        Business Description <span style="color: var(--danger);">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        rows="4"
                                        placeholder="Describe your business, products/services, and why you need enterprise features"
                                        required
                                        style="width: 100%; padding: 0.875rem; border: 2px solid var(--border); border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem; resize: vertical;"></textarea>
                                </div>

                                <!-- Document Uploads -->
                                <div style="grid-column: 1 / -1;">
                                    <label style="display: block; font-weight: 700; margin-bottom: 0.5rem; color: var(--dark);">
                                        Upload Documents <span style="color: var(--danger);">*</span>
                                    </label>
                                    <div style="padding: 2rem; border: 2px dashed var(--border); border-radius: 12px; text-align: center; background: var(--light-gray);">
                                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">📄</div>
                                        <p style="color: var(--gray); margin-bottom: 1rem;">Upload Enterprise Photo</p>
                                        <input
                                            type="file"
                                            name="photo"
                                            accept=".jpg,.jpeg,.png"
                                            required>
                                        <p style="font-size: 0.85rem; color: var(--gray); margin-top: 0.5rem;"> JPG, PNG (Max 5MB each)</p>
                                    </div>
                                </div>

                                <!-- Terms & Conditions -->
                                <div style="grid-column: 1 / -1;">
                                    <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                                        <input type="checkbox" name="terms" required style="width: 20px; height: 20px; accent-color: var(--primary); cursor: pointer;">
                                        <span style="color: var(--gray);">
                                            I agree to the <a href="#" style="color: var(--primary); font-weight: 600;">Enterprise Terms & Conditions</a> and confirm that all information provided is accurate
                                        </span>
                                    </label>
                                </div>

                                <!-- Submit Button -->
                                <div style="grid-column: 1 / -1; margin-top: 1rem;">
                                    <button
                                        type="submit"
                                        style="width: 100%; padding: 1.25rem; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: all 0.3s;">
                                        Submit Enterprise Application
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Revenue Tab -->
            <div class="tab-content" id="revenue-content">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Revenue Overview</h3>
                    </div>
                    <div style="padding: 2rem;">
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 2rem;">
                            <div style="text-align: center; padding: 2rem; background: var(--light-gray); border-radius: 12px;">
                                <div style="font-size: 2.5rem; font-weight: 900; color: var(--success); margin-bottom: 0.5rem;">₹45,231</div>
                                <div style="color: var(--gray); font-weight: 600;">This Month</div>
                            </div>
                            <div style="text-align: center; padding: 2rem; background: var(--light-gray); border-radius: 12px;">
                                <div style="font-size: 2.5rem; font-weight: 900; color: var(--primary); margin-bottom: 0.5rem;">₹1,24,567</div>
                                <div style="color: var(--gray); font-weight: 600;">This Quarter</div>
                            </div>
                            <div style="text-align: center; padding: 2rem; background: var(--light-gray); border-radius: 12px;">
                                <div style="font-size: 2.5rem; font-weight: 900; color: var(--warning); margin-bottom: 0.5rem;">₹4,89,230</div>
                                <div style="color: var(--gray); font-weight: 600;">This Year</div>
                            </div>
                        </div>
                        <div style="height: 300px; background: var(--light-gray); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--gray); font-weight: 600;">
                            📊 Revenue Chart Placeholder
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contact Tab -->
            <div class="tab-content" id="contact-content">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Contact Support</h3>
                    </div>
                    <div style="padding: 2rem;">
                        <form style="max-width: 600px; margin: 0 auto;">
                            <div style="margin-bottom: 1.5rem;">
                                <label style="display: block; font-weight: 700; margin-bottom: 0.5rem;">Subject</label>
                                <input type="text" placeholder="What can we help you with?" style="width: 100%; padding: 0.875rem; border: 2px solid var(--border); border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif;">
                            </div>
                            <div style="margin-bottom: 1.5rem;">
                                <label style="display: block; font-weight: 700; margin-bottom: 0.5rem;">Message</label>
                                <textarea rows="6" placeholder="Describe your issue or question..." style="width: 100%; padding: 0.875rem; border: 2px solid var(--border); border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; resize: vertical;"></textarea>
                            </div>
                            <button type="submit" style="width: 100%; padding: 1rem; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer;">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script>
        /* =========================
    SIDEBAR + TAB LOGIC
            ========================= */

        // Mobile Sidebar Toggle
        const mobileToggle = document.getElementById('mobileToggle');
        const sidebar = document.getElementById('sidebar');

        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        // Tab Switching
        function switchTab(tabName) {
            const titles = {
                dashboard: 'Dashboard',
                orders: 'Orders',
                inventory: 'Inventory',
                profile: 'Business Profile',
                enterprise: 'Register Enterprise',
                revenue: 'Revenue',
                contact: 'Contact Us'
            };

            document.getElementById('pageTitle').textContent = titles[tabName] || 'Dashboard';
            document.getElementById('pageBreadcrumb').textContent = titles[tabName] || 'Dashboard';

            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

            const activeLink = document.querySelector(`a[href="#${tabName}"]`);
            if (activeLink) activeLink.classList.add('active');

            const activeTab = document.getElementById(`${tabName}-content`);
            if (activeTab) activeTab.classList.add('active');
        }

        /* =========================
        ENTERPRISE FORM LOGIC
        ========================= */

        const enterpriseForm = document.getElementById('enterpriseForm');

        /* Disable Enterprise Tab + Form */
        function lockEnterpriseTab(status = 'pending') {

            // Disable sidebar link
            const enterpriseLink = document.querySelector('a[href="#enterprise"]');
            if (enterpriseLink) {
                enterpriseLink.onclick = function(e) {
                    e.preventDefault();
                    alert(`Enterprise already registered\nStatus: ${status.toUpperCase()}`);
                };
                enterpriseLink.classList.add('disabled');
            }

            // Disable form
            if (enterpriseForm) {
                enterpriseForm.querySelectorAll('input, textarea, select, button')
                    .forEach(el => el.disabled = true);

                const banner = document.createElement('div');
                banner.innerHTML = `
                        <div style="
                            background:#e0f2fe;
                            border:1px solid #38bdf8;
                            padding:1.25rem;
                            border-radius:12px;
                            margin-bottom:2rem;
                            font-weight:700;
                            color:#075985;">
                            🏢 Enterprise already registered<br>
                            Status: <strong>${status.toUpperCase()}</strong>
                        </div>
                    `;
                enterpriseForm.prepend(banner);
            }
        }

        /* Check enterprise status on page load */
        async function checkEnterpriseStatus() {
            try {
                const res = await fetch('/api/user/profile', {
                    headers: {
                        'Accept': 'application/json'
                        // Add Authorization header if using token auth
                    }
                });

                if (!res.ok) return;

                const user = await res.json();

                if (user.enterprise_registered) {
                    lockEnterpriseTab(user.enterprise_status);
                }

            } catch (err) {
                console.error('Enterprise status check failed');
            }
        }

        checkEnterpriseStatus();

        /* Submit Enterprise Form */
        if (enterpriseForm) {
            enterpriseForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const formData = new FormData(enterpriseForm);
                const submitBtn = enterpriseForm.querySelector('button[type="submit"]');

                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';

                try {
                    const res = await fetch('/api/enterprise/register', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json'
                            // Add Authorization header if required
                        },
                        body: formData
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        alert(data.message || 'Enterprise registration failed');
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Submit Enterprise Application';
                        return;
                    }

                    alert('✅ Enterprise registered successfully');
                    lockEnterpriseTab('pending');

                } catch (err) {
                    console.error(err);
                    alert('Network error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Enterprise Application';
                }
            });
        }

        /* =========================
        INPUT SANITIZATION
        ========================= */

        document.querySelectorAll('input[type="tel"]').forEach(input => {
            input.addEventListener('input', e => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        });

        /* =========================
        NOTIFICATION DROPDOWN
        ========================= */
        const notifBtn = document.getElementById('notificationBtn');
        const notifDrop = document.getElementById('notificationDropdown');

        if (notifBtn && notifDrop) {
            notifBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notifDrop.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!notifDrop.contains(e.target) && !notifBtn.contains(e.target)) {
                    notifDrop.classList.remove('active');
                }
            });
        }
    </script>
    <script>
        async function fetchEnterprise() {
            const res = await fetch('/api/enterprise', {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!res.ok) return null;
            return await res.json();
        }
        async function showEnterpriseProfile() {
            const ent = await fetchEnterprise();
            if (!ent) return;

            document.getElementById('businessName').textContent = ent.company_name;
            document.getElementById('ownerName').textContent = ent.contact_person;
            document.getElementById('businessEmail').textContent = ent.email;
            document.getElementById('businessPhone').textContent = ent.phone;
            document.getElementById('businessCategory').textContent = ent.industry_type;
            document.getElementById('businessLocation').textContent = ent.city;
            document.getElementById('businessDescription').textContent = ent.description;

            if (ent.enterprise_photo_url) {
                const logo = document.getElementById('enterpriseLogo');
                logo.src = ent.enterprise_photo_url;
                logo.style.display = 'block';
            }
        }

        showEnterpriseProfile();
    </script>
    <script>
        function openProductModal() {
            document.getElementById('productModal').style.display = 'flex';
        }

        function closeProductModal() {
            document.getElementById('productModal').style.display = 'none';
        }

        document.getElementById('productForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (!res.ok) {
                alert('Failed to add product');
                return;
            }

            closeProductModal();
            this.reset();
            alert('Product added successfully');

            // later: refresh product table here
        });
    </script>
    <script>
        const productForm = document.getElementById('productForm');
        const modalCheckbox = document.getElementById('pm');

        if (productForm) {
            productForm.addEventListener('submit', function() {
                // Close modal
                modalCheckbox.checked = false;

                // Reset form (clear inputs)
                productForm.reset();
            });
        }
    </script>

    <!-- Global Chatbot -->
    @include('components.chatbot')

</body>

</html>