<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfessionalsController;
use App\Http\Controllers\Api\ResidentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BusinessController;
use App\Http\Controllers\Api\EnterpriseController;
use App\Http\Controllers\Api\AdminController; 
use App\Http\Controllers\Api\CommunitiesController;
use App\Http\Controllers\Api\MessagesController;
use App\Http\Controllers\Api\ReviewsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Admin Routes (add after other routes)
Route::prefix('admin')->group(function () {
    // Admin login
    Route::post('/login', [AuthController::class, 'adminLogin']);
    
    // Protected admin routes
    Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
        
        Route::get('/profile', [AdminController::class, 'profile']); 
        
        // Dashboard
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        
        // Users
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        
        // Communities
        Route::get('/communities', [AdminController::class, 'getCommunities']);
        Route::post('/communities', [AdminController::class, 'createCommunity']);
        Route::put('/communities/{id}', [AdminController::class, 'updateCommunity']);
        Route::delete('/communities/{id}', [AdminController::class, 'deleteCommunity']);
        
        // Verifications
        Route::get('/verifications', [AdminController::class, 'getPendingVerifications']);
        Route::put('/verifications/{id}', [AdminController::class, 'updateVerificationStatus']);
    });
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('user')->group(function () {
        Route::get('/profile', [UserController::class, 'profile']);
        Route::post('/profile', [UserController::class, 'updateProfile']);
        Route::post('/change-password', [UserController::class, 'changePassword']);
        Route::post('/profile/photo', [UserController::class, 'uploadPhoto']);
    });

    Route::get('/search/professionals', [ResidentController::class, 'searchProfessionals']);

    
    Route::middleware(['role:professional'])->group(function () {

    //Dashboard
        Route::get('/professional/dashboard', [ProfessionalsController::class, 'getDashboard']);

    //profile
        Route::get('/professional/profile', [ProfessionalsController::class, 'getProfile']);

        Route::put('/professional/profile', [ProfessionalsController::class, 'updateProfile']);


        //SERVICES
        Route::get('/professional/services', [ProfessionalsController::class, 'listService']);

        Route::post('/professional/services', [ProfessionalsController::class, 'addService']);
  
        Route::get('/professional/services/{id}', [ProfessionalsController::class, 'getService']);

        Route::put('/professional/services/{id}', [ProfessionalsController::class, 'updateService']);

        Route::delete('/professional/services/{id}', [ProfessionalsController::class, 'deleteService']);


        //Appointments
        Route::get('/professional/appointments', [ProfessionalsController::class, 'getAppointment']);

        Route::put('/professional/appointments/{id}', [ProfessionalsController::class, 'updateAppointment']);

        //Earnings
        Route::get('/professional/earnings', [ProfessionalsController::class, 'getEarnings']);

        //Reviews
        Route::get('/professional/reviews', [ProfessionalsController::class, 'getReviews']);

        Route::get('/professional/notifications', [ProfessionalsController::class, 'getNotifications']);
        Route::get('/professional/messages', [ProfessionalsController::class, 'getMessages']);
    });


    Route::middleware('role:resident')->group(function (){
        Route::get('/resident/profile', [ResidentController::class, 'profile']);
        Route::put('/resident/profile', [ResidentController::class, 'updateProfile']);

        // Appointments/Bookings
        Route::get('/resident/appointments', [ResidentController::class, 'getAppointments']);
        Route::post('/resident/appointments', [ResidentController::class, 'createAppointment']);
        Route::put('/resident/appointments/{id}/cancel', [ResidentController::class, 'cancelAppointment']);
    });

    Route::middleware('role:business')->group(function () {
        // Products/Inventory
        Route::get('/business/products', [BusinessController::class, 'getProducts']);
        Route::post('/business/products', [BusinessController::class, 'createProduct']);
        Route::get('/business/products/{id}', [BusinessController::class, 'getProduct']);
        Route::put('/business/products/{id}', [BusinessController::class, 'updateProduct']);
        Route::delete('/business/products/{id}', [BusinessController::class, 'deleteProduct']);

        // Enterprise
        Route::post('/enterprise/register', [EnterpriseController::class, 'store']);
        Route::get('/enterprise/show', [EnterpriseController::class, 'show']);

        // Orders (placeholder)
        Route::get('/business/orders', function () {
            return response()->json(['orders' => []]);
        });
    });
   
    // User Communities (PROTECTED - requires auth)
    Route::get('/user/communities', [CommunitiesController::class, 'userCommunities']);
    Route::post('/communities/{id}/join', [CommunitiesController::class, 'join']);
    Route::post('/communities/{id}/leave', [CommunitiesController::class, 'leave']);
    
    // Bookings (alias for appointments)
    Route::post('/bookings', [ResidentController::class, 'createAppointment']);
    Route::post('/bookings/{id}/cancel', [ResidentController::class, 'cancelAppointment']);
    Route::get('/user/bookings', [ResidentController::class, 'getAppointments']);
    
    // Messages (PROTECTED)
    Route::get('/messages/conversations', [MessagesController::class, 'conversations']);
    Route::get('/messages/conversations/{id}', [MessagesController::class, 'messages']);
    Route::post('/messages', [MessagesController::class, 'send']);
    
    // Settings (PROTECTED)
    Route::get('/user/settings', [UserController::class, 'getSettings']);
    Route::post('/user/settings', [UserController::class, 'saveSettings']);


    Route::post('/reviews', [ReviewsController::class, 'store']); // Create review
    Route::get('/user/reviews', [ReviewsController::class, 'getUserReviews']); // Get my reviews
    Route::put('/reviews/{id}', [ReviewsController::class, 'update']); // Update my review
    Route::delete('/reviews/{id}', [ReviewsController::class, 'destroy']); // Delete my review
    Route::post('/reviews/{id}/respond', [ReviewsController::class, 'respond']); // Professional responds
});
  
// Public Communities
Route::get('/communities', [CommunitiesController::class, 'index']);
Route::get('/communities/{id}', [CommunitiesController::class, 'show']);
Route::get('/communities/{id}/members', [CommunitiesController::class, 'members']);
Route::get('/communities/{id}/posts', [CommunitiesController::class, 'posts']);

// Public Professionals
Route::get('/professionals', [ProfessionalsController::class, 'publicList']);
Route::get('/professionals/{id}', [ProfessionalsController::class, 'publicShow']);
Route::get('/professionals/{id}/reviews', [ProfessionalsController::class, 'reviews']);

// Public review endpoint
Route::get('/professionals/{id}/reviews', [ReviewsController::class, 'getProfessionalReviews']);