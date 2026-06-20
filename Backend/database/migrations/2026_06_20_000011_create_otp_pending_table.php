<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('otp_pending', function (Blueprint $table) {
            $table->id();
            $table->string('identifier'); // email or phone
            $table->string('identifier_type'); // 'email' | 'phone'
            $table->string('otp_code', 64); // hashed
            $table->timestamp('otp_expires_at');
            $table->string('purpose'); // 'registration' | 'password_reset'
            $table->json('payload')->nullable(); // stores pending registration data
            $table->timestamps();

            $table->index(['identifier', 'purpose']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('otp_pending');
    }
};