<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_one_id',
        'user_two_id',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    public function userOne()
    {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    public function userTwo()
    {
        return $this->belongsTo(User::class, 'user_two_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function latestMessage()
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    /**
     * Get the other user in this conversation
     */
    public function otherUser(int $currentUserId): User
    {
        return $this->user_one_id === $currentUserId
            ? $this->userTwo
            : $this->userOne;
    }

    /**
     * Find or create a conversation between two users
     */
    public static function findOrCreateBetween(int $userOneId, int $userTwoId): self
    {
        // Always store with smaller id as user_one to avoid duplicates
        $smaller = min($userOneId, $userTwoId);
        $larger  = max($userOneId, $userTwoId);

        return self::firstOrCreate([
            'user_one_id' => $smaller,
            'user_two_id' => $larger,
        ]);
    }
}