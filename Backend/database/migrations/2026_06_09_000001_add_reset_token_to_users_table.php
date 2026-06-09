<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds two columns to the users table for password reset.
 *
 * reset_token            — a random 64-char hex token (nullable, cleared after use)
 * reset_token_expires_at — when the token expires (15 minutes from request time)
 *
 * Later, when you add OTP support you can:
 *  1. Add an `otp_code` column here alongside the token.
 *  2. The PasswordResetController already has an `sendOtp()` stub ready for that.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('reset_token', 64)->nullable()->after('remember_token');
            $table->timestamp('reset_token_expires_at')->nullable()->after('reset_token');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['reset_token', 'reset_token_expires_at']);
        });
    }
};