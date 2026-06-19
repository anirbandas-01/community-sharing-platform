<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Community;
use App\Models\CommunityPost;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;

class CommunityPostsController extends Controller
{
    /**
     * GET /communities/{id}/posts
     * Returns posts for a community (with optional since= for polling)
     */
    public function index(Request $request, $id)
    {
        try {
            $community = Community::findOrFail($id);

            // Check membership for private communities
            if ($community->visibility === 'private') {
                $isMember = $community->members()
                    ->where('user_id', $request->user()->id)
                    ->exists();
                if (!$isMember) {
                    return response()->json(['message' => 'Not a member'], 403);
                }
            }

            $query = $community->posts()->with('user')->latest();

            // Allow polling: only return posts newer than a given timestamp
            if ($request->has('since')) {
                $query->where('created_at', '>', $request->since);
            } else {
                $query->limit(50);
            }

            $posts = $query->get()->map(function ($post) use ($request) {
                return [
                    'id'         => $post->id,
                    'content'    => $post->content,
                    'likes'      => $post->likes_count,
                    'comments'   => $post->comments_count,
                    'created_at' => $post->created_at->toIso8601String(),
                    'time'       => $post->created_at->diffForHumans(),
                    'sender'     => $post->user_id === $request->user()->id ? 'me' : 'them',
                    'author'     => [
                        'id'     => $post->user->id,
                        'name'   => $post->user->name,
                        'avatar' => $post->user->profile_image
                            ?? 'https://ui-avatars.com/api/?name=' . urlencode($post->user->name) . '&size=40&background=6366f1&color=fff',
                        'role'   => ucfirst($post->user->user_type),
                    ],
                ];
            });

            // Return in ascending order for display
            return response()->json([
                'posts'      => $posts->reverse()->values(),
                'server_time' => now()->toIso8601String(),
            ]);
        } catch (\Exception $e) {
            Log::error('Get community posts error: ' . $e->getMessage());
            return response()->json(['posts' => []], 500);
        }
    }

    /**
     * POST /communities/{id}/posts
     * Create a new post in the community
     */
    public function store(Request $request, $id)
    {
        try {
            $community = Community::findOrFail($id);

            // Must be a member to post
            $isMember = $community->members()
                ->where('user_id', $request->user()->id)
                ->exists();

            if (!$isMember) {
                return response()->json(['message' => 'Join the community to post'], 403);
            }

            $validated = $request->validate([
                'content' => 'required|string|max:2000',
            ]);

            $post = CommunityPost::create([
                'community_id' => $community->id,
                'user_id'      => $request->user()->id,
                'content'      => $validated['content'],
                'likes_count'  => 0,
                'comments_count' => 0,
            ]);

            $post->load('user');
            NotificationService::communityPost($post);

            return response()->json([
                'message' => 'Post created',
                'post'    => [
                    'id'         => $post->id,
                    'content'    => $post->content,
                    'likes'      => 0,
                    'comments'   => 0,
                    'created_at' => $post->created_at->toIso8601String(),
                    'time'       => 'just now',
                    'sender'     => 'me',
                    'author'     => [
                        'id'     => $post->user->id,
                        'name'   => $post->user->name,
                        'avatar' => $post->user->profile_image
                            ?? 'https://ui-avatars.com/api/?name=' . urlencode($post->user->name) . '&size=40&background=6366f1&color=fff',
                        'role'   => ucfirst($post->user->user_type),
                    ],
                ],
            ], 201);
        } catch (\Exception $e) {
            Log::error('Create community post error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to post'], 500);
        }
    }

    /**
     * POST /communities/{id}/posts/{postId}/like
     * Toggle like on a post
     */
    public function like(Request $request, $id, $postId)
    {
        try {
            $post = CommunityPost::where('community_id', $id)
                ->where('id', $postId)
                ->firstOrFail();

            $post->increment('likes_count');

            return response()->json(['likes' => $post->fresh()->likes_count]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to like'], 500);
        }
    }

    /**
     * POST /messages/start
     * Start or find a direct conversation from a community member profile
     */
    public function startConversation(Request $request)
    {
        try {
            $validated = $request->validate([
                'recipient_id' => 'required|integer|exists:users,id',
            ]);

            $userId = $request->user()->id;

            if ($userId === $validated['recipient_id']) {
                return response()->json(['message' => 'Cannot message yourself'], 400);
            }

            $conversation = \App\Models\Conversation::findOrCreateBetween(
                $userId,
                $validated['recipient_id']
            );

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