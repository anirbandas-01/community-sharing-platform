@extends('layouts.dashboard', [
    'pageTitle' => 'Professional Dashboard',
    'userInitials' => 'JD',
    'menuItems' => [
        ['icon' => 'th-large', 'label' => 'Dashboard', 'route' => 'professional', 'active' => true],
        ['icon' => 'briefcase', 'label' => 'My Services', 'route' => 'my-services', 'active' => false],
        ['icon' => 'calendar-check', 'label' => 'Appointments', 'route' => 'appointments', 'active' => false],
        ['icon' => 'dollar-sign', 'label' => 'Earnings', 'route' => 'earnings', 'active' => false],
        ['icon' => 'sign-out-alt', 'label' => 'Logout', 'route' => 'logout', 'active' => false]
    ]
])

@section('dashboard-content')
    <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 32px;">Welcome Back!</h1>

    <!-- Stats Grid -->
    <div class="stats-grid">
        @include('components.stats-card', [
            'label' => 'Total Earnings',
            'value' => '₹' . number_format($stats['earnings'] ?? 0),
            'icon' => 'rupee-sign',
            'iconColor' => 'green',
            'change' => 12
        ])

        @include('components.stats-card', [
            'label' => 'Upcoming Appointments',
            'value' => $stats['appointments'] ?? 0,
            'icon' => 'calendar-check',
            'iconColor' => 'blue'
        ])

        @include('components.stats-card', [
            'label' => 'Average Rating',
            'value' => number_format($stats['rating'] ?? 0, 1),
            'icon' => 'star',
            'iconColor' => 'purple'
        ])

        @include('components.stats-card', [
            'label' => 'Active Services',
            'value' => $stats['services'] ?? 0,
            'icon' => 'briefcase',
            'iconColor' => 'orange'
        ])
    </div>

    <!-- Appointments Section -->
    <div class="section">
        <div class="section-header">
            <h2 class="section-title">Upcoming Appointments</h2>
            <a href="/appointments" class="view-all">View All</a>
        </div>
        <div id="appointments-container">
            <!-- Will be populated by JavaScript -->
        </div>
    </div>
@endsection

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/pages/dashboard.css') }}">
@endpush

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            loadDashboardData();
        });

        async function loadDashboardData() {
            const data = await apiGet('/professional/dashboard');
            // Update UI with data
        }
    </script>
@endpush