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
    Schema::table('appointments', function (Blueprint $table) {

        if (!Schema::hasColumn('appointments', 'user_id')) {
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
        }

        if (!Schema::hasColumn('appointments', 'professional_id')) {
            $table->foreignId('professional_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
        }

        if (!Schema::hasColumn('appointments', 'service_id')) {
            $table->foreignId('service_id')
                  ->nullable()
                  ->constrained('services')
                  ->nullOnDelete();
        }

        if (!Schema::hasColumn('appointments', 'appointment_time')) {
            $table->dateTime('appointment_time');
        }

        if (!Schema::hasColumn('appointments', 'notes')) {
            $table->text('notes')->nullable();
        }

        if (!Schema::hasColumn('appointments', 'status')) {
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])
                  ->default('pending');
        }

        if (!Schema::hasColumn('appointments', 'total_price')) {
            $table->decimal('total_price', 10, 2)->nullable();
        }
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            //
        });
    }
};
