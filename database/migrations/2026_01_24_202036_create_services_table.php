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
        Schema::create('services', function (Blueprint $table) {
        $table->id();
        $table->foreignId('provider_id')->constrained('users')->onDelete('cascade');
        $table->string('title');
        $table->text('description');
        $table->string('category'); // legal, medical, repair, education, etc.
        $table->json('subcategories')->nullable(); // ["divorce", "property", "criminal"] for lawyers
        $table->decimal('price', 10, 2)->nullable(); // Fixed price
        $table->decimal('hourly_rate', 10, 2)->nullable();
        $table->integer('estimated_hours')->nullable();
        $table->json('service_areas')->nullable(); // Areas served
        $table->json('availability')->nullable(); // Days and times
        $table->boolean('is_remote')->default(false); // Can provide remotely
        $table->boolean('is_urgent_available')->default(false);
        $table->integer('min_booking_hours')->default(1);
        $table->json('requirements')->nullable(); // What client needs to provide
        $table->timestamps();
    });
    
    // Service Bookings
    Schema::create('service_bookings', function (Blueprint $table) {
        $table->id();
        $table->string('booking_code')->unique();
        $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('provider_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
        $table->text('client_requirements');
        $table->date('preferred_date');
        $table->time('preferred_time');
        $table->enum('booking_type', ['in_person', 'remote', 'both'])->default('in_person');
        $table->text('address')->nullable();
        $table->decimal('quoted_price', 10, 2);
        $table->integer('estimated_hours');
        $table->enum('status', [
            'pending', 
            'accepted', 
            'rejected', 
            'cancelled',
            'in_progress',
            'completed',
            'disputed'
        ])->default('pending');
        $table->text('provider_notes')->nullable();
        $table->text('cancellation_reason')->nullable();
        $table->timestamp('scheduled_at')->nullable();
        $table->timestamp('started_at')->nullable();
        $table->timestamp('completed_at')->nullable();
        $table->timestamps();
    });
    
    // Reviews for services
    Schema::create('service_reviews', function (Blueprint $table) {
        $table->id();
        $table->foreignId('booking_id')->constrained('service_bookings')->onDelete('cascade');
        $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('provider_id')->constrained('users')->onDelete('cascade');
        $table->integer('rating'); // 1-5
        $table->text('review')->nullable();
        $table->json('tags')->nullable(); // ["punctual", "professional", "knowledgeable"]
        $table->boolean('is_anonymous')->default(false);
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
