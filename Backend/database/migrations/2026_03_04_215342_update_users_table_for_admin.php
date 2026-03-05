<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add 'admin' to user_type enum
        DB::statement("ALTER TABLE users MODIFY COLUMN user_type ENUM('resident', 'professional', 'business', 'admin') NOT NULL");
        
        // Make aadhaar nullable if it exists
        if (Schema::hasColumn('users', 'aadhaar')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('aadhaar')->nullable()->change();
            });
        } else {
            // Add aadhaar column if it doesn't exist
            Schema::table('users', function (Blueprint $table) {
                $table->string('aadhaar')->nullable()->after('phone');
            });
        }
    }

    public function down(): void
    {
        // Revert user_type enum
        DB::statement("ALTER TABLE users MODIFY COLUMN user_type ENUM('resident', 'professional', 'business') NOT NULL");
        
        // Make aadhaar non-nullable again (if you want)
        if (Schema::hasColumn('users', 'aadhaar')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('aadhaar')->nullable(false)->change();
            });
        }
    }
};