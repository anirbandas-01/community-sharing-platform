<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OtpPending extends Model
{
    protected $table = 'otp_pending';

    protected $fillable = [
        'identifier',
        'identifier_type',
        'otp_code',
        'otp_expires_at',
        'purpose',
        'payload',
    ];

    protected $casts = [
        'otp_expires_at' => 'datetime',
        'payload'        => 'array',
    ];
}