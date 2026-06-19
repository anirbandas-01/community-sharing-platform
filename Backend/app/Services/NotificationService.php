<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use App\Models\Community;
use Illuminate\Support\Facades\Log;

/**
 * NotificationService
 *
 * Single place to create every notification in the app.
 * Call these static methods from controllers — no duplication, no typos.
 *
 * Each method follows the same shape:
 *   NotificationService::notifyXxx($actor, $target, $relatedModel);
 */
class NotificationService
{
    // ── Orders ───────────────────────────────────────────────────────────

    /**
     * Order placed → notify the business owner.
     */
    public static function orderPlaced(\App\Models\Order $order): void
    {
        self::create($order->business_user_id, 'order_placed', [
            'title' => 'New order received 🛍️',
            'body'  => "{$order->user->name} ordered {$order->quantity}× {$order->product->name}",
            'link'  => '/business/orders',
            'meta'  => [
                'order_id'    => $order->id,
                'buyer_name'  => $order->user->name,
                'product'     => $order->product->name,
                'total'       => $order->total_price,
            ],
        ]);
    }

    /**
     * Buyer cancelled → notify business.
     */
    public static function orderCancelled(\App\Models\Order $order, string $cancelledBy = 'buyer'): void
    {
        // Notify business owner
        self::create($order->business_user_id, 'order_cancelled', [
            'title' => 'Order cancelled',
            'body'  => "{$order->user->name} cancelled their order for {$order->product->name}",
            'link'  => '/business/orders',
            'meta'  => ['order_id' => $order->id],
        ]);

        // If business cancelled, notify buyer
        if ($cancelledBy === 'business') {
            self::create($order->user_id, 'order_status_changed', [
                'title' => 'Your order was cancelled',
                'body'  => "Your order for {$order->product->name} has been cancelled by the seller.",
                'link'  => "/{$order->user->user_type}/my-orders",
                'meta'  => ['order_id' => $order->id, 'status' => 'cancelled'],
            ]);
        }
    }

    /**
     * Business updated order status → notify buyer.
     */
    public static function orderStatusChanged(\App\Models\Order $order): void
    {
        $labels = [
            'processing' => 'is being processed',
            'shipped'    => 'has been shipped',
            'delivered'  => 'has been delivered',
            'cancelled'  => 'has been cancelled',
        ];

        $label = $labels[$order->status] ?? "status changed to {$order->status}";

        self::create($order->user_id, 'order_status_changed', [
            'title' => 'Order update',
            'body'  => "Your order for {$order->product->name} {$label}.",
            'link'  => "/{$order->user->user_type}/my-orders",
            'meta'  => ['order_id' => $order->id, 'status' => $order->status],
        ]);
    }

    // ── Messaging ────────────────────────────────────────────────────────

    /**
     * New direct message → notify recipient.
     */
    public static function newMessage(\App\Models\Message $message, \App\Models\Conversation $conversation): void
    {
        $sender    = User::find($message->sender_id);
        $recipient = $conversation->user_one_id === $message->sender_id
            ? $conversation->userTwo
            : $conversation->userOne;

        if (!$recipient || !$sender) return;

        $link = match ($recipient->user_type) {
            'professional' => '/professional/messages',
            'business'     => '/business/messages',
            default        => '/resident/messages',
        };

        self::create($recipient->id, 'new_message', [
            'title' => "New message from {$sender->name}",
            'body'  => strlen($message->message) > 60
                ? substr($message->message, 0, 60) . '…'
                : $message->message,
            'link'  => $link,
            'meta'  => [
                'sender_id'       => $sender->id,
                'sender_name'     => $sender->name,
                'sender_avatar'   => $sender->profile_image,
                'conversation_id' => $conversation->id,
            ],
        ]);
    }

    /**
     * New community post → notify all members except the author.
     * Batched to avoid N+1 insert issues.
     */
    public static function communityPost(\App\Models\CommunityPost $post): void
    {
        try {
            $community = Community::with('members')->find($post->community_id);
            if (!$community) return;

            $rows = [];
            $now  = now();

            foreach ($community->members as $member) {
                if ($member->id === $post->user_id) continue; // skip author

                $link = match ($member->user_type) {
                    'professional' => '/professional/messages',
                    'business'     => '/business/messages',
                    default        => '/resident/messages',
                };

                $rows[] = [
                    'user_id'    => $member->id,
                    'type'       => 'community_post',
                    'title'      => "New post in {$community->name}",
                    'body'       => strlen($post->content) > 80
                        ? substr($post->content, 0, 80) . '…'
                        : $post->content,
                    'link'       => $link,
                    'meta'       => json_encode([
                        'community_id'   => $community->id,
                        'community_name' => $community->name,
                        'author_name'    => $post->user->name ?? 'Someone',
                    ]),
                    'is_read'    => false,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            if (!empty($rows)) {
                // Chunk to avoid hitting DB param limits
                foreach (array_chunk($rows, 100) as $chunk) {
                    Notification::insert($chunk);
                }
            }
        } catch (\Exception $e) {
            Log::error('communityPost notification failed: ' . $e->getMessage());
        }
    }

    // ── Bookings ─────────────────────────────────────────────────────────

    /**
     * New booking request → notify professional.
     */
    public static function bookingReceived(\App\Models\Appointment $appointment): void
    {
        $resident    = User::find($appointment->user_id);
        $serviceName = $appointment->service->name ?? 'your service';

        self::create($appointment->professional_id, 'booking_received', [
            'title' => 'New booking request 📅',
            'body'  => "{$resident->name} wants to book {$serviceName} on {$appointment->appointment_time->format('M d, Y')}",
            'link'  => '/professional/bookings',
            'meta'  => [
                'appointment_id' => $appointment->id,
                'client_name'    => $resident->name,
                'service'        => $serviceName,
                'date'           => $appointment->appointment_time->toDateString(),
            ],
        ]);
    }

    /**
     * Booking confirmed by professional → notify resident.
     */
    public static function bookingConfirmed(\App\Models\Appointment $appointment): void
    {
        $professional = User::find($appointment->professional_id);
        $serviceName  = $appointment->service->name ?? 'your service';

        self::create($appointment->user_id, 'booking_confirmed', [
            'title' => 'Booking confirmed ✅',
            'body'  => "{$professional->name} confirmed your {$serviceName} on {$appointment->appointment_time->format('M d, Y')}",
            'link'  => '/resident/bookings',
            'meta'  => [
                'appointment_id'    => $appointment->id,
                'professional_name' => $professional->name,
                'service'           => $serviceName,
            ],
        ]);
    }

    /**
     * Booking cancelled → notify the other party.
     */
    public static function bookingCancelled(\App\Models\Appointment $appointment, string $cancelledBy = 'resident'): void
    {
        $serviceName = $appointment->service->name ?? 'service';

        if ($cancelledBy === 'resident') {
            // Notify professional
            $resident = User::find($appointment->user_id);
            self::create($appointment->professional_id, 'booking_cancelled', [
                'title' => 'Booking cancelled',
                'body'  => "{$resident->name} cancelled their {$serviceName} booking.",
                'link'  => '/professional/bookings',
                'meta'  => ['appointment_id' => $appointment->id],
            ]);
        } else {
            // Notify resident
            $professional = User::find($appointment->professional_id);
            self::create($appointment->user_id, 'booking_cancelled', [
                'title' => 'Booking cancelled',
                'body'  => "{$professional->name} cancelled your {$serviceName} booking.",
                'link'  => '/resident/bookings',
                'meta'  => ['appointment_id' => $appointment->id],
            ]);
        }
    }

    /**
     * Booking completed → notify resident.
     */
    public static function bookingCompleted(\App\Models\Appointment $appointment): void
    {
        $professional = User::find($appointment->professional_id);
        $serviceName  = $appointment->service->name ?? 'service';

        self::create($appointment->user_id, 'booking_completed', [
            'title' => 'Service completed 🎉',
            'body'  => "{$professional->name} marked your {$serviceName} as complete. Leave a review!",
            'link'  => '/resident/bookings',
            'meta'  => [
                'appointment_id'    => $appointment->id,
                'professional_id'   => $professional->id,
                'professional_name' => $professional->name,
            ],
        ]);
    }

    // ── Reviews ──────────────────────────────────────────────────────────

    /**
     * New review received → notify professional.
     */
    public static function reviewReceived(\App\Models\Review $review): void
    {
        $reviewer = User::find($review->user_id);

        self::create($review->professional_id, 'review_received', [
            'title' => "New {$review->rating}★ review",
            'body'  => "{$reviewer->name} left you a review: \"" .
                       (strlen($review->comment) > 60 ? substr($review->comment, 0, 60) . '…' : $review->comment) . '"',
            'link'  => '/professional/reviews',
            'meta'  => [
                'review_id'     => $review->id,
                'reviewer_name' => $reviewer->name,
                'rating'        => $review->rating,
            ],
        ]);
    }

    /**
     * Professional responded to a review → notify the original reviewer.
     */
    public static function reviewResponded(\App\Models\Review $review): void
    {
        $professional = User::find($review->professional_id);

        self::create($review->user_id, 'review_responded', [
            'title' => 'Response to your review',
            'body'  => "{$professional->name} replied to your review.",
            'link'  => '/resident/reviews',
            'meta'  => [
                'review_id'         => $review->id,
                'professional_name' => $professional->name,
            ],
        ]);
    }

    // ── Communities ──────────────────────────────────────────────────────

    /**
     * User invited to community → notify them.
     */
    public static function communityInvite(int $userId, Community $community, User $inviter): void
    {
        $link = match (User::find($userId)?->user_type) {
            'professional' => '/professional/groups',
            default        => '/resident/communities',
        };

        self::create($userId, 'community_invite', [
            'title' => "You were invited to {$community->name}",
            'body'  => "{$inviter->name} invited you to join the {$community->name} community.",
            'link'  => $link,
            'meta'  => [
                'community_id'   => $community->id,
                'community_name' => $community->name,
                'inviter_name'   => $inviter->name,
            ],
        ]);
    }

    /**
     * User joined community → notify community admin/creator.
     */
    public static function communityJoined(int $newMemberId, Community $community): void
    {
        $newMember = User::find($newMemberId);
        if (!$newMember || $community->created_by === $newMemberId) return;

        self::create($community->created_by, 'community_joined', [
            'title' => 'New member joined',
            'body'  => "{$newMember->name} joined {$community->name}.",
            'link'  => '/resident/communities',
            'meta'  => [
                'community_id'   => $community->id,
                'community_name' => $community->name,
                'member_name'    => $newMember->name,
            ],
        ]);
    }

    // ── Core create helper ────────────────────────────────────────────────

    private static function create(int $userId, string $type, array $data): void
    {
        try {
            Notification::create([
                'user_id' => $userId,
                'type'    => $type,
                'title'   => $data['title'],
                'body'    => $data['body'],
                'link'    => $data['link'] ?? null,
                'meta'    => $data['meta'] ?? null,
            ]);
        } catch (\Exception $e) {
            // Never let a notification failure crash the main request
            Log::error("Notification create failed [{$type}]: " . $e->getMessage());
        }
    }
}