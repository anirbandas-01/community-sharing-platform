<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider_id',
        'name',
        'description',
        'price',
        'duration',
        'category',
        'is_active'
    ];

    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }
}