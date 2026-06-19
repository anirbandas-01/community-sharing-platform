<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;

class SearchController extends Controller
{
    /**
     * GET /residents/search?name=John&city=Kolkata
     * Search residents by name and/or city
     * Used by FindResidents.jsx
     */
    public function searchResidents(Request $request)
    {
        try {
            $query = User::where('user_type', 'resident');

            // Filter out the currently logged-in user
            if ($request->user()) {
                $query->where('id', '!=', $request->user()->id);
            }

            // Search by name
            if ($request->filled('name')) {
                $query->where('name', 'LIKE', '%' . $request->name . '%');
            }

            // Filter by city
            if ($request->filled('city')) {
                $query->where('city', 'LIKE', '%' . $request->city . '%');
            }

            $residents = $query
                ->select('id', 'name', 'city', 'profile_image', 'created_at')
                ->latest()
                ->limit(30)
                ->get()
                ->map(function ($resident) use ($request) {
                    // Count communities this resident is in
                    $communitiesCount = $resident->communities()->count();

                    // Count mutual communities (communities both share)
                    $mutualCommunities = 0;
                    if ($request->user()) {
                        $myCommIds      = $request->user()->communities()->pluck('communities.id')->toArray();
                        $theirCommIds   = $resident->communities()->pluck('communities.id')->toArray();
                        $mutualCommunities = count(array_intersect($myCommIds, $theirCommIds));
                    }

                    return [
                        'id'                 => $resident->id,
                        'name'               => $resident->name,
                        'city'               => $resident->city,
                        'bio'                => $resident->bio ?? null,
                        'image'              => $resident->profile_image
                            ?? 'https://ui-avatars.com/api/?name=' . urlencode($resident->name) . '&size=56&background=6366f1&color=fff',
                        'communities_count'  => $communitiesCount,
                        'mutual_communities' => $mutualCommunities,
                        'is_online'          => false, // extend later with presence system
                        'member_since'       => $resident->created_at->format('M Y'),
                    ];
                });

            return response()->json([
                'residents' => $residents,
                'total'     => $residents->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Search residents error: ' . $e->getMessage());
            return response()->json([
                'message'   => 'Failed to search residents',
                'residents' => [],
            ], 500);
        }
    }

    /**
     * GET /search/users?q=John
     * Search ALL users (residents + professionals) by name
     * Used by MessagingCenter "New Message" modal — falls back from /search/professionals
     */
    public function searchUsers(Request $request)
    {
        try {
            $q = $request->input('q', $request->input('search', ''));

            if (empty(trim($q))) {
                return response()->json(['users' => []]);
            }

            $query = User::whereIn('user_type', ['resident', 'professional'])
                ->where('name', 'LIKE', '%' . $q . '%');

            // Exclude self
            if ($request->user()) {
                $query->where('id', '!=', $request->user()->id);
            }

            $users = $query
                ->select('id', 'name', 'user_type', 'city', 'profile_image')
                ->limit(20)
                ->get()
                ->map(function ($user) {
                    return [
                        'id'         => $user->id,
                        'name'       => $user->name,
                        'role'       => ucfirst($user->user_type),
                        'profession' => $user->user_type === 'professional'
                            ? ($user->professionalProfile->specialization ?? 'Professional')
                            : 'Resident',
                        'city'       => $user->city,
                        'image'      => $user->profile_image
                            ?? 'https://ui-avatars.com/api/?name=' . urlencode($user->name) . '&size=40&background=6366f1&color=fff',
                    ];
                });

            return response()->json(['users' => $users]);
        } catch (\Exception $e) {
            Log::error('Search users error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to search users',
                'users'   => [],
            ], 500);
        }
    }

    /**
     * GET /search/professionals?search=John&profession=plumber&city=Mumbai
     * Search professionals only (already used by frontend fallback + ResidentController)
     * Kept here so all search logic lives in one place
     */
    public function searchProfessionals(Request $request)
    {
        try {
            $query = User::where('user_type', 'professional')
                ->with(['professionalProfile', 'services']);

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhereHas('professionalProfile', function ($sub) use ($search) {
                          $sub->where('specialization', 'LIKE', "%{$search}%");
                      });
                });
            }

            if ($request->filled('profession')) {
                $query->whereHas('professionalProfile', function ($q) use ($request) {
                    $q->where('specialization', 'LIKE', "%{$request->profession}%");
                });
            }

            if ($request->filled('city')) {
                $query->where('city', $request->city);
            }

            $professionals = $query->limit(20)->get()->map(function ($pro) {
                $avgRating    = \App\Models\Review::where('professional_id', $pro->id)->avg('rating');
                $reviewsCount = \App\Models\Review::where('professional_id', $pro->id)->count();

                return [
                    'id'           => $pro->id,
                    'name'         => $pro->name,
                    'profession'   => $pro->professionalProfile->specialization ?? 'Professional',
                    'rating'       => $avgRating ? round($avgRating, 1) : null,
                    'reviews_count'=> $reviewsCount,
                    'price'        => $pro->professionalProfile
                        ? '₹' . number_format($pro->professionalProfile->hourly_rate ?? 500, 0)
                        : '₹500',
                    'experience'   => ($pro->professionalProfile->experience_years ?? 0) . ' years',
                    'location'     => $pro->city ?? 'Location',
                    'verified'     => $pro->professionalProfile->is_verified ?? false,
                    'available'    => true,
                    'image'        => $pro->profile_image
                        ?? 'https://ui-avatars.com/api/?name=' . urlencode($pro->name) . '&size=56&background=6366f1&color=fff',
                    'services'     => $pro->services->pluck('name')->toArray(),
                    // also expose as 'role' so the messaging modal can display it
                    'role'         => $pro->professionalProfile->specialization ?? 'Professional',
                ];
            });

            return response()->json(['professionals' => $professionals]);
        } catch (\Exception $e) {
            Log::error('Search professionals error: ' . $e->getMessage());
            return response()->json([
                'message'       => 'Failed to search professionals',
                'professionals' => [],
            ], 500);
        }
    }

    /**
     * POST /communities/{id}/invite
     * Invite a user to a community
     * Used by FindResidents invite modal
     */
    public function inviteToCommunity(Request $request, $communityId)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|integer|exists:users,id',
            ]);

            $community = \App\Models\Community::findOrFail($communityId);

            // Only community admins/moderators can invite
            $isMod = $community->members()
                ->where('user_id', $request->user()->id)
                ->whereIn('community_members.role', ['admin', 'moderator'])
                ->exists();

            // Allow any member to invite for now (change to $isMod check if you want strict access)
            $isMember = $community->members()
                ->where('user_id', $request->user()->id)
                ->exists();

            if (!$isMember) {
                return response()->json(['message' => 'You must be a member to invite others'], 403);
            }

            // Check if already a member
            $alreadyMember = $community->members()
                ->where('user_id', $validated['user_id'])
                ->exists();

            if ($alreadyMember) {
                return response()->json(['message' => 'User is already a member of this community'], 400);
            }

            // For now: directly add them as member (no separate invite table needed)
            // If you want a proper invitation flow with accept/reject, add an invitations table later
            $community->members()->attach($validated['user_id'], [
                'role'   => 'member',
                'status' => 'active',
            ]);

            NotificationService::communityInvite(
                $validated['user_id'],
                $community,
                $request->user()
            );

            $community->increment('member_count');
            
            NotificationService::communityInvite(
                $validated['user_id'],
                $community,
                $request->user()
            );

            return response()->json([
                'message' => 'Invitation sent and user added to community successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Invite to community error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to send invitation',
            ], 500);
        }
    }
}