<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Drop the old enum constraint if it exists
        DB::statement("
            DO $$ 
            BEGIN
                IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type_enum') THEN
                    ALTER TABLE users 
                    ALTER COLUMN user_type TYPE VARCHAR(50);
                    
                    DROP TYPE user_type_enum;
                END IF;
            END $$;
        ");
        
        // Add a check constraint for allowed values
        DB::statement("
            ALTER TABLE users 
            ADD CONSTRAINT user_type_check 
            CHECK (user_type IN ('resident', 'professional', 'business', 'admin'))
        ");
        
        // Add aadhaar column if it doesn't exist
        if (!Schema::hasColumn('users', 'aadhaar')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('aadhaar')->nullable()->after('phone');
            });
        }
    }

    public function down(): void
    {
        // Drop the check constraint
        DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS user_type_check");
        
        // Recreate the original enum without 'admin'
        DB::statement("
            CREATE TYPE user_type_enum AS ENUM ('resident', 'professional', 'business');
            ALTER TABLE users ALTER COLUMN user_type TYPE user_type_enum USING user_type::user_type_enum;
        ");
        
        // Remove aadhaar column
        if (Schema::hasColumn('users', 'aadhaar')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('aadhaar');
            });
        }
    }
};