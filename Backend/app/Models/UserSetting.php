<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'settings'];

    protected $casts = [
        'settings' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Default settings returned when no record exists yet.
     */
    public static function defaults(): array
    {
        return [
            'email_notifications'   => true,
            'sms_notifications'     => false,
            'push_notifications'    => true,
            'booking_updates'       => true,
            'community_updates'     => true,
            'message_notifications' => true,
            'promotional_emails'    => false,
            'profile_visibility'    => 'public',
            'show_phone'            => true,
            'show_email'            => false,
            'show_address'          => false,
            'language'              => 'en',
            'timezone'              => 'Asia/Kolkata',
            'theme'                 => 'light',
            // business-specific
            'business_visible'      => true,
            'order_notifications'   => true,
            'low_stock_alerts'      => true,
            'show_contact'          => true,
        ];
    }
}