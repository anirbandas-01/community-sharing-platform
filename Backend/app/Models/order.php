<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_user_id',
        'product_id',
        'quantity',
        'unit_price',
        'total_price',
        'status',
        'delivery_address',
        'notes',
    ];

    protected $casts = [
        'unit_price'  => 'decimal:2',
        'total_price' => 'decimal:2',
        'quantity'    => 'integer',
    ];

    // The buyer (resident or professional)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // The business owner
    public function business()
    {
        return $this->belongsTo(User::class, 'business_user_id');
    }

    // The product ordered
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}