{{-- Resident Sidebar Component --}}
{{-- This sidebar is used across all resident pages --}}

<aside class="sidebar" id="sidebar">
    {{-- Dashboard --}}
    <a href="{{ route('resident.dashboard') }}"
        class="sidebar-item {{ request()->routeIs('resident.dashboard') ? 'active' : '' }}">
        <i class="fas fa-home"></i>
        Dashboard
    </a>

    {{-- Find Services --}}
    <a href="{{ route('resident.resident_services_with_booking') }}"
        class="sidebar-item {{ request()->routeIs('resident.resident_services_with_booking') ? 'active' : '' }}">
        <i class="fas fa-search"></i>
        Find Services
    </a>

    {{-- My Bookings --}}
    <a href="{{ route('resident.bookings') }}"
        class="sidebar-item {{ request()->routeIs('resident.bookings') ? 'active' : '' }}">
        <i class="fas fa-calendar-check"></i>
        My Bookings
    </a>

    {{-- Messages --}}
    <a href="{{ route('resident.messages') }}"
        class="sidebar-item {{ request()->routeIs('resident.messages') ? 'active' : '' }}">
        <i class="fas fa-comments"></i>
        Messages
    </a>

    {{-- My Profile --}}
    <a href="{{ route('resident.profile') }}"
        class="sidebar-item {{ request()->routeIs('resident.profile') ? 'active' : '' }}">
        <i class="fas fa-user"></i>
        My Profile
    </a>
</aside>