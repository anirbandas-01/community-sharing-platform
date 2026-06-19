<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            // Who receives this notification
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Type of notification — used to pick the right icon/color on the frontend
            $table->enum('type', [
                // Order events
                'order_placed',        // business: someone ordered your product
                'order_cancelled',     // business: buyer cancelled
                'order_status_changed',// buyer: business updated their order
                // Messaging
                'new_message',         // someone sent you a direct message
                'community_post',      // someone posted in a community you're in
                // Booking / professional
                'booking_received',    // professional: new booking request
                'booking_confirmed',   // resident: professional confirmed
                'booking_cancelled',   // resident/professional: cancellation
                'booking_completed',   // resident: marked complete
                // Reviews
                'review_received',     // professional: got a review
                'review_responded',    // resident: professional replied to your review
                // Community
                'community_invite',    // you were invited to a community
                'community_joined',    // admin: someone joined your community
            ]);

            // Human-readable title shown in the bell panel
            $table->string('title');

            // Full description
            $table->string('body');

            // Optional link — frontend will use this for navigation
            $table->string('link')->nullable();

            // Optional meta — store IDs, names, avatars without extra queries
            $table->json('meta')->nullable();

            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            // Index for fast unread queries
            $table->index(['user_id', 'is_read', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};