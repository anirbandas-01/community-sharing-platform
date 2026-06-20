<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'review_type',        // 'professional' | 'product' | 'store'
        'professional_id',
        'appointment_id',
        'product_id',
        'order_id',
        'business_user_id',
        'rating',
        'comment',
        'professional_response',
        'responded_at',
    ];

    protected $casts = [
        'rating' => 'integer',
        'responded_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function professional()
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // The business owner — used for both 'product' and 'store' review types
    public function business()
    {
        return $this->belongsTo(User::class, 'business_user_id');
    }

    public function scopeProfessionalReviews($query)
    {
        return $query->where('review_type', 'professional');
    }

    public function scopeProductReviews($query)
    {
        return $query->where('review_type', 'product');
    }

    public function scopeStoreReviews($query)
    {
        return $query->where('review_type', 'store');
    }

    /**
     * 'product' and 'store' both fall under "business reviews" for owner dashboards.
     */
    public function scopeBusinessReviews($query)
    {
        return $query->whereIn('review_type', ['product', 'store']);
    }

    public function getResponderIdAttribute()
    {
        return in_array($this->review_type, ['product', 'store'])
            ? $this->business_user_id
            : $this->professional_id;
    }
}