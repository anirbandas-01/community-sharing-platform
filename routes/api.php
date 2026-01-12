<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ToolController;

// Test route
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'time' => now(),
        'status' => 'OK'
    ]);
});

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (){
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});


// Tool routes
Route::get('/tools', [ToolController::class, 'index']);
Route::post('/tools', [ToolController::class, 'store']);