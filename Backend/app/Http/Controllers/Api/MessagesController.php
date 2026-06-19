<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;

class MessagesController extends Controller
{
    /**
     * GET /messages/conversations
     * Returns all conversations for the authenticated user
     */
    public function conversations(Request $request)
    {
        try {
            $userId = $request->user()->id;

            $conversations = Conversation::where('user_one_id', $userId)
                ->orWhere('user_two_id', $userId)
                ->with(['userOne', 'userTwo', 'latestMessage.sender'])
                ->orderBy('last_message_at', 'desc')
                ->get()
                ->map(function ($conversation) use ($userId) {
                    $otherUser   = $conversation->otherUser($userId);
                    $lastMessage = $conversation->latestMessage;

                    // Count unread messages sent by the other user
                    $unreadCount = Message::where('conversation_id', $conversation->id)
                        ->where('sender_id', '!=', $userId)
                        ->where('is_read', false)
                        ->count();

                    return [
                        'id'                => $conversation->id,
                        'user'              => [
                            'id'     => $otherUser->id,
                            'name'   => $otherUser->name,
                            'avatar' => $otherUser->profile_image
                                ?? 'https://ui-avatars.com/api/?name=' . urlencode($otherUser->name) . '&size=48&background=6366f1&color=fff',
                            'role'   => ucfirst($otherUser->user_type),
                            'online' => false,
                        ],
                        'last_message'      => $lastMessage ? $lastMessage->message : 'No messages yet',
                        'last_message_time' => $lastMessage
                            ? $lastMessage->created_at->diffForHumans()
                            : '',
                        'unread_count'      => $unreadCount,
                    ];
                });

            return response()->json(['conversations' => $conversations]);

        } catch (\Exception $e) {
            Log::error('Get conversations error: ' . $e->getMessage());
            return response()->json(['conversations' => []], 500);
        }
    }

    /**
     * GET /messages/conversations/{id}
     * Returns messages for a specific conversation
     */
    public function messages(Request $request, $id)
    {
        try {
            $userId       = $request->user()->id;
            $conversation = Conversation::where('id', $id)
                ->where(function ($q) use ($userId) {
                    $q->where('user_one_id', $userId)
                      ->orWhere('user_two_id', $userId);
                })
                ->firstOrFail();

            // Mark messages from the other user as read
            Message::where('conversation_id', $id)
                ->where('sender_id', '!=', $userId)
                ->where('is_read', false)
                ->update(['is_read' => true]);

            $messages = Message::where('conversation_id', $id)
                ->with('sender')
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($message) use ($userId) {
                    return [
                        'id'      => $message->id,
                        'message' => $message->message,
                        'sender'  => $message->sender_id === $userId ? 'me' : 'them',
                        'time'    => $message->created_at->format('h:i A'),
                        'is_read' => $message->is_read,
                    ];
                });

            return response()->json(['messages' => $messages]);

        } catch (\Exception $e) {
            Log::error('Get messages error: ' . $e->getMessage());
            return response()->json(['messages' => []], 500);
        }
    }

    /**
     * POST /messages
     * Send a message — creates conversation if it doesn't exist
     */
    public function send(Request $request)
    {
        try {
            $validated = $request->validate([
                'conversation_id' => 'nullable|integer|exists:conversations,id',
                'recipient_id'    => 'nullable|integer|exists:users,id',
                'message'         => 'required|string|max:1000',
            ]);

            $userId = $request->user()->id;

            // Get or create conversation
            if (!empty($validated['conversation_id'])) {
                $conversation = Conversation::where('id', $validated['conversation_id'])
                    ->where(function ($q) use ($userId) {
                        $q->where('user_one_id', $userId)
                          ->orWhere('user_two_id', $userId);
                    })
                    ->firstOrFail();
            } elseif (!empty($validated['recipient_id'])) {
                $conversation = Conversation::findOrCreateBetween($userId, $validated['recipient_id']);
            } else {
                return response()->json(['message' => 'Either conversation_id or recipient_id is required'], 422);
            }

            // Create the message
            $message = Message::create([
                'conversation_id' => $conversation->id,
                'sender_id'       => $userId,
                'message'         => $validated['message'],
                'is_read'         => false,
            ]);

            // Update last_message_at on conversation
            $conversation->update(['last_message_at' => now()]);
            NotificationService::newMessage($message, $conversation);

            return response()->json([
                'message'         => 'Message sent successfully',
                'data'            => [
                    'id'              => $message->id,
                    'conversation_id' => $conversation->id,
                    'message'         => $message->message,
                    'sender'          => 'me',
                    'time'            => $message->created_at->format('h:i A'),
                ],
            ], 201);

        } catch (\Exception $e) {
            Log::error('Send message error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to send message'], 500);
        }
    }

    /**
     * POST /messages/start
     * Start a new conversation with a user (e.g. from professional profile page)
     */
    public function start(Request $request)
    {
        try {
            $validated = $request->validate([
                'recipient_id' => 'required|integer|exists:users,id',
            ]);

            $userId       = $request->user()->id;
            $conversation = Conversation::findOrCreateBetween($userId, $validated['recipient_id']);

            return response()->json([
                'message'         => 'Conversation ready',
                'conversation_id' => $conversation->id,
            ]);

        } catch (\Exception $e) {
            Log::error('Start conversation error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to start conversation'], 500);
        }
    }
}