<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Business\ProductController;
use App\Http\Controllers\ChatbotController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {

    return view('landing');
});

// Chatbot API Endpoint
Route::post('/chatbot', [ChatbotController::class, 'sendMessage'])->name('chatbot.send');

// Route added for team section - commented out as requested
Route::get('/about', function () {
    return view('about');
});

Route::get('/admin_login', function () {

    return view('admin_login');
});

/*Login */
Route::get('/login', function () {
    return view('login');
})->name('login');

Route::post('/submit', [AdminController::class, 'login']);

Route::post('/logout', function () {
    auth()->logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/login');
})->name('logout');

Route::get('/dashboard', function () {
    if (!session()->has('admin_id')) {
        return redirect('/admin_login');
    }
    return view('dashboardKoushik');
});
Route::get('/register', function () {
    return view('user-register');
})->name('register');


//professional
Route::get('/professional', function () {
    return view('professional.professional');
})->name('professional');

Route::get('/professional-settings', function () {
    return view('professional.professional-settings');
})->name('professional-settings');

Route::get('/my-services', function () {
    return view('professional.my-services');
})->name('my-services');

Route::get('/appointments', function () {
    return view('professional.appointments');
})->name('appointments');

Route::get('/earnings', function () {
    return view('professional.earnings');
})->name('earnings');

Route::get('/reviews', function () {
    return view('professional.reviews');
})->name('reviews');

Route::get('/messages', function () {
    return view('professional.messages');
})->name('messages');


// ========== B2B COMMUNITY ROUTES (NEW - SEPARATE PREFIX) ==========

// B2B Home/Welcome Page
Route::get('/b2b-welcome', function () {
    return view('welcome'); // Your welcome.blade.php
})->name('b2b.welcome');
Route::get('/business/dashboard', [ProductController::class, 'dashboard'])
    ->name('business.businessDashboard');

// B2B Login Page (different from your existing /login)
Route::get('/b2b-login', function () {
    return view('login'); // Your login.blade.php (B2B version)
})->name('b2b.login');

// B2B Login Action
Route::post('/b2b-login-action', function () {
    // Store user in session
    session([
        'b2b_user_id' => 1,
        'b2b_user_name' => request('name') ?? 'Business Owner',
        'b2b_user_email' => request('email') ?? 'demo@business.com',
        'b2b_user_company' => 'Tech Solutions Inc.',
        'b2b_user_type' => 'business'
    ]);

    return redirect('/b2b-dashboard')->with('success', 'Login successful!');
})->name('b2b.login.action');

Route::post('/products/store', [ProductController::class, 'store']);

// B2B Registration Page (different from your existing /register)
Route::get('/b2b-register', function () {
    return view('register'); // Your register.blade.php (B2B version)
})->name('b2b.register');

// B2B Registration Action
Route::post('/b2b-register-action', function () {
    $data = request()->all();

    // Store user in session
    session([
        'b2b_user_id' => 1,
        'b2b_user_name' => $data['name'] ?? 'New Business',
        'b2b_user_email' => $data['email'] ?? 'new@business.com',
        'b2b_user_company' => $data['company_name'] ?? 'New Company',
        'b2b_user_phone' => $data['phone'] ?? '1234567890',
        'b2b_user_industry' => $data['industry'] ?? 'Technology',
        'b2b_user_type' => 'business'
    ]);

    return redirect('/b2b-dashboard')->with('success', 'Registration successful!');
})->name('b2b.register.action');

// B2B Logout
Route::get('/b2b-logout', function () {
    // Clear only B2B session data
    session()->forget([
        'b2b_user_id',
        'b2b_user_name',
        'b2b_user_email',
        'b2b_user_company',
        'b2b_user_phone',
        'b2b_user_industry',
        'b2b_user_type'
    ]);

    return redirect('/b2b-welcome')->with('success', 'Logged out successfully!');
})->name('b2b.logout');

// ========== PROTECTED B2B DASHBOARD ROUTES ==========

// B2B Dashboard (protected)
Route::get('/b2b-dashboard', function () {
    // Check if B2B user is logged in
    if (!session('b2b_user_id')) {
        return redirect('/b2b-login')->with('error', 'Please login to B2B platform!');
    }

    // User data from session
    $user = (object) [
        'name' => session('b2b_user_name', 'Business Owner'),
        'email' => session('b2b_user_email', 'demo@business.com'),
        'company_name' => session('b2b_user_company', 'Tech Solutions Inc.'),
        'phone' => session('b2b_user_phone', '+1 (555) 123-4567'),
        'industry' => session('b2b_user_industry', 'Technology'),
        'business_type' => 'Service Provider',
        'employee_count' => '51-200',
        'address' => '123 Business Street',
        'city' => 'New York',
        'country' => 'USA'
    ];

    return view('index', compact('user')); // Your index.blade.php (dashboard)
})->name('b2b.dashboard');

// B2B Profile Page (protected)
Route::get('/b2b-profile', function () {
    // Check if B2B user is logged in
    if (!session('b2b_user_id')) {
        return redirect('/b2b-login')->with('error', 'Please login to B2B platform!');
    }

    // User data from session
    $user = (object) [
        'name' => session('b2b_user_name', 'Business Owner'),
        'email' => session('b2b_user_email', 'demo@business.com'),
        'company_name' => session('b2b_user_company', 'Tech Solutions Inc.'),
        'phone' => session('b2b_user_phone', '+1 (555) 123-4567'),
        'industry' => session('b2b_user_industry', 'Technology'),
        'business_type' => 'Service Provider',
        'employee_count' => '51-200',
        'annual_revenue' => '1000000',
        'description' => 'Leading business solutions provider.',
        'website' => 'https://example.com',
        'address' => '123 Business Street',
        'city' => 'New York',
        'state' => 'NY',
        'country' => 'USA',
        'zip_code' => '10001'
    ];

    return view('profile', compact('user')); // Your profile.blade.php
})->name('b2b.profile');

// B2B Update Profile
Route::post('/b2b-profile-update', function () {
    // Check if B2B user is logged in
    if (!session('b2b_user_id')) {
        return redirect('/b2b-login')->with('error', 'Please login to B2B platform!');
    }

    $data = request()->all();

    // Update session data
    session([
        'b2b_user_name' => $data['name'] ?? session('b2b_user_name'),
        'b2b_user_email' => $data['email'] ?? session('b2b_user_email'),
        'b2b_user_company' => $data['company_name'] ?? session('b2b_user_company'),
        'b2b_user_phone' => $data['phone'] ?? session('b2b_user_phone'),
        'b2b_user_industry' => $data['industry'] ?? session('b2b_user_industry')
    ]);

    return redirect('/b2b-profile')->with('success', 'Profile updated!');
})->name('b2b.profile.update');

// Profile page
Route::get('/profile', function () {
    return view('profile');
})->name('profile');

Route::get('/dashboard', [AdminController::class, 'dashboard'])
    ->middleware('admin.session');



Route::prefix('resident')->group(function () {

    Route::get('/dashboard', function () {
        return view('resident.resident_dashboard');
    })->name('resident.dashboard');

    Route::get('/services', function () {
        return view('resident.resident_services_with_booking');
    })->name('resident.resident_services_with_booking');

    Route::get('/bookings', function () {
        return view('resident.resident_bookings');
    })->name('resident.bookings');

    Route::get('/profile', function () {
        return view('resident.resident_profile');
    })->name('resident.profile');

    Route::get('/messages', function () {
        return view('resident.resident_messages');
    })->name('resident.messages');
});
