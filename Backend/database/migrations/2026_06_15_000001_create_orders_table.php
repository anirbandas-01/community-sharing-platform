<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // Who placed the order (resident or professional)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Which business owns the product
            $table->foreignId('business_user_id')->constrained('users')->onDelete('cascade');

            // Which product was ordered
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');

            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2);   // price at time of order
            $table->decimal('total_price', 10, 2);  // quantity * unit_price

            $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
                  ->default('pending');

            $table->text('delivery_address')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};