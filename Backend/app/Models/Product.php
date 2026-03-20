<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'name',
        'sku',
        'category',
        'price',
        'stock',
        'min_stock',
        'photo',
    ];

    // Relationship with user (business owner)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function enterprise()
    {
        return $this->belongsTo(Enterprise::class, 'user_id', 'user_id');
    }
    
    // Auto-generate SKU when creating product
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($product) {
            if (empty($product->sku)) {
                $product->sku = 'SKU-' . strtoupper(uniqid());
            }
            if (empty($product->min_stock)) {
                $product->min_stock = 10;
            }
        });
    }
}