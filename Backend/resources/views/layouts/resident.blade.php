<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Resident Dashboard</title>

    @include('components.styles')
</head>
<body>

@include('components.navbar')

<div class="dashboard-container">
    @include('components.sidebar')

    <main class="dashboard-content">
        @yield('content')
    </main>
</div>

@include('components.scripts')
</body>
</html>
