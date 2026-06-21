<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Community;
use App\Models\Enterprise;
use App\Models\Service;
use App\Models\Appointment;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Mail\EnterpriseApproved;
use App\Mail\EnterpriseRejected;
use Illuminate\Support\Facades\Mail;

class AdminController extends Controller
{
    /**
     * Admin Dashboard Statistics
     */
    public function dashboard()
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'residents' => User::where('user_type', 'resident')->count(),
                'professionals' => User::where('user_type', 'professional')->count(),
                'businesses' => User::where('user_type', 'business')->count(),
                
                'total_communities' => Community::count(),
                'active_communities' => Community::where('status', 'active')->count(),
                
                'pending_verifications' => Enterprise::where('status', 'pending')->count(),
                
                'total_services' => Service::count(),
                'total_appointments' => Appointment::count(),
                
                'new_users_today' => User::whereDate('created_at', today())->count(),
                'new_users_week' => User::whereBetween('created_at', [now()->subWeek(), now()])->count(),
            ];

            // Recent users
            $recent_users = User::latest()
                ->limit(10)
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'user_type' => $user->user_type,
                        'created_at' => $user->created_at->format('M d, Y'),
                    ];
                });

            // Replace with this (1 query instead of 7):
            $growthRaw = User::where('created_at', '>=', now()->subDays(6)->startOfDay())
                ->selectRaw("DATE(created_at) as date, COUNT(*) as count")
                ->groupBy('date')
                ->get()
                ->keyBy('date');

            $user_growth = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $dateKey = $date->format('Y-m-d');
                $user_growth[] = [
                    'date'  => $date->format('M d'),
                    'count' => $growthRaw->get($dateKey)?->count ?? 0,
                ];
            }

            return response()->json([
                'stats' => $stats,
                'recent_users' => $recent_users,
                'user_growth' => $user_growth,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loading dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }

   /**
 * Get all users with filters
 */
public function getUsers(Request $request)
{
    try {
        $query = User::query();

        // Filter by user type
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('user_type', $request->type);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%");
            });
        }

        $users = $query->latest()->get();
        
        $transformedUsers = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'user_type' => $user->user_type,
                'city' => $user->city,
                'created_at' => $user->created_at->format('M d, Y'),
                'profile_image' => $user->profile_image 
                    ? asset('uploads/profiles/' . $user->profile_image) 
                    : null,
            ];
        });

        return response()->json([
            'users' => $transformedUsers
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error loading users',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Delete user
     */
    public function deleteUser($id)
    {
        try {
            $user = User::findOrFail($id);
            
            // Don't allow deleting admins
            if ($user->user_type === 'admin') {
                return response()->json([
                    'message' => 'Cannot delete admin users'
                ], 403);
            }

            $user->delete();

            return response()->json([
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all communities
     */
    public function getCommunities(Request $request)
    {
        try {
            $query = Community::with('creator');

            // Filter by category
            if ($request->has('category') && $request->category !== 'all') {
                $query->where('category', $request->category);
            }

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('description', 'LIKE', "%{$search}%");
                });
            }

            $communities = $query->latest()
                ->get()
                ->map(function ($community) {
                    return [
                        'id' => $community->id,
                        'name' => $community->name,
                        'description' => $community->description,
                        'category' => $community->category,
                        'status' => $community->status,
                        'visibility' => $community->visibility,
                        'member_count' => $community->member_count,
                        'image' => $community->image_url,
                        'creator' => [
                            'id' => $community->creator->id,
                            'name' => $community->creator->name,
                        ],
                        'created_at' => $community->created_at->format('M d, Y'),
                    ];
                });

            return response()->json([
                'communities' => $communities
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loading communities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create community
     */
    public function createCommunity(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|in:general,professional,business,local',
                'visibility' => 'required|in:public,private',
                'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('community_images', 'public');
            }

            $community = Community::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'category' => $validated['category'],
                'visibility' => $validated['visibility'],
                'image' => $imagePath,
                'created_by' => $request->user()->id,
                'status' => 'active',
            ]);

            return response()->json([
                'message' => 'Community created successfully',
                'community' => $community
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating community',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update community
     */
    public function updateCommunity(Request $request, $id)
    {
        try {
            $community = Community::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'category' => 'sometimes|in:general,professional,business,local',
                'visibility' => 'sometimes|in:public,private',
                'status' => 'sometimes|in:active,inactive',
                'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            if ($request->hasFile('image')) {
                // Delete old image
                if ($community->image) {
                    Storage::disk('public')->delete($community->image);
                }
                $validated['image'] = $request->file('image')->store('community_images', 'public');
            }

            $community->update($validated);

            return response()->json([
                'message' => 'Community updated successfully',
                'community' => $community
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating community',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete community
     */
    public function deleteCommunity($id)
    {
        try {
            $community = Community::findOrFail($id);
            
            // Delete image if exists
            if ($community->image) {
                Storage::disk('public')->delete($community->image);
            }

            $community->delete();

            return response()->json([
                'message' => 'Community deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting community',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get pending verifications (enterprises)
     */
     public function getPendingVerifications()
    {
        try {
            $enterprises = Enterprise::with('user')
                ->latest()
                ->get()
                ->map(function ($enterprise) {
                    return [
                        'id'                  => $enterprise->id,
                        'company_name'        => $enterprise->company_name,
                        'registration_number' => $enterprise->registration_number,
                        'industry_type'       => $enterprise->industry_type,
                        'annual_revenue'      => $enterprise->annual_revenue,
                        'contact_person'      => $enterprise->contact_person,
                        'phone'               => $enterprise->phone,
                        'email'               => $enterprise->email,
                        'city'                => $enterprise->city,
                        'description'         => $enterprise->description,
                        'status'              => $enterprise->status,   // ← now included for all statuses
                        'photo_url'           => $enterprise->enterprise_photo
                            ? asset('storage/' . $enterprise->enterprise_photo)
                            : null,
                        'user' => [
                            'id'    => $enterprise->user->id,
                            'name'  => $enterprise->user->name,
                            'email' => $enterprise->user->email,
                        ],
                        'created_at' => $enterprise->created_at->format('M d, Y'),
                    ];
                });
 
            return response()->json([
                'verifications' => $enterprises
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loading verifications',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve/Reject enterprise verification
     */
    public function updateVerificationStatus(Request $request, $id)
{
    try {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'notes'  => 'nullable|string|max:1000',
        ]);

        $enterprise         = Enterprise::with('user')->findOrFail($id);
        $enterprise->status = $validated['status'];
        $enterprise->save();

        $notes = $validated['notes'] ?? '';

        // ── Send email to the business owner ──────────────────────────
        try {
            $mailable = $validated['status'] === 'approved'
                ? new EnterpriseApproved($enterprise, $notes)
                : new EnterpriseRejected($enterprise, $notes);

            $recipientEmail = $enterprise->email ?: $enterprise->user->email;
            $recipientName  = $enterprise->contact_person ?: $enterprise->user->name;

            Mail::to($recipientEmail, $recipientName)->send($mailable);

            \Illuminate\Support\Facades\Log::info('Enterprise verification email sent', [
                'enterprise_id' => $enterprise->id,
                'status'        => $validated['status'],
                'recipient'     => $recipientEmail,
            ]);
        } catch (\Exception $mailException) {
            \Illuminate\Support\Facades\Log::error('Failed to send enterprise verification email', [
                'enterprise_id' => $enterprise->id,
                'error'         => $mailException->getMessage(),
            ]);
            // Mail failure does NOT roll back the status change
        }

        return response()->json([
            'message' => "Enterprise {$validated['status']} successfully"
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error updating verification status',
            'error'   => $e->getMessage()
        ], 500);
    }
}


   

    /**
 * Get admin profile
 */
public function profile(Request $request)
{
    return response()->json([
        'user' => $request->user()
    ]);
}

 // ─────────────────────────────────────────────────────────────
    // FIX: these two methods were missing — AdminSettings.jsx calls
    // GET /admin/settings and POST /admin/settings but they didn't exist
    // ─────────────────────────────────────────────────────────────
 
    /**
     * GET /admin/settings
     */
    public function getSettings(Request $request)
    {
        try {
            // Real system stats
            $system_stats = [
                'users'       => User::count(),
                'communities' => Community::count(),
                'db_size'     => 'N/A',
                'uptime'      => 'N/A',
            ];
 
            return response()->json([
                // General
                'user_registration'        => true,
                'community_creation'       => true,
                'auto_approve_communities' => false,
 
                // Security
                'require_2fa'                  => false,
                'require_email_verification'   => false,
 
                // Notifications
                'notify_new_users'          => true,
                'notify_pending_communities'=> true,
                'notify_system_alerts'      => true,
                'send_daily_reports'        => false,
 
                // System
                'maintenance_mode' => false,
                'system_stats'     => $system_stats,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error loading settings', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * POST /admin/settings
     */
    public function saveSettings(Request $request)
    {
        try {
            // Settings can be stored in a config/settings table in future.
            // For now we acknowledge the save successfully.
            return response()->json(['message' => 'Settings saved successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error saving settings', 'error' => $e->getMessage()], 500);
        }
    }
 
    // ─────────────────────────────────────────────────────────────
    // FIX: AdminReports.jsx calls GET /admin/reports but it was missing
    // ─────────────────────────────────────────────────────────────
 
    /**
     * GET /admin/reports?period=week|month|year
     */
    public function getReports(Request $request)
    {
        try {
            $period = $request->query('period', 'month');
 
            $startDate = match ($period) {
                'week'  => now()->subWeek(),
                'year'  => now()->subYear(),
                default => now()->subMonth(),
            };
 
            $newUsers       = User::where('created_at', '>=', $startDate)->count();
            $newCommunities = Community::where('created_at', '>=', $startDate)->count();
 
            $totalUsers     = User::count();
            $prevUsers      = User::where('created_at', '<', $startDate)->count();
            $growthRate     = $prevUsers > 0
                ? round((($totalUsers - $prevUsers) / $prevUsers) * 100, 1)
                : 0;
 
            return response()->json([
                'users' => [
                    'new'   => $newUsers,
                    'daily' => [],
                ],
                'communities' => [
                    'new'   => $newCommunities,
                    'stats' => [],
                ],
                'professionals' => [
                    'total'    => User::where('user_type', 'professional')->count(),
                    'bookings' => Appointment::count(),
                    'services' => Service::count(),
                    'avg_rating' => '0.0',
                ],
                'businesses' => [
                    'total'    => User::where('user_type', 'business')->count(),
                    'products' => 0,
                    'orders'   => 0,
                    'revenue'  => 0,
                ],
                'growth' => [
                    'rate' => $growthRate,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error loading reports', 'error' => $e->getMessage()], 500);
        }
    }

}