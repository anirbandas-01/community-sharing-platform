<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tool extends Model {
    protected $fillable = [
        'name', 'description','price_per_day', 'user_id','status'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}