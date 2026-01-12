<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/db-test', function () {
    try {
        // Test database connection
        DB::connection()->getPdo();
        
        // Count users
        $users = DB::table('users')->count();
        
        // Get all table names
        $tables = DB::select('SHOW TABLES');
        
        // Format table names for better readability
        $tableNames = [];
        foreach ($tables as $table) {
            foreach ($table as $key => $value) {
                $tableNames[] = $value;
            }
        }
        
        return response()->json([
            'database' => 'Connected',
            'users_count' => $users,
            'tables' => $tableNames,
            'timestamp' => now()->format('Y-m-d H:i:s')
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'database' => 'Not connected',
            'error' => $e->getMessage(),
            'timestamp' => now()->format('Y-m-d H:i:s')
        ], 500);
    }
});