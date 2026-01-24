<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SharedInventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'item_name',
        'description',
        'quantity',
        'price_per_day',
        'is_available',
        'condition',
        'terms'
    ];

    public function business()
    {
        return $this->belongsTo(User::class, 'business_id');
    }
}