<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // User type (resident, professional, business)
            $table->enum('user_type', ['resident', 'professional', 'business'])
                  ->default('resident')
                  ->after('email');
            
            // Common optional fields for all
            $table->string('phone')->nullable()->after('user_type');
            $table->text('address')->nullable()->after('phone');
            $table->string('city')->nullable()->after('address');
            $table->string('state')->nullable()->after('city');
            $table->string('zip_code')->nullable()->after('state');
            $table->decimal('latitude', 10, 8)->nullable()->after('zip_code');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            
            // Profile image
            $table->string('profile_image')->nullable()->after('longitude');
            
            // For Professionals
            $table->string('profession')->nullable()->after('profile_image');
            $table->string('specialization')->nullable()->after('profession');
            $table->string('qualification')->nullable()->after('specialization');
            $table->string('experience_years')->nullable()->after('qualification');
            $table->string('license_number')->nullable()->after('experience_years');
            $table->text('bio')->nullable()->after('license_number');
            
            // For Businesses
            $table->string('business_name')->nullable()->after('bio');
            $table->string('business_type')->nullable()->after('business_name');
            $table->string('business_category')->nullable()->after('business_type');
            $table->string('registration_number')->nullable()->after('business_category');
            $table->time('opening_time')->nullable()->after('registration_number');
            $table->time('closing_time')->nullable()->after('opening_time');
            $table->text('business_description')->nullable()->after('closing_time');
            
            // Social Links (all users)
            $table->string('website')->nullable()->after('business_description');
            $table->string('facebook')->nullable()->after('website');
            $table->string('instagram')->nullable()->after('facebook');
            $table->string('linkedin')->nullable()->after('instagram');
            $table->string('twitter')->nullable()->after('linkedin');
            
            // Verification
            $table->boolean('is_verified')->default(false)->after('twitter');
            $table->string('verification_document')->nullable()->after('is_verified');
            
            // Stats (will be updated later)
            $table->integer('total_connections')->default(0)->after('verification_document');
            $table->integer('completed_services')->default(0)->after('total_connections');
            $table->decimal('rating', 3, 2)->default(0)->after('completed_services');
            $table->integer('review_count')->default(0)->after('rating');
            
            // Trust score
            $table->integer('trust_score')->default(100)->after('review_count');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop all the added columns
            $columns = [
                'user_type', 'phone', 'address', 'city', 'state', 'zip_code',
                'latitude', 'longitude', 'profile_image', 'profession',
                'specialization', 'qualification', 'experience_years',
                'license_number', 'bio', 'business_name', 'business_type',
                'business_category', 'registration_number', 'opening_time',
                'closing_time', 'business_description', 'website', 'facebook',
                'instagram', 'linkedin', 'twitter', 'is_verified',
                'verification_document', 'total_connections', 'completed_services',
                'rating', 'review_count', 'trust_score'
            ];
            
            foreach ($columns as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};