@php
$menuItems = [
[
'label' => 'Dashboard',
'icon' => 'home',
'route' => route('resident.dashboard'),
'active'=> request()->routeIs('resident.dashboard')
],
[
'label' => 'Bookings',
'icon' => 'calendar',
'route' => route('resident.bookings'),
'active'=> request()->routeIs('resident.bookings')
],
[
'label' => 'Profile',
'icon' => 'user',
'route' => route('resident.profile'),
'active'=> request()->routeIs('resident.profile')
],
[
'label' => 'Logout',
'icon' => 'sign-out-alt',
'route' => 'logout'
],
];
@endphp

<aside class="sidebar" id="sidebar">
    @foreach($menuItems as $item)
    @php
    $onClickAction = $item['route'] === 'logout'
    ? 'logout()'
    : "window.location='" . $item['route'] . "'";
    @endphp
    <div class="sidebar-item {{ $item['active'] ?? false ? 'active' : '' }}"
        onclick="{{ $onClickAction }}">

        <i class="fas fa-{{ $item['icon'] }}"></i>
        {{ $item['label'] }}
    </div>
    @endforeach
</aside>