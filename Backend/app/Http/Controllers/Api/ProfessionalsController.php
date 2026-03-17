<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Service;
use App\Models\Appointment;
use App\Models\Review;
use App\Models\ProfessionalProfile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ProfessionalsController extends Controller
{
    /**
     * Get professional profile with REAL stats - NO DUMMY DATA
     */
    public function getProfile(Request $request)
    {
        try {
            $user = $request->user();
            
            // Load professional profile
            $user->load('professionalProfile', 'services');
            
            // Calculate REAL stats
            $totalBookings = Appointment::where('professional_id', $user->id)->count();
            $completedBookings = Appointment::where('professional_id', $user->id)
                ->where('status', 'completed')
                ->count();
            
            // Get average rating from reviews
            $averageRating = Review::where('professional_id', $user->id)->avg('rating');
            $totalReviews = Review::where('professional_id', $user->id)->count();
            
            // Calculate total earnings from completed appointments
            $totalEarnings = Appointment::where('professional_id', $user->id)
                ->where('status', 'completed')
                ->sum('total_price');
            
            // Check if profile is complete
            $profileComplete = !empty($user->name) 
                && !empty($user->phone) 
                && !empty($user->city)
                && $user->professionalProfile
                && !empty($user->professionalProfile->specialization)
                && !empty($user->professionalProfile->experience_years)
                && !empty($user->professionalProfile->hourly_rate)
                && !empty($user->professionalProfile->bio);
            
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
            $services = Service::where('professional_id', $request->user()->id)
                ->with(['appointments'])
                ->get()
                ->map(function ($service) {
                    // Calculate REAL rating from reviews for this service
                    $serviceReviews = Review::whereHas('appointment', function ($q) use ($service) {
                        $q->where('service_id', $service->id);
                    })->get();
                    
                    $avgRating = $serviceReviews->avg('rating');
                    $bookingsCount = $service->appointments()->count();
                    
                    return [
                        'id' => $service->id,
                        'name' => $service->name,
                        'description' => $service->description,
                        'price' => $service->price,
                        'duration' => $service->duration . ' mins',
                        'category' => $service->category,
                        'is_active' => $service->is_active,
                        'bookings_count' => $bookingsCount,
                        'rating' => $avgRating ? round($avgRating, 1) : null, // REAL RATING - NO DUMMY DATA
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
            
            // CHECK IF PROFILE IS COMPLETE BEFORE ALLOWING SERVICE CREATION
            $profileComplete = !empty($user->name) 
                && !empty($user->phone) 
                && !empty($user->city)
                && $user->professionalProfile
                && !empty($user->professionalProfile->specialization)
                && !empty($user->professionalProfile->experience_years)
                && !empty($user->professionalProfile->hourly_rate)
                && !empty($user->professionalProfile->bio);
            
            if (!$profileComplete) {
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
            
            // Get real statistics
            $totalAppointments = Appointment::where('professional_id', $user->id)->count();
            $pendingAppointments = Appointment::where('professional_id', $user->id)
                ->where('status', 'pending')->count();
            $activeServices = Service::where('professional_id', $user->id)
                ->where('is_active', true)->count();
            
            // Earnings
            $totalEarnings = Appointment::where('professional_id', $user->id)
                ->where('status', 'completed')
                ->sum('total_price');
            $availableEarnings = $totalEarnings; // Simplified
            $pendingEarnings = Appointment::where('professional_id', $user->id)
                ->where('status', 'confirmed')
                ->sum('total_price');
            
            // Rating
            $averageRating = Review::where('professional_id', $user->id)->avg('rating');
            $totalReviews = Review::where('professional_id', $user->id)->count();
            
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
                    'average' => $averageRating ? round($averageRating, 1) : 0,
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
            
            // Calculate stats
            $averageRating = Review::where('professional_id', $user->id)->avg('rating');
            $totalReviews = Review::where('professional_id', $user->id)->count();
            
            $ratingBreakdown = [];
            for ($i = 1; $i <= 5; $i++) {
                $ratingBreakdown[$i] = Review::where('professional_id', $user->id)
                    ->where('rating', $i)
                    ->count();
            }

            return response()->json([
                'reviews' => $reviews,
                'stats' => [
                    'average_rating' => $averageRating ? round($averageRating, 1) : 0,
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
     * Public list of professionals
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
                      ->orWhereHas('professionalProfile', function ($subQ) use ($search) {
                          $subQ->where('specialization', 'LIKE', "%{$search}%");
                      });
                });
            }

            if ($request->city) {
                $query->where('city', $request->city);
            }

            $professionals = $query->get()->map(function ($pro) {
                $avgRating = Review::where('professional_id', $pro->id)->avg('rating');
                $totalReviews = Review::where('professional_id', $pro->id)->count();
                
                return [
                    'id' => $pro->id,
                    'name' => $pro->name,
                    'profession' => $pro->professionalProfile->specialization ?? 'Professional',
                    'rating' => $avgRating ? round($avgRating, 1) : null,
                    'reviews_count' => $totalReviews,
                    'experience' => ($pro->professionalProfile->experience_years ?? 0) . ' years',
                    'location' => $pro->city ?? 'Location',
                    'verified' => $pro->professionalProfile->is_verified ?? false,
                    'image' => $pro->profile_image,
                    'services' => $pro->services->pluck('name')->toArray(),
                ];
            });

            return response()->json([
                'professionals' => $professionals
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
     * Public show professional
     */
    public function publicShow($id)
    {
        try {
            $professional = User::where('id', $id)
                ->where('user_type', 'professional')
                ->with(['professionalProfile', 'services'])
                ->firstOrFail();

            $avgRating = Review::where('professional_id', $id)->avg('rating');
            $totalReviews = Review::where('professional_id', $id)->count();

            return response()->json([
                'id' => $professional->id,
                'name' => $professional->name,
                'profession' => $professional->professionalProfile->specialization ?? 'Professional',
                'bio' => $professional->professionalProfile->bio ?? '',
                'rating' => $avgRating ? round($avgRating, 1) : null,
                'reviews_count' => $totalReviews,
                'experience' => $professional->professionalProfile->experience_years ?? 0,
                'location' => $professional->city,
                'verified' => $professional->professionalProfile->is_verified ?? false,
                'image' => $professional->profile_image,
                'services' => $professional->services,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Professional not found'
            ], 404);
        }
    }

    /**
     * Get reviews for a professional (public)
     */
    public function reviews($id)
    {
        try {
            $reviews = Review::where('professional_id', $id)
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

            return response()->json([
                'reviews' => $reviews
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'reviews' => []
            ], 500);
        }
    }

    /**
     * Placeholder methods
     */
    public function getNotifications(Request $request)
    {
        return response()->json(['notifications' => []]);
    }

    public function getMessages(Request $request)
    {
        return response()->json(['messages' => []]);
    }
}