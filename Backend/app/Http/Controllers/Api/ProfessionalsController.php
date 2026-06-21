<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Service;
use App\Models\Appointment;
use App\Models\Review;
use App\Models\ProfessionalProfile;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ProfessionalsController extends Controller
{
    /**
     * Public list of professionals - FIXED to include available status and price
     */
    public function publicList(Request $request)
    {
        try {
            $query = User::where('user_type', 'professional')
                ->with(['professionalProfile', 'services']);

            if ($request->search) {
    $search = $request->search;
    $query->where(function ($q) use ($search) {
        $q->where('name', 'LIKE', "%{$search}%")
          ->orWhere('city', 'LIKE', "%{$search}%")
          ->orWhereHas('professionalProfile', function ($subQ) use ($search) {
              $subQ->where('specialization', 'LIKE', "%{$search}%")
                   ->orWhere('bio', 'LIKE', "%{$search}%")
                   ->orWhere('qualifications', 'LIKE', "%{$search}%");
          })
          ->orWhereHas('services', function ($subQ) use ($search) {
              $subQ->where('name', 'LIKE', "%{$search}%")
                   ->orWhere('category', 'LIKE', "%{$search}%")
                   ->orWhere('description', 'LIKE', "%{$search}%");
          });
    });
}

            if ($request->city) {
                $query->where('city', $request->city);
            }

            if ($request->profession) {
    $profession = $request->profession;
    $query->where(function ($q) use ($profession) {
        $q->whereHas('professionalProfile', function ($subQ) use ($profession) {
            $subQ->where('specialization', 'LIKE', "%{$profession}%")
                 ->orWhere('bio', 'LIKE', "%{$profession}%");
        })->orWhereHas('services', function ($subQ) use ($profession) {
            $subQ->where('name', 'LIKE', "%{$profession}%")
                 ->orWhere('category', 'LIKE', "%{$profession}%");
        });
    });
}

            $professionals = $query->get();
               
            // Bulk fetch ratings BEFORE the loop
                $professionalIds = $professionals->pluck('id');

                $ratings = Review::whereIn('professional_id', $professionalIds)
                    ->selectRaw('professional_id, AVG(rating) as avg_rating, COUNT(*) as total')
                    ->groupBy('professional_id')
                    ->get()->keyBy('professional_id');

                $mapped = $professionals->map(function ($pro) use ($ratings) {
                    $r = $ratings->get($pro->id);

                    $price = '₹500';
                    if ($pro->professionalProfile && $pro->professionalProfile->hourly_rate) {
                        $price = '₹' . number_format($pro->professionalProfile->hourly_rate, 0);
                    } elseif ($pro->services->isNotEmpty()) {
                        $price = '₹' . number_format($pro->services->first()->price, 0);
                    }
                
                    return [
                            'id'            => $pro->id,
                            'name'          => $pro->name,
                            'profession'    => $pro->professionalProfile->specialization ?? 'Professional',
                            'rating'        => $r ? round($r->avg_rating, 1) : null,
                            'total_reviews' => $r ? (int) $r->total : 0,
                            'experience'    => ($pro->professionalProfile->experience_years ?? 0) . ' years',
                            'location'      => $pro->city ?? 'Location',
                            'verified'      => $pro->professionalProfile->is_verified ?? false,
                            'available'     => $pro->services->where('is_active', true)->isNotEmpty(),
                            'price'         => $price,
                            'image'         => $pro->profile_image ?? 'https://ui-avatars.com/api/?name=' . urlencode($pro->name) . '&size=150&background=6366f1&color=fff',
                            'services'      => $pro->services->pluck('name')->toArray(),
                        ];
            });

            return response()->json([
                'professionals' => $mapped
            ]);

        } catch (\Exception $e) {
            Log::error('Public list error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'professionals' => []
            ], 500);
        }
    }

    /**
     * Public show professional - FIXED to include all necessary fields
     */
    public function publicShow($id)
    {
        try {
            $professional = User::where('id', $id)
                ->where('user_type', 'professional')
                ->with(['professionalProfile', 'services'])
                ->firstOrFail();
            $reviewStats = Review::where('professional_id', $id)
                    ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as total')
                    ->first();

            $avgRating    = $reviewStats->avg_rating;
            $totalReviews = (int) $reviewStats->total;
            $totalBookings = Appointment::where('professional_id', $id)->count();

            // Get price
            $price = '₹500/hr';
            if ($professional->professionalProfile && $professional->professionalProfile->hourly_rate) {
                $price = '₹' . number_format($professional->professionalProfile->hourly_rate, 0) . '/hr';
            }

            return response()->json([
                'professional' => [
                    'id' => $professional->id,
                    'name' => $professional->name,
                    'profession' => $professional->professionalProfile->specialization ?? 'Professional',
                    'bio' => $professional->professionalProfile->bio ?? 'Professional service provider',
                    'rating' => $avgRating ? round($avgRating, 1) : null,
                    'total_reviews' => $totalReviews,
                    'total_bookings' => $totalBookings,
                    'experience' => ($professional->professionalProfile->experience_years ?? 0) . ' years',
                    'location' => $professional->city ?? 'Location',
                    'phone' => $professional->phone ?? 'N/A',
                    'email' => $professional->email,
                    'verified' => $professional->professionalProfile->is_verified ?? false,
                    'available' => $professional->services->where('is_active', true)->isNotEmpty(), 
                    'response_time' => $this->calculateResponseTime($professional->id),
                    'price' => $price,
                    'image' => $professional->profile_image ?? 'https://ui-avatars.com/api/?name=' . urlencode($professional->name) . '&size=150&background=6366f1&color=fff',
                    'services' => $professional->services->map(function ($service) {
                        return [
                            'id' => $service->id,
                            'name' => $service->name,
                            'description' => $service->description,
                            'price' => $service->price,
                            'duration' => $service->duration . ' mins',
                        ];
                    }),
                    'certifications' => $professional->professionalProfile->is_verified ?? false
    ? ['Verified Professional']
    : [],
                    'portfolio' => [],
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Public show error', [
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Professional not found'
            ], 404);
        }
    }
   
private function calculateResponseTime($professionalId)
{
    $result = Appointment::where('professional_id', $professionalId)
    ->where('status', '!=', 'pending')
    ->selectRaw('AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 60) as avg_minutes, COUNT(*) as total')
    ->first();

    if (!$result || $result->total == 0) {
        return 'No response history yet';
    }

    $avgMinutes = (float) $result->avg_minutes;

    if ($avgMinutes < 60) {
        return 'Usually within ' . max(round($avgMinutes), 1) . ' min';
    }

    $hours = round($avgMinutes / 60);
    return 'Usually within ' . $hours . ' hr' . ($hours > 1 ? 's' : '');
}
    
    
    /**
     * Get professional profile with REAL stats - NO DUMMY DATA
     */
    public function getProfile(Request $request)
    {
        try {
            $user = $request->user();
            
            // Load professional profile
            $user->load('professionalProfile', 'services');
            
           $appointmentStats = Appointment::where('professional_id', $user->id)
    ->selectRaw('
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = \'completed\' THEN 1 END) as completed_bookings,
        SUM(CASE WHEN status = \'completed\' THEN total_price ELSE 0 END) as total_earnings
    ')
    ->first();

    $totalBookings = $appointmentStats->total_bookings;
    $completedBookings = $appointmentStats->completed_bookings;
    $totalEarnings = $appointmentStats->total_earnings ?? 0;

    $reviewStats = Review::where('professional_id', $user->id)
        ->selectRaw('AVG(rating) as average_rating, COUNT(*) as total_reviews')
        ->first();

    $averageRating = $reviewStats->average_rating;
    $totalReviews = $reviewStats->total_reviews;
            
            $profileComplete = $user->isProfessionalProfileComplete();
            
            return response()->json([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'city' => $user->city,
                'address' => $user->address,
                'bio' => $user->professionalProfile->bio ?? '',
                'profile_image' => $user->profile_image,
                'specialization' => $user->professionalProfile->specialization ?? '',
                'experience_years' => $user->professionalProfile->experience_years ?? 0,
                'qualifications' => $user->professionalProfile->qualifications ?? '',
                'hourly_rate' => $user->professionalProfile->hourly_rate ?? 0,
                'consultation_fee' => $user->professionalProfile->consultation_fee ?? 0,
                'services_offered' => $user->professionalProfile->services_offered ?? [],
                'availability' => $user->professionalProfile->availability ?? [],
                'is_verified' => $user->professionalProfile->is_verified ?? false,
                
                // REAL STATS - NO DUMMY DATA
                'total_bookings' => $totalBookings,
                'completed_bookings' => $completedBookings,
                'average_rating' => $averageRating ? round($averageRating, 1) : null,
                'total_reviews' => $totalReviews,
                'total_earnings' => $totalEarnings,
                'profile_complete' => $profileComplete,
            ]);
        } catch (\Exception $e) {
            Log::error('Get profile error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to load profile'
            ], 500);
        }
    }

    /**
     * Update professional profile
     */
    public function updateProfile(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:20',
                'city' => 'nullable|string|max:100',
                'address' => 'nullable|string|max:500',
                'bio' => 'nullable|string|max:1000',
                'specialization' => 'nullable|string|max:255',
                'experience_years' => 'nullable|integer|min:0',
                'qualifications' => 'nullable|string',
                'hourly_rate' => 'nullable|numeric|min:0',
                'consultation_fee' => 'nullable|numeric|min:0',
                'services_offered' => 'nullable|array',
                'availability' => 'nullable|array',
            ]);

            $user = $request->user();

            // Update user fields
            $user->update($request->only(['name', 'phone', 'city', 'address', 'bio']));

            // Update or create professional profile
            $profileData = $request->only([
                'bio',
                'specialization',
                'experience_years',
                'qualifications',
                'hourly_rate',
                'consultation_fee',
                'services_offered',
                'availability'
            ]);

            ProfessionalProfile::updateOrCreate(
                ['user_id' => $user->id],
                $profileData
            );

            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $user->fresh()->load('professionalProfile')
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Update profile error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to update profile'
            ], 500);
        }
    }

    /**
     * List services with REAL ratings - NO DUMMY DATA
     */
    public function listService(Request $request)
    {
        try {
             $serviceIds = Service::where('professional_id', $request->user()->id)
                ->pluck('id');

            // One query for all ratings
            $serviceRatings = Review::whereHas('appointment', function ($q) use ($serviceIds) {
                    $q->whereIn('service_id', $serviceIds);
                })
                ->join('appointments', 'reviews.appointment_id', '=', 'appointments.id')
                ->selectRaw('appointments.service_id, AVG(reviews.rating) as avg_rating')
                ->groupBy('appointments.service_id')
                ->get()->keyBy('service_id');

            // One query for all booking counts
            $bookingCounts = Appointment::whereIn('service_id', $serviceIds)
                ->selectRaw('service_id, COUNT(*) as total')
                ->groupBy('service_id')
                ->get()->keyBy('service_id');

            $services = Service::whereIn('id', $serviceIds)->get()->map(function ($service) use ($serviceRatings, $bookingCounts) {
                $r = $serviceRatings->get($service->id);
                $b = $bookingCounts->get($service->id);
                return [
                    'id'             => $service->id,
                    'name'           => $service->name,
                    'description'    => $service->description,
                    'price'          => $service->price,
                    'duration'       => $service->duration . ' mins',
                    'category'       => $service->category,
                    'is_active'      => $service->is_active,
                    'bookings_count' => $b ? (int) $b->total : 0,
                    'rating'         => $r ? round($r->avg_rating, 1) : null,
                ];
            });

            return response()->json([
                'success' => true,
                'services' => $services
            ]);
        } catch (\Exception $e) {
            Log::error('List services error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to load services',
                'services' => []
            ], 500);
        }
    }

    /**
     * Add service with profile completion check
     */
    public function addService(Request $request)
    {
        try {
            $user = $request->user();
            $user->load('professionalProfile');
            
            if (!$user->isProfessionalProfileComplete()) {
            
                return response()->json([
                    'message' => 'Please complete your profile before adding services. Fill in all required fields: name, phone, city, specialization, experience, hourly rate, and bio.',
                    'profile_incomplete' => true
                ], 400);
            }
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'duration' => 'nullable|integer|min:1',
                'category' => 'nullable|string',
            ]);

            $service = Service::create([
                'professional_id' => $user->id,
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'price' => $validated['price'],
                'duration' => $validated['duration'] ?? 60,
                'category' => $validated['category'] ?? null,
                'is_active' => true
            ]);

            return response()->json([
                'message' => 'Service added successfully',
                'service' => $service
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Add service error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to add service'
            ], 500);
        }
    }

    /**
     * Get single service
     */
    public function getService(Request $request, $id)
    {
        try {
            $service = Service::where('id', $id)
                ->where('professional_id', $request->user()->id)
                ->firstOrFail();

            return response()->json($service);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Service not found'
            ], 404);
        }
    }

    /**
     * Update service
     */
    public function updateService(Request $request, $id)
    {
        try {
            $service = Service::where('id', $id)
                ->where('professional_id', $request->user()->id)
                ->firstOrFail();

            $validated = $request->validate([
                'name' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'price' => 'nullable|numeric|min:0',
                'duration' => 'nullable|integer|min:1',
                'category' => 'nullable|string',
                'is_active' => 'nullable|boolean',
            ]);

            $service->update($validated);

            return response()->json([
                'message' => 'Service updated successfully',
                'service' => $service
            ]);

        } catch (\Exception $e) {
            Log::error('Update service error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to update service'
            ], 500);
        }
    }

    /**
     * Delete service
     */
    public function deleteService(Request $request, $id)
    {
        try {
            $service = Service::where('id', $id)
                ->where('professional_id', $request->user()->id)
                ->firstOrFail();

            // Check if service has active appointments
            $activeAppointments = Appointment::where('service_id', $id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->count();

            if ($activeAppointments > 0) {
                return response()->json([
                    'message' => 'Cannot delete service with active appointments'
                ], 400);
            }

            $service->delete();

            return response()->json([
                'message' => 'Service deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Delete service error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to delete service'
            ], 500);
        }
    }

    /**
     * Get appointments for professional
     */
    public function getAppointment(Request $request)
    {
        try {
            $appointments = Appointment::where('professional_id', $request->user()->id)
                ->with(['user', 'service'])
                ->orderBy('appointment_time', 'desc')
                ->get()
                ->map(function ($appointment) {
                    return [
                        'id' => $appointment->id,
                        'client_name' => $appointment->user->name ?? 'Client',
                        'service_name' => $appointment->service->name ?? 'Service',
                        'appointment_time' => $appointment->appointment_time,
                        'date' => $appointment->appointment_time->format('M d, Y'),
                        'time' => $appointment->appointment_time->format('h:i A'),
                        'location' => $appointment->user->city ?? 'Location',
                        'price' => $appointment->total_price,
                        'status' => $appointment->status,
                        'notes' => $appointment->notes,
                    ];
                });

            return response()->json($appointments);

        } catch (\Exception $e) {
            Log::error('Get appointments error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to load appointments',
                'data' => []
            ], 500);
        }
    }

    /**
     * Update appointment status
     */
    public function updateAppointment(Request $request, $id)
    {
        try {
            $appointment = Appointment::where('id', $id)
                ->where('professional_id', $request->user()->id)
                ->firstOrFail();

            $validated = $request->validate([
                'status' => 'required|in:confirmed,cancelled,completed'
            ]);

            $appointment->status = $validated['status'];
            $appointment->save();
            match ($validated['status']) {
            'confirmed'  => NotificationService::bookingConfirmed($appointment),
            'cancelled'  => NotificationService::bookingCancelled($appointment, 'professional'),
            'completed'  => NotificationService::bookingCompleted($appointment),
            default      => null,
        };

            return response()->json([
                'message' => 'Appointment updated successfully',
                'appointment' => $appointment
            ]);

        } catch (\Exception $e) {
            Log::error('Update appointment error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to update appointment'
            ], 500);
        }
    }

    /**
     * Get dashboard data with REAL stats
     */
    public function getDashboard(Request $request)
    {
        try {
            $user = $request->user();
            
            $appointmentStats = Appointment::where('professional_id', $user->id)
        ->selectRaw('
            COUNT(*) as total_appointments,
            COUNT(CASE WHEN status = \'pending\' THEN 1 END) as pending_appointments,
            SUM(CASE WHEN status = \'completed\' THEN total_price ELSE 0 END) as total_earnings,
            SUM(CASE WHEN status = \'confirmed\' THEN total_price ELSE 0 END) as pending_earnings
        ')
        ->first();

        $totalAppointments = $appointmentStats->total_appointments;
        $pendingAppointments = $appointmentStats->pending_appointments;
        $totalEarnings = $appointmentStats->total_earnings ?? 0;
        $availableEarnings = $totalEarnings;
        $pendingEarnings = $appointmentStats->pending_earnings ?? 0;

        $activeServices = Service::where('professional_id', $user->id)
            ->where('is_active', true)->count();

        $reviewStats = Review::where('professional_id', $user->id)
            ->selectRaw('AVG(rating) as average_rating, COUNT(*) as total_reviews')
            ->first();

        $averageRating = $reviewStats->average_rating;
        $totalReviews = $reviewStats->total_reviews;
            
            // Upcoming appointments
            $upcomingAppointments = Appointment::where('professional_id', $user->id)
                ->where('appointment_time', '>', now())
                ->whereIn('status', ['pending', 'confirmed'])
                ->with(['user', 'service'])
                ->orderBy('appointment_time', 'asc')
                ->limit(5)
                ->get()
                ->map(function ($apt) {
                    return [
                        'id' => $apt->id,
                        'client_name' => $apt->user->name ?? 'Client',
                        'service_name' => $apt->service->name ?? 'Service',
                        'appointment_time' => $apt->appointment_time,
                        'total_price' => $apt->total_price,
                        'status' => $apt->status,
                        'location' => $apt->user->city ?? 'Location',
                    ];
                });
            
            // Recent reviews
            $recentReviews = Review::where('professional_id', $user->id)
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->limit(3)
                ->get()
                ->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'client' => $review->user->name ?? 'Anonymous',
                        'rating' => $review->rating,
                        'comment' => $review->comment,
                        'time' => $review->created_at->diffForHumans(),
                    ];
                });

            return response()->json([
                'stats' => [
                    'total_appointments' => $totalAppointments,
                    'pending_appointments' => $pendingAppointments,
                    'active_services' => $activeServices,
                ],
                'earnings' => [
                    'total' => $totalEarnings,
                    'available' => $availableEarnings,
                    'pending' => $pendingEarnings,
                ],
                'rating' => [
                    'average' => $averageRating ? round($averageRating, 1) : null,
                    'total' => $totalReviews,
                ],
                'appointments' => [
                    'upcoming' => $upcomingAppointments->count(),
                    'data' => $upcomingAppointments,
                ],
                'reviews' => $recentReviews,
            ]);

        } catch (\Exception $e) {
            Log::error('Get dashboard error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to load dashboard'
            ], 500);
        }
    }

    /**
     * Get earnings data
     */
    public function getEarnings(Request $request)
    {
        try {
            $user = $request->user();
            
            $totalEarnings = Appointment::where('professional_id', $user->id)
                ->where('status', 'completed')
                ->sum('total_price');
            
            $thisMonthEarnings = Appointment::where('professional_id', $user->id)
                ->where('status', 'completed')
                ->whereMonth('appointment_time', now()->month)
                ->whereYear('appointment_time', now()->year)
                ->sum('total_price');
            
            $lastMonthEarnings = Appointment::where('professional_id', $user->id)
                ->where('status', 'completed')
                ->whereMonth('appointment_time', now()->subMonth()->month)
                ->whereYear('appointment_time', now()->subMonth()->year)
                ->sum('total_price');

            return response()->json([
                'total' => $totalEarnings,
                'this_month' => $thisMonthEarnings,
                'last_month' => $lastMonthEarnings,
            ]);

        } catch (\Exception $e) {
            Log::error('Get earnings error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to load earnings'
            ], 500);
        }
    }

    /**
     * Get reviews for professional
     */
    public function getReviews(Request $request)
    {
        try {
            $user = $request->user();
            
            $reviews = Review::where('professional_id', $user->id)
                ->where('review_type', 'professional')
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'user' => [
                            'name' => $review->user->name ?? 'Anonymous',
                            'avatar' => $review->user->profile_image ?? null,
                        ],
                        'rating' => $review->rating,
                        'comment' => $review->comment,
                        'professional_response' => $review->professional_response,
                        'created_at' => $review->created_at->format('M d, Y'),
                    ];
                });
            
            $breakdown = Review::where('professional_id', $user->id)
                ->selectRaw('rating, COUNT(*) as count')
                ->groupBy('rating')
                ->pluck('count', 'rating');

            $totalReviews = $breakdown->sum();
            $averageRating = $totalReviews > 0
                ? $breakdown->reduce(fn($carry, $count, $rating) => $carry + ($rating * $count), 0) / $totalReviews
                : null;

            $ratingBreakdown = [];
            for ($i = 1; $i <= 5; $i++) {
                $ratingBreakdown[$i] = $breakdown->get($i, 0);
            }

            return response()->json([
                'reviews' => $reviews,
                'stats' => [
                    'average_rating' => $averageRating ? round($averageRating, 1) : null,
                    'total_reviews' => $totalReviews,
                    'rating_breakdown' => $ratingBreakdown,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Get reviews error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to load reviews',
                'reviews' => [],
                'stats' => null,
            ], 500);
        }
    }

    /**
 * Toggle service active/inactive status
 */
public function toggleServiceStatus(Request $request, $id)
{
    try {
        $service = Service::where('id', $id)
            ->where('professional_id', $request->user()->id)
            ->firstOrFail();

        $service->is_active = !$service->is_active;
        $service->save();

        return response()->json([
            'message' => 'Service status updated successfully',
            'service' => $service
        ]);

    } catch (\Exception $e) {
        Log::error('Toggle service status error', [
            'error' => $e->getMessage()
        ]);

        return response()->json([
            'message' => 'Failed to update service status'
        ], 500);
    }
}

}