// database/migrations/2026_06_20_000003_fix_review_order_unique_constraint.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropUnique('reviews_user_order_unique');
            $table->unique(
                ['user_id', 'order_id', 'review_type'],
                'reviews_user_order_type_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropUnique('reviews_user_order_type_unique');
            $table->unique(['user_id', 'order_id'], 'reviews_user_order_unique');
        });
    }
};