<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Reviewer (resident)
            $table->foreignId('professional_id')->constrained('users')->onDelete('cascade'); // Professional being reviewed
            $table->foreignId('appointment_id')->nullable()->constrained()->onDelete('set null'); // Related booking
            $table->integer('rating')->unsigned(); // 1-5 stars
            $table->text('comment')->nullable();
            $table->text('professional_response')->nullable(); // Professional can respond
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
            
            // Prevent duplicate reviews for same appointment
            $table->unique(['user_id', 'appointment_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};