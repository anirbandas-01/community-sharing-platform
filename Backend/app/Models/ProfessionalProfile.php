<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfessionalProfile extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'bio',
        'specialization',
        'qualifications',
        'hourly_rate',
        'consultation_fee',
        'services_offered',
        'availability',
        'is_verified',
    ];

    protected $casts = [
        'services_offered' => 'array',
        'availability' => 'array',
        'is_verified' => 'boolean',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
