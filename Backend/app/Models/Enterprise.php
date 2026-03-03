<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enterprise extends Model
{
    
    protected $fillable = [
        'user_id',
        'company_name',
        'registration_number',
        'industry_type',
        'annual_revenue',
        'contact_person',
        'designation',
        'email',
        'phone',
        'address',
        'city',
        'description',
        'enterprise_photo',
        'status',
    ];

    protected $table = 'enterprises';

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function products()
    {
        return $this->hasMany(
        Product::class,
        'user_id',   // foreign key on products table
        'user_id'    // local key on enterprises table
    );    }

}
