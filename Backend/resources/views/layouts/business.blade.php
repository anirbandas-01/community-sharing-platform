<!DOCTYPE html>
<html>
<head>
    <title>Local Hub | Business Panel</title>
    <style>
        body { font-family: Arial; margin: 0; background: #f4f6f8; }
        nav { background: #1e293b; padding: 15px; }
        nav a { color: white; margin-right: 15px; text-decoration: none; }
        .container { padding: 20px; }
        .card { background: white; padding: 20px; margin-bottom: 20px; border-radius: 6px; }
        button { padding: 8px 15px; background: #2563eb; color: white; border: none; }
        input, textarea, select { width: 100%; padding: 8px; margin-bottom: 10px; }
    </style>
</head>
<body>

<nav>
    <a href="/business/dashboard">Dashboard</a>
    <a href="/business/profile">Profile</a>
    <a href="/business/inventory">Inventory</a>
    <a href="/business/orders">Orders</a>
    <a href="/business/analytics">Analytics</a>
    <a href="/business/network">Network</a>
</nav>

<div class="container">
    @yield('content')
</div>

</body>
</html>
