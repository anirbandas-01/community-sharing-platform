<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResidentProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'preferences',
        'saved_professionals',
        'saved_businesses',
        'notification_settings'
    ];

     protected $casts = [
        'preferences' => 'array',
        'saved_professionals' => 'array',
        'saved_businesses' => 'array',
        'notification_settings' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
