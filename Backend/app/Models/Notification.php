<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'body',
        'link',
        'meta',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'meta'     => 'array',
        'is_read'  => 'boolean',
        'read_at'  => 'datetime',
    ];

    // ── Relationships ────────────────────────────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ── Scopes ───────────────────────────────────────────────────────────

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    public function markRead(): void
    {
        if (!$this->is_read) {
            $this->update(['is_read' => true, 'read_at' => now()]);
        }
    }

    /**
     * Icon + color mapping used by the frontend.
     * Returns a consistent shape so the UI never needs to know about types.
     */
    public static function iconFor(string $type): array
    {
        return match ($type) {
            'order_placed'         => ['icon' => 'ShoppingBag',   'color' => '#f97316'], // orange
            'order_cancelled'      => ['icon' => 'XCircle',        'color' => '#ef4444'], // red
            'order_status_changed' => ['icon' => 'Truck',           'color' => '#6366f1'], // indigo
            'new_message'          => ['icon' => 'MessageCircle',   'color' => '#6366f1'], // indigo
            'community_post'       => ['icon' => 'Users',           'color' => '#10b981'], // green
            'booking_received'     => ['icon' => 'Calendar',        'color' => '#f59e0b'], // amber
            'booking_confirmed'    => ['icon' => 'CheckCircle',     'color' => '#10b981'], // green
            'booking_cancelled'    => ['icon' => 'XCircle',         'color' => '#ef4444'], // red
            'booking_completed'    => ['icon' => 'CheckCircle2',    'color' => '#10b981'], // green
            'review_received'      => ['icon' => 'Star',            'color' => '#f59e0b'], // amber
            'review_responded'     => ['icon' => 'MessageSquare',   'color' => '#6366f1'], // indigo
            'community_invite'     => ['icon' => 'UserPlus',        'color' => '#10b981'], // green
            'community_joined'     => ['icon' => 'Users',           'color' => '#10b981'], // green
            default                => ['icon' => 'Bell',            'color' => '#6b7280'], // gray
        };
    }
}