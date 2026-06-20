<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {

            // Make existing columns nullable
            $table->foreignId('professional_id')->nullable()->change();
            $table->foreignId('appointment_id')->nullable()->change();

            // Review type
            $table->enum('review_type', [
                'professional',
                'product',
                'store'
            ])->default('professional')->after('user_id');

            // Product review fields
            $table->foreignId('product_id')
                ->nullable()
                ->after('professional_id')
                ->constrained('products')
                ->onDelete('cascade');

            $table->foreignId('order_id')
                ->nullable()
                ->after('product_id')
                ->constrained('orders')
                ->nullOnDelete();

            // Business owner
            $table->foreignId('business_user_id')
                ->nullable()
                ->after('order_id')
                ->constrained('users')
                ->onDelete('cascade');
        });

        Schema::table('reviews', function (Blueprint $table) {

            // Drop old unique constraint
            $table->dropUnique(['user_id', 'appointment_id']);

            // Professional reviews
            $table->unique(
                ['user_id', 'appointment_id', 'review_type'],
                'reviews_user_appt_type_unique'
            );

            // Product reviews
            $table->unique(
                ['user_id', 'order_id'],
                'reviews_user_order_unique'
            );
        });

        // PostgreSQL: recreate check constraint with store support
        DB::statement("
            ALTER TABLE reviews
            DROP CONSTRAINT IF EXISTS reviews_review_type_check
        ");

        DB::statement("
            ALTER TABLE reviews
            ADD CONSTRAINT reviews_review_type_check
            CHECK (
                review_type IN ('professional', 'product', 'store')
            )
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE reviews
            DROP CONSTRAINT IF EXISTS reviews_review_type_check
        ");

        Schema::table('reviews', function (Blueprint $table) {

            $table->dropUnique('reviews_user_appt_type_unique');
            $table->dropUnique('reviews_user_order_unique');

            $table->dropForeign(['product_id']);
            $table->dropForeign(['order_id']);
            $table->dropForeign(['business_user_id']);

            $table->dropColumn([
                'review_type',
                'product_id',
                'order_id',
                'business_user_id'
            ]);
        });
    }
};