{{-- Professional Sidebar Component --}}
{{-- This sidebar is used across all professional pages --}}

<aside class="sidebar" id="sidebar">
    {{-- Dashboard Overview --}}
    <div class="sidebar-item {{ request()->is('professional') ? 'active' : '' }}"
        onclick="window.location='{{ route('professional') }}'">
        <i class="fas fa-th-large"></i>
        Dashboard Overview
    </div>

    {{-- My Services --}}
    <div class="sidebar-item {{ request()->is('my-services') ? 'active' : '' }}"
        onclick="window.location='{{ route('my-services') }}'">
        <i class="fas fa-briefcase"></i>
        My Services
    </div>

    {{-- Appointments --}}
    <div class="sidebar-item {{ request()->is('appointments') ? 'active' : '' }}"
        onclick="window.location='{{ route('appointments') }}'">
        <i class="fas fa-calendar-check"></i>
        Appointments
    </div>

    {{-- My Earnings --}}
    <div class="sidebar-item {{ request()->is('earnings') ? 'active' : '' }}"
        onclick="window.location='{{ route('earnings') }}'">
        <i class="fas fa-dollar-sign"></i>
        My Earnings
    </div>

    {{-- Reviews & Ratings --}}
    <div class="sidebar-item {{ request()->is('reviews') ? 'active' : '' }}"
        onclick="window.location='{{ route('reviews') }}'">
        <i class="fas fa-star"></i>
        Reviews & Ratings
    </div>

    {{-- Messages --}}
    <div class="sidebar-item {{ request()->is('messages') ? 'active' : '' }}"
        onclick="window.location='{{ route('messages') }}'">
        <i class="fas fa-comments"></i>
        Messages
    </div>

    {{-- Settings --}}
    <div class="sidebar-item {{ request()->is('professional-settings') ? 'active' : '' }}"
        onclick="window.location='{{ route('professional-settings') }}'">
        <i class="fas fa-cog"></i>
        Settings
    </div>
</aside>