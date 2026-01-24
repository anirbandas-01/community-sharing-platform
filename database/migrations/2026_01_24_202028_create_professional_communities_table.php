<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ONLY create these two tables:
        Schema::create('professional_communities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->boolean('is_private')->default(false);
            $table->timestamps();
        });

        Schema::create('community_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')->constrained('professional_communities')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('role', ['member', 'moderator', 'admin'])->default('member');
            $table->timestamp('joined_at')->useCurrent();
            $table->timestamps();
            
            $table->unique(['community_id', 'user_id']);
        });
        
        // DO NOT CREATE community_posts HERE!
    }

    public function down(): void
    {
        Schema::dropIfExists('community_members');
        Schema::dropIfExists('professional_communities');
    }
};