<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'professional_id',
        'name',
        'description',
        'price',
        'duration',
        'category',
        'is_active'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'duration' => 'integer',
        'is_active' => 'boolean'
    ];

    /**
     * Get the professional who owns this service
     */
    public function professional()
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    /**
     * Get appointments for this service
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

        public function reviews()
    {
        return $this->hasManyThrough(
            Review::class,
            Appointment::class,
            'service_id', // Foreign key on appointments table
            'appointment_id', // Foreign key on reviews table
            'id', // Local key on services table
            'id' // Local key on appointments table
        );
    }
    
    /**
     * Scope for active services only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

}