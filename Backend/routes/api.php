<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfessionalsController;
use App\Http\Controllers\Api\ResidentController;
use App\Http\Controllers\Api\UserController;


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

    Route::get('/professional/services', [ProfessionalsController::class, 'getServicesForBooking']);

    Route::middleware('role:resident')->group(function (){
        Route::get('/resident/profile', [ResidentController::class, 'profile']);
        Route::put('/resident/profile', [ResidentController::class, 'updateProfile']);

        // Appointments/Bookings
        Route::get('/resident/appointments', [ResidentController::class, 'getAppointments']);
        Route::post('/resident/appointments', [ResidentController::class, 'createAppointment']);
        Route::put('/resident/appointments/{id}/cancel', [ResidentController::class, 'cancelAppointment']);
    });
});
