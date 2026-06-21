<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->index(['professional_id', 'status']);
            $table->index(['user_id', 'status']);
            $table->index('appointment_time');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->index(['professional_id', 'review_type']);
            $table->index(['business_user_id', 'review_type']);
            $table->index(['product_id', 'review_type']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->index(['business_user_id', 'status']);
            $table->index(['user_id', 'status']);
            $table->index('created_at');
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->index(['conversation_id', 'created_at']);
            $table->index('sender_id');
        });

        Schema::table('conversations', function (Blueprint $table) {
            $table->index('last_message_at');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index(['user_id', 'stock']);
            $table->index('category');
        });

        Schema::table('community_posts', function (Blueprint $table) {
            $table->index(['community_id', 'created_at']);
        });

        Schema::table('community_members', function (Blueprint $table) {
            $table->index(['user_id', 'community_id']);
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropIndex(['professional_id', 'status']);
            $table->dropIndex(['user_id', 'status']);
            $table->dropIndex(['appointment_time']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex(['professional_id', 'review_type']);
            $table->dropIndex(['business_user_id', 'review_type']);
            $table->dropIndex(['product_id', 'review_type']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['business_user_id', 'status']);
            $table->dropIndex(['user_id', 'status']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->dropIndex(['conversation_id', 'created_at']);
            $table->dropIndex(['sender_id']);
        });

        Schema::table('conversations', function (Blueprint $table) {
            $table->dropIndex(['last_message_at']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'stock']);
            $table->dropIndex(['category']);
        });

        Schema::table('community_posts', function (Blueprint $table) {
            $table->dropIndex(['community_id', 'created_at']);
        });

        Schema::table('community_members', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'community_id']);
        });
    }
};