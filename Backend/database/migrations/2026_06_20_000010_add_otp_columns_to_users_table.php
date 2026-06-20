<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('otp_code', 64)->nullable()->after('reset_token_expires_at');
            $table->timestamp('otp_expires_at')->nullable()->after('otp_code');
            $table->string('otp_purpose')->nullable()->after('otp_expires_at'); // 'registration' | 'password_reset'
            // For pre-registration (user not yet created), store pending data
            $table->json('pending_registration')->nullable()->after('otp_purpose');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['otp_code', 'otp_expires_at', 'otp_purpose', 'pending_registration']);
        });
    }
};