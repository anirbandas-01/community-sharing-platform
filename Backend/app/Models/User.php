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
    
    protected $appends = ['profile_image_url'];

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

    public function getProfileImageUrlAttribute()
    {
        if ($this->profile_image) {
            return asset('storage/profiles/' . $this->profile_image);
        }
        return null;
    }
    public function enterprise()
    {
        return $this->hasOne(Enterprise::class);
    }

}
