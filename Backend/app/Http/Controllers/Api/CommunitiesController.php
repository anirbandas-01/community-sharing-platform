<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Community;
use Illuminate\Http\Request;

class CommunitiesController extends Controller
{
    // GET /communities
    public function index(Request $request)
    {
        $communities = Community::with('creator')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('description', 'LIKE', "%{$search}%");
            })
            ->get()
            ->map(function ($community) {
                return [
                    'id' => $community->id,
                    'name' => $community->name,
                    'description' => $community->description,
                    'member_count' => $community->members()->count(),
                    'location' => $community->location ?? 'Not specified',
                    'admin_name' => $community->creator->name,
                    'category' => $community->category ?? 'General',
                    'image' => $community->image_url ?? null,
                    'created_at' => $community->created_at->format('Y-m-d'),
                ];
            });

        return response()->json(['communities' => $communities]);
    }

    // GET /user/communities
    public function userCommunities(Request $request)
    {
        $communities = $request->user()
            ->communities()
            ->with('creator')
            ->get()
            ->map(function ($community) {
                return [
                    'id' => $community->id,
                    'name' => $community->name,
                    'description' => $community->description,
                    'member_count' => $community->members()->count(),
                    'location' => $community->location ?? 'Not specified',
                    'admin_name' => $community->creator->name,
                    'category' => $community->category ?? 'General',
                    'image' => $community->image_url ?? null,
                ];
            });

        return response()->json(['communities' => $communities]);
    }

    // GET /communities/{id}
    public function show(Request $request, $id)
    {
        $community = Community::with(['creator', 'members'])->findOrFail($id);
        $isMember = $community->members->contains($request->user()->id);

        return response()->json([
            'community' => [
                'id' => $community->id,
                'name' => $community->name,
                'description' => $community->description,
                'image' => $community->image_url,
                'member_count' => $community->members()->count(),
                'location' => $community->location ?? 'Not specified',
                'created_at' => $community->created_at->format('Y-m-d'),
                'admin' => [
                    'name' => $community->creator->name,
                    'role' => 'Community Manager',
                    'avatar' => $community->creator->profile_image_url,
                ],
                'category' => $community->category ?? 'General',
                'rules' => $community->rules ?? [],
            ],
            'is_member' => $isMember
        ]);
    }

    // GET /communities/{id}/members
    public function members($id)
    {
        $community = Community::findOrFail($id);
        
        $members = $community->members()
            ->get()
            ->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'role' => 'Member',
                    'avatar' => $member->profile_image_url,
                    'joined' => $member->pivot->created_at->format('Y-m-d'),
                ];
            });

        return response()->json(['members' => $members]);
    }

    // GET /communities/{id}/posts
    public function posts($id)
    {
        // Return empty for now, implement later
        return response()->json(['posts' => []]);
    }

    // POST /communities/{id}/join
    public function join(Request $request, $id)
    {
        $community = Community::findOrFail($id);
        $community->members()->syncWithoutDetaching([$request->user()->id]);

        return response()->json(['message' => 'Joined successfully']);
    }

    // POST /communities/{id}/leave
    public function leave(Request $request, $id)
    {
        $community = Community::findOrFail($id);
        $community->members()->detach($request->user()->id);

        return response()->json(['message' => 'Left successfully']);
    }
}