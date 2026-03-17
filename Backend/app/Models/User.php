<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Mass assignable fields
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'user_type',
        'phone',
        'aadhaar',
        'city',
        'address',
        'bio',
        'profile_image',
    ];

    /**
     * Hidden fields (won’t appear in JSON)
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed', 
    ];
    

    public function residentProfile()
    {
        return $this->hasOne(\App\Models\ResidentProfile::class);
    }

    public function professionalProfile()
    {
        return $this->hasOne (\App\Models\ProfessionalProfile::class);
    }
    // Services (as a professional)
    public function services()
    {
        return $this->hasMany(Service::class, 'professional_id');
    }

    // Appointments (as a client)
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'user_id');
    }

    // Appointments (as a professional)
    public function professionalAppointments()
    {
        return $this->hasMany(Appointment::class, 'professional_id');
    }

    /**
     * Check if user is a professional
     */
    public function isProfessional()
    {
        return $this->user_type === 'professional';
    }

    /**
     * Check if user is a business
     */
    public function isBusiness()
    {
        return $this->user_type === 'business';
    }

    /**
     * Check if user is a resident
     */
    public function isResident()
    {
        return $this->user_type === 'resident';
    }


    public function enterprise()
    {
        return $this->hasOne(Enterprise::class);
    }

    /**
 * Check if user is an admin
 */
        public function isAdmin()
        {
            return $this->user_type === 'admin';
        }

        /**
 * Communities this user is a member of
 */
public function communities()
{
    return $this->belongsToMany(Community::class, 'community_members')
        ->withPivot('role', 'status')
        ->withTimestamps();
}

   /**
 * Reviews written by this user
 */
public function reviewsGiven()
{
    return $this->hasMany(Review::class, 'user_id');
}
 
/**
 * Reviews received by this professional
 */
public function reviewsReceived()
{
    return $this->hasMany(Review::class, 'professional_id');
}
 
/**
 * Get average rating for this professional
 */
public function getAverageRatingAttribute()
{
    if ($this->user_type !== 'professional') {
        return null;
    }
    return round($this->reviewsReceived()->avg('rating'), 1);
}
 
/**
 * Get total review count
 */
public function getTotalReviewsAttribute()
{
    if ($this->user_type !== 'professional') {
        return 0;
    }
    return $this->reviewsReceived()->count();
}
}
