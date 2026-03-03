<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'professional_id',
        'service_id',
        'appointment_time',
        'notes',
        'status',
        'total_price'
    ];

    protected $casts = [
        'appointment_time' => 'datetime',
        'total_price' => 'decimal:2'
    ];

    /**
     * Get the resident/user who booked the appointment
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the professional for this appointment
     */
    public function professional()
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    /**
     * Get the service for this appointment
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Scope for upcoming appointments
     */
    public function scopeUpcoming($query)
    {
        return $query->where('appointment_time', '>', now())
                     ->where('status', '!=', 'cancelled');
    }

    /**
     * Scope for past appointments
     */
    public function scopePast($query)
    {
        return $query->where('appointment_time', '<', now());
    }

    /**
     * Scope for pending appointments
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for confirmed appointments
     */
    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }
}