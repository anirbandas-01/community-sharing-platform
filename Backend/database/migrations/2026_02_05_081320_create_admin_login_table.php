<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('admin_login', function (Blueprint $table) {
            $table->id();                       // id (primary key)
            $table->string('email')->unique(); // admin email
            $table->string('password');        // hashed password
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_login');
    }
};
