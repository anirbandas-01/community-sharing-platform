<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();

            // Nullable so guests (not logged in) can also contact admin
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->string('name');
            $table->string('email');
            $table->string('subject')->nullable();
            $table->text('message');

            // What this ticket is about: 'platform' (universal admin support) or 'community'
            $table->string('type')->default('platform');

            // Optional link to a community, e.g. when contacting a community's own admin
            $table->foreignId('community_id')->nullable()->constrained('communities')->nullOnDelete();

            $table->enum('status', ['open', 'in_progress', 'resolved'])->default('open');

            $table->text('admin_reply')->nullable();
            $table->foreignId('replied_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('replied_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
    }
};
