<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\Services\NotificationService;

class SearchController extends Controller
{
    /**
     * GET /residents/search?name=John&city=Kolkata
     */
    public function searchResidents(Request $request)
    {
        try {
            $query = User::where('user_type', 'resident');

            if ($request->user()) {
                $query->where('id', '!=', $request->user()->id);
            }

            if ($request->filled('name')) {
                $query->where('name', 'LIKE', '%' . $request->name . '%');
            }

            if ($request->filled('city')) {
                $query->where('city', 'LIKE', '%' . $request->city . '%');
            }

            $residents = $query
                ->select('id', 'name', 'city', 'profile_image', 'created_at')
                ->latest()
                ->limit(30)
                ->get()
                ->map(function ($resident) use ($request) {
                    $communitiesCount  = $resident->communities()->count();
                    $mutualCommunities = 0;

                    if ($request->user()) {
                        $myIds    = $request->user()->communities()->pluck('communities.id')->toArray();
                        $theirIds = $resident->communities()->pluck('communities.id')->toArray();
                        $mutualCommunities = count(array_intersect($myIds, $theirIds));
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
                        'is_online'          => false,
                        'member_since'       => $resident->created_at->format('M Y'),
                    ];
                });

            return response()->json([
                'residents' => $residents,
                'total'     => $residents->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Search residents error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to search residents', 'residents' => []], 500);
        }
    }

    /**
     * GET /search/users?q=John
     * FIX: now searches ALL user types (resident, professional, business)
     * Used by MessagingCenter "New Message" modal
     */
    public function searchUsers(Request $request)
    {
        try {
            $q = trim($request->input('q', $request->input('search', '')));

            if (empty($q)) {
                return response()->json(['users' => []]);
            }

            $query = User::whereIn('user_type', ['resident', 'professional', 'business'])
                ->where('name', 'LIKE', '%' . $q . '%');

            // Exclude self
            if ($request->user()) {
                $query->where('id', '!=', $request->user()->id);
            }

            $users = $query
                ->with('professionalProfile', 'enterprise')
                ->select('id', 'name', 'user_type', 'city', 'profile_image')
                ->limit(25)
                ->get()
                ->map(function ($user) {
                    $subtitle = match ($user->user_type) {
                        'professional' => $user->professionalProfile->specialization ?? 'Professional',
                        'business'     => $user->enterprise->company_name ?? 'Business',
                        default        => 'Resident',
                    };

                    return [
                        'id'         => $user->id,
                        'name'       => $user->name,
                        'role'       => ucfirst($user->user_type),
                        'profession' => $subtitle,
                        'city'       => $user->city,
                        'image'      => $user->profile_image
                            ?? 'https://ui-avatars.com/api/?name=' . urlencode($user->name) . '&size=40&background=6366f1&color=fff',
                    ];
                });

            return response()->json(['users' => $users]);
        } catch (\Exception $e) {
            Log::error('Search users error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to search users', 'users' => []], 500);
        }
    }

    /**
     * GET /search/professionals?search=John&profession=plumber&city=Mumbai
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

            // Exclude self if logged-in user is also a professional
            if ($request->user()) {
                $query->where('id', '!=', $request->user()->id);
            }

            $professionals = $query->limit(20)->get()->map(function ($pro) {
                $avgRating    = \App\Models\Review::where('professional_id', $pro->id)->avg('rating');
                $reviewsCount = \App\Models\Review::where('professional_id', $pro->id)->count();

                return [
                    'id'            => $pro->id,
                    'name'          => $pro->name,
                    'profession'    => $pro->professionalProfile->specialization ?? 'Professional',
                    'rating'        => $avgRating ? round($avgRating, 1) : null,
                    'reviews_count' => $reviewsCount,
                    'price'         => $pro->professionalProfile
                        ? '₹' . number_format($pro->professionalProfile->hourly_rate ?? 500, 0)
                        : '₹500',
                    'experience'    => ($pro->professionalProfile->experience_years ?? 0) . ' years',
                    'location'      => $pro->city ?? 'Location',
                    'verified'      => $pro->professionalProfile->is_verified ?? false,
                    'available'     => true,
                    'image'         => $pro->profile_image
                        ?? 'https://ui-avatars.com/api/?name=' . urlencode($pro->name) . '&size=56&background=6366f1&color=fff',
                    'services'      => $pro->services->pluck('name')->toArray(),
                    'role'          => $pro->professionalProfile->specialization ?? 'Professional',
                ];
            });

            return response()->json(['professionals' => $professionals]);
        } catch (\Exception $e) {
            Log::error('Search professionals error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to search professionals', 'professionals' => []], 500);
        }
    }

    /**
     * POST /communities/{id}/invite
     */
    public function inviteToCommunity(Request $request, $communityId)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|integer|exists:users,id',
            ]);

            $community = \App\Models\Community::findOrFail($communityId);

            $isMember = $community->members()
                ->where('user_id', $request->user()->id)
                ->exists();

            if (!$isMember) {
                return response()->json(['message' => 'You must be a member to invite others'], 403);
            }

            $alreadyMember = $community->members()
                ->where('user_id', $validated['user_id'])
                ->exists();

            if ($alreadyMember) {
                return response()->json(['message' => 'User is already a member of this community'], 400);
            }

            $community->members()->attach($validated['user_id'], [
                'role'   => 'member',
                'status' => 'active',
            ]);

                        // Send notification to invited user
            NotificationService::communityInvite(
                $validated['user_id'],
                $community,
                $request->user()
            );
            
            $community->increment('member_count');

            return response()->json(['message' => 'Invitation sent successfully']);
        } catch (\Exception $e) {
            Log::error('Invite to community error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to send invitation'], 500);
        }
    }
}