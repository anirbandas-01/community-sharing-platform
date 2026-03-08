<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Community;
use Illuminate\Http\Request;

class CommunitiesController extends Controller
{
    /**
     * GET /communities - List all public communities
     */
    public function index(Request $request)
    {
        try {
            $communities = Community::with('creator')
                ->where('status', 'active')
                ->when($request->search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'LIKE', "%{$search}%")
                          ->orWhere('description', 'LIKE', "%{$search}%");
                    });
                })
                ->when($request->category, function ($query, $category) {
                    if ($category !== 'all') {
                        $query->where('category', $category);
                    }
                })
                ->latest()
                ->get()
                ->map(function ($community) {
                    return [
                        'id' => $community->id,
                        'name' => $community->name,
                        'description' => $community->description,
                        'member_count' => $community->member_count,
                        'location' => 'Mumbai', // Add location field to DB later if needed
                        'admin_name' => $community->creator->name,
                        'category' => $community->category,
                        'image' => $community->image_url,
                        'created_at' => $community->created_at->format('Y-m-d'),
                    ];
                });

            return response()->json(['communities' => $communities]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loading communities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /user/communities - Get user's joined communities
     */
    public function userCommunities(Request $request)
    {
        try {
            $communities = $request->user()
                ->communities()
                ->with('creator')
                ->get()
                ->map(function ($community) {
                    return [
                        'id' => $community->id,
                        'name' => $community->name,
                        'description' => $community->description,
                        'member_count' => $community->member_count,
                        'location' => 'Mumbai',
                        'admin_name' => $community->creator->name,
                        'category' => $community->category,
                        'image' => $community->image_url,
                        'role' => $community->pivot->role,
                    ];
                });

            return response()->json(['communities' => $communities]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loading user communities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /communities/{id} - Get community details
     */
    public function show(Request $request, $id)
    {
        try {
            $community = Community::with('creator')->findOrFail($id);
            $isMember = $community->members()
                ->where('user_id', $request->user()->id)
                ->exists();

            return response()->json([
                'community' => [
                    'id' => $community->id,
                    'name' => $community->name,
                    'description' => $community->description,
                    'image' => $community->image_url,
                    'member_count' => $community->member_count,
                    'location' => 'Mumbai, Maharashtra',
                    'created_at' => $community->created_at->format('Y-m-d'),
                    'admin' => [
                        'name' => $community->creator->name,
                        'role' => 'Community Manager',
                        'avatar' => $community->creator->profile_image_url,
                    ],
                    'category' => $community->category,
                    'rules' => [
                        'Respect all community members',
                        'No spam or promotional content',
                        'Keep discussions relevant',
                        'Report issues to admins',
                        'Be helpful and supportive',
                    ],
                ],
                'is_member' => $isMember
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loading community',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /communities/{id}/members - Get community members
     */
    public function members($id)
    {
        try {
            $community = Community::findOrFail($id);
            
            $members = $community->members()
                ->get()
                ->map(function ($member) {
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                        'role' => $member->pivot->role,
                        'avatar' => $member->profile_image_url,
                        'joined' => $member->pivot->created_at->format('Y-m-d'),
                    ];
                });

            return response()->json(['members' => $members]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loading members',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /communities/{id}/posts - Get community posts
     */
    public function posts($id)
    {
        try {
            $community = Community::findOrFail($id);
            
            $posts = $community->posts()
                ->with('user')
                ->latest()
                ->get()
                ->map(function ($post) {
                    return [
                        'id' => $post->id,
                        'author' => [
                            'name' => $post->user->name,
                            'avatar' => $post->user->profile_image_url,
                        ],
                        'content' => $post->content,
                        'timestamp' => $post->created_at->diffForHumans(),
                        'likes' => $post->likes_count,
                        'comments' => $post->comments_count,
                    ];
                });

            return response()->json(['posts' => $posts]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loading posts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /communities/{id}/join - Join community
     */
    public function join(Request $request, $id)
    {
        try {
            $community = Community::findOrFail($id);
            
            // Check if already a member
            if ($community->members()->where('user_id', $request->user()->id)->exists()) {
                return response()->json([
                    'message' => 'Already a member of this community'
                ], 400);
            }

            // Add as member
            $community->members()->attach($request->user()->id, [
                'role' => 'member',
                'status' => 'active'
            ]);

            // Update member count
            $community->increment('member_count');

            return response()->json([
                'message' => 'Joined community successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error joining community',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /communities/{id}/leave - Leave community
     */
    public function leave(Request $request, $id)
    {
        try {
            $community = Community::findOrFail($id);
            
            // Check if is a member
            if (!$community->members()->where('user_id', $request->user()->id)->exists()) {
                return response()->json([
                    'message' => 'Not a member of this community'
                ], 400);
            }

            // Remove membership
            $community->members()->detach($request->user()->id);

            // Update member count
            $community->decrement('member_count');

            return response()->json([
                'message' => 'Left community successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error leaving community',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}