<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('enterprises', function (Blueprint $table) {
        $table->id();

        // link to business owner
        $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');

        $table->string('company_name');
        $table->string('registration_number');
        $table->string('industry_type');

        $table->string('annual_revenue');

        $table->string('contact_person');
        $table->string('designation');
        $table->string('email');
        $table->string('phone', 10);

        $table->text('address');
        $table->string('city');

        $table->text('description');

        // store uploaded image path
        $table->string('enterprise_photo');

        // workflow
        $table->enum('status', ['pending', 'approved', 'rejected'])
              ->default('pending');

        $table->timestamps();
    });
}

};
