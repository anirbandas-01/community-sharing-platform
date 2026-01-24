<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


use App\Models\Service;
use App\Models\ProfessionalCommunity; 
use App\Models\SharedInventory; 

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens,HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'user_type',
        'phone',
        'address',
        'city',
        'state',
        'zip_code',
        'latitude',
        'longitude',
        'profile_image',

        'profession',
        'specialization',
        'qualification',
        'experience_years',
        'license_number',
        'bio',

        'business_name',
        'business_type',
        'business_category',
        'registration_number',
        'opening_time',
        'closing_time',
        'business_description',

        'website',
        'facebook',
        'instagram',
        'linkedin',
        'twitter',

        'trust_score'
    ];


    /* protected $hidden = [
        'password',
        'remember_token',
    ]; */

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * 
     */
    protected  $casts = [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified' => 'boolean',
            'opening_time' => 'datetime:H:i',
            'closing_time' => 'datetime:H:i',
            'rating' => 'decimal:2',
            'trust_score' => 'integer',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8'
        ];


        public function services()
        {
        return $this->hasMany(Service::class, 'provider_id');
        }

        public function professionalCommunity()
        {
            if($this->user_type === 'professional'){
                return $this->belongsToMany(ProfessionalCommunity::class, 'community_members');
            }
            return null;
        }

        public function sharedInventory()
        {
            if ($this->user_type === 'business')
                {
                    return $this->hasMany(SharedInventory::class, 'business_id');
                }
                return null;
        }

        public function isProfessional()
        {
            return $this->user_type === 'professional';
        }

        public function isBusiness()
        {
            return $this->user_type === 'business';
        }

        public function isResident()
        {
            return $this->user_type === 'resident';
        }

        public function getDisplayName()
        {
            if($this->isBusiness() && $this->business_name){
                return $this->business_name;
            }
            return $this->name;
        }

        public function getProfileImageUrl()
        {
            if($this->profile_image) {
                return asset('storage/profiles' .$this->profile_image);
            }

            $defaults = [
                'resident' => 'default-resident.png',
                'professional' => 'default-professional.png',
                'business' => 'default-business.png'
            ];

            return asset('images/' .($defaults[$this->user_type] ?? 'default-user.png'));
        }

        public function getAddressString() 
        {
            $parts = [];
            if($this->address) {
                $parts [] = $this->address;
            };
            if ($this->city) {
                $parts[] = $this->city;
            };
            if ($this->state) {
                $parts[] = $this->state;
            };
            if ($this->zip_code) {
                $parts[] = $this->zip_code;
            }; 

            return implode(', ', $parts);
        }

         public function scopeProfessionals($query)
        {
            return $query->where('user_type', 'professional');
        }

        public function scopeBusinesses($query)
        {
            return $query->where('user_type', 'business');
        }

        public function scopeResidents($query)
        {
            return $query->where('user_type', 'resident');
        }

        public function scopeByProfession($query, $profession)
        {
            return $query->where('profession', $profession);
        }
        public function scopeByBusinessCategory($query, $category)
        {
            return $query->where('business_category', $category);
        }
          public function scopeNearLocation($query, $lat, $lng, $radiusKm = 10)
    {
        // Simple distance calculation (improve later with spatial extension)
        return $query->whereNotNull('latitude')
                     ->whereNotNull('longitude')
                     ->whereRaw("
                         (6371 * acos(
                             cos(radians(?)) * cos(radians(latitude)) * 
                             cos(radians(longitude) - radians(?)) + 
                             sin(radians(?)) * sin(radians(latitude))
                         )) <= ?
                     ", [$lat, $lng, $lat, $radiusKm]);
    }
    }
