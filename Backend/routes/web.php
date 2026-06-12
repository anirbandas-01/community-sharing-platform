<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ChatbotController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('landing');
});

// Chatbot
Route::post('/chatbot', [ChatbotController::class, 'sendMessage'])->name('chatbot.send');

Route::get('/about', function () {
    return view('about');
});

Route::get('/admin_login', function () {
    return view('admin_login');
});

// Login / Logout
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

Route::get('/register', function () {
    return view('user-register');
})->name('register');

// Professional Blade views (kept because these Blade views still exist)
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

// Profile page
Route::get('/profile', function () {
    return view('profile');
})->name('profile');

// Admin dashboard (Blade)
Route::get('/dashboard', [AdminController::class, 'dashboard'])
    ->middleware('admin.session');

// Resident Blade views
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