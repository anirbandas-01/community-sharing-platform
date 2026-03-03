<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\User;
use App\Models\Enterprise;
use App\Models\Product;

class AdminController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validate input
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        // 2. Fetch admin by email
        $admin = Admin::where('email', $request->email)->first();

        // 3. Check credentials (PLAIN TEXT – TEMPORARY)
        if (!$admin || $request->password !== $admin->password) {
            return back()->with('error', 'Invalid credentials');
        }

        // 4. Store admin session
        session([
            'admin_id'    => $admin->id,
            'admin_email' => $admin->email
        ]);

        // 5. Redirect to dashboard
        return redirect('/dashboard');
    }

    public function dashboard()
    {
        // Stats
        $totalUsers = User::count();
        $verifiedBusinesses = Enterprise::where('status', 'verified')->count();
        $totalProducts = Product::count();

        // Recent users
        $recentUsers = User::latest()->limit(5)->get();

        // Businesses
        $businesses = Enterprise::with('user')
            ->withCount('products')
            ->latest()
            ->limit(10)
            ->get();

        // Products
        $products = Product::with('enterprise')
            ->latest()
            ->limit(10)
            ->get();

        return view('dashboardKoushik', compact(
            'totalUsers',
            'verifiedBusinesses',
            'totalProducts',
            'recentUsers',
            'businesses',
            'products'
        ));
    }

}
