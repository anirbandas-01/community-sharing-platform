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
         Schema::create('shared_inventory', function (Blueprint $table) {
        $table->id();
        $table->foreignId('business_id')->constrained('users')->onDelete('cascade');
        $table->string('product_name');
        $table->text('description');
        $table->string('category'); // electronics, groceries, hardware, etc.
        $table->string('brand')->nullable();
        $table->string('model')->nullable();
        $table->decimal('price', 10, 2)->nullable(); // Selling price
        $table->decimal('cost_price', 10, 2)->nullable(); // For B2B sharing
        $table->integer('quantity_available')->default(0);
        $table->integer('minimum_order')->default(1);
        $table->enum('sharing_type', ['sell', 'rent', 'borrow', 'exchange']);
        $table->json('images')->nullable();
        $table->boolean('is_urgent')->default(false);
        $table->timestamp('available_until')->nullable();
        $table->json('delivery_options')->nullable(); // ["pickup", "delivery", "both"]
        $table->decimal('delivery_charge', 8, 2)->nullable();
        $table->timestamps();
        $table->softDeletes();
    });
    
    // Inventory Requests from other businesses
    Schema::create('inventory_requests', function (Blueprint $table) {
        $table->id();
        $table->foreignId('from_business_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('to_business_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('inventory_id')->constrained('shared_inventory')->onDelete('cascade');
        $table->integer('quantity');
        $table->text('purpose')->nullable(); // "Customer order", "Stock shortage", "Emergency"
        $table->timestamp('needed_by')->nullable();
        $table->enum('status', ['pending', 'accepted', 'rejected', 'completed', 'cancelled'])->default('pending');
        $table->text('response_note')->nullable();
        $table->timestamp('responded_at')->nullable();
        $table->timestamps();
    });
    
    // Business-to-Business Transactions
    Schema::create('b2b_transactions', function (Blueprint $table) {
        $table->id();
        $table->string('transaction_id')->unique();
        $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('inventory_id')->constrained('shared_inventory')->onDelete('cascade');
        $table->integer('quantity');
        $table->decimal('unit_price', 10, 2);
        $table->decimal('total_amount', 10, 2);
        $table->decimal('delivery_charge', 8, 2)->default(0);
        $table->decimal('tax_amount', 10, 2)->default(0);
        $table->decimal('grand_total', 10, 2);
        $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
        $table->enum('delivery_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending');
        $table->text('delivery_address')->nullable();
        $table->text('notes')->nullable();
        $table->timestamp('completed_at')->nullable();
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shared_inventories');
    }
};
