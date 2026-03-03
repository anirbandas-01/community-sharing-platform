@extends('layouts.app')

@section('content')
    @include('components.navbar', [
        'title' => $pageTitle ?? 'Dashboard',
        'userInitials' => $userInitials ?? 'U'
    ])

    @include('components.sidebar', [
        'menuItems' => $menuItems ?? []
    ])

    <main class="main-content">
        @yield('dashboard-content')
    </main>
@endsection

@push('scripts')
    <script src="{{ asset('js/components/sidebar.js') }}"></script>
    <script src="{{ asset('js/components/notifications.js') }}"></script>
@endpush