<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ProfessionalProfile;
use App\Models\Service;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProfessionalsController extends Controller
{
    /*Dashboard*/
    public function getDashboard(Request $request)
    {
        try{
        $user = $request->user();
        
        // FIX 1: Corrected syntax - removed :: and used where() properly
        $profile = ProfessionalProfile::where('user_id', $user->id)->first();

        // Get services count
        $servicesCount = Service::where('professional_id', $user->id)->count();
        $activeServicesCount = Service::where('professional_id', $user->id)
            ->where('is_active', true)
            ->count();

        // Get appointments statistics
        $totalAppointments = Appointment::where('professional_id', $user->id)->count();
        $upcomingAppointments = Appointment::where('professional_id', $user->id)
            ->where('appointment_time', '>', now())
            ->where('status', '!=', 'cancelled')
            ->count();
        $pendingAppointments = Appointment::where('professional_id', $user->id)
            ->where('status', 'pending')
            ->count();

        // Calculate total earnings (completed appointments)
        $totalEarnings = Appointment::where('professional_id', $user->id)
            ->where('status', 'completed')
            ->sum('total_price');

        // Get most popular service
        $popularService = Service::where('professional_id', $user->id)
            ->withCount('appointments')
            ->orderBy('appointments_count', 'desc')
            ->first();

        // FIX 2: Added upcoming appointments data for dashboard
        $upcomingAppointmentsData = Appointment::where('professional_id', $user->id)
            ->where('appointment_time', '>', now())
            ->where('status', '!=', 'cancelled')
            ->with(['user', 'service'])
            ->orderBy('appointment_time', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'client_name' => $appointment->user->name ?? 'Client',
                    'service_name' => $appointment->service->name ?? 'Service',
                    'appointment_time' => $appointment->appointment_time,
                    'status' => $appointment->status,
                    'total_price' => $appointment->total_price,
                    'notes' => $appointment->notes,
                    'user' => [
                        'name' => $appointment->user->name ?? 'Client',
                        'email' => $appointment->user->email ?? ''
                    ],
                    'service' => [
                        'name' => $appointment->service->name ?? 'Service',
                        'price' => $appointment->service->price ?? 0
                    ]
                ];
            });

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'profile' => $profile,
            'stats' => [
                'total_services' => $servicesCount,
                'active_services' => $activeServicesCount,
                'total_appointments' => $totalAppointments,
                'upcoming_appointments' => $upcomingAppointments,
                'pending_appointments' => $pendingAppointments,
                'total_earnings' => $totalEarnings,
                'popular_service' => $popularService ? $popularService->name : null,
            ],
            // FIX 3: Added additional data needed by frontend
            'earnings' => [
                'total' => $totalEarnings ?? 0,
                'available' => $totalEarnings ?? 0,
                'pending' => 0
            ],
            'appointments' => [
                'total' => $totalAppointments,
                'upcoming' => $upcomingAppointments,
                'data' => $upcomingAppointmentsData
            ],
            'rating' => [
                'average' => 0,
                'total' => 0,
                'breakdown' => [
                    '5' => 0,
                    '4' => 0,
                    '3' => 0,
                    '2' => 0,
                    '1' => 0
                ]
            ],
            'reviews' => [],
            'messages' => [],
            'transactions' => []
        ]);
        }catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loading dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getProfile(Request $request)
    {
        try{
        $user = $request->user();
        $profile = $user->professionalProfile;

        if (!$profile) {
            // FIX 4: Create empty profile if doesn't exist instead of returning 404
            $profile = ProfessionalProfile::create([
                'user_id' => $user->id,
                'bio' => '',
                'specialization' => '',
                'experience_years' => 0,
                'qualifications' => '',
                'hourly_rate' => 0,
                'consultation_fee' => 0,
                'services_offered' => [],
                'availability' => [],
                'is_verified' => false
            ]);
        }

        // FIX 5: Return formatted response with user data
        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? '',
            'bio' => $profile->bio,
            'specialization' => $profile->specialization,
            'experience_years' => $profile->experience_years,
            'qualifications' => $profile->qualifications,
            'hourly_rate' => $profile->hourly_rate,
            'consultation_fee' => $profile->consultation_fee,
            'services_offered' => $profile->services_offered,
            'availability' => $profile->availability,
            'is_verified' => $profile->is_verified
        ]);
        }catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loading profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /*profile update */
    public function updateProfile(Request $request)
    {
        try{
        $request->validate([
            'bio' => 'nullable|string',
            'specialization' => 'nullable|string',
            'experience_years' => 'nullable|integer',
            'qualifications' => 'nullable|string',
            'hourly_rate' => 'nullable|numeric',
            'consultation_fee' => 'nullable|numeric',
            'services_offered' => 'nullable|array', // FIX 6: Changed from string to array
            'availability' => 'nullable|array', // FIX 6: Changed from string to array
            // FIX 7: Added user fields
            'name' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        $user = $request->user();

        // FIX 8: Update user basic info
        if ($request->has('name')) {
            $user->name = $request->name;
        }
        if ($request->has('phone')) {
            $user->phone = $request->phone;
        }
        $user->save();

        // Update professional profile
        $profile = ProfessionalProfile::updateOrCreate(
            ['user_id' => $user->id],
            $request->only([
                'bio',
                'specialization',
                'experience_years',
                'qualifications',
                'hourly_rate',
                'consultation_fee',
                'services_offered',
                'availability'
            ])
        );

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile
        ]);
        }catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function addService(Request $request)
    {
        try{
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'duration' => 'nullable|integer',
            'category' => 'nullable|string', // FIX 9: Added category validation
        ]);

        $service = Service::create([
            'professional_id' => $request->user()->id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'duration' => $request->duration,
            'category' => $request->category, // FIX 10: Added category
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Service added successfully',
            'service' => $service
        ], 201);
        }catch (\Exception $e) {
            return response()->json([
                'message' => 'Error adding service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // FIX 11: Added missing getService method
    public function getService(Request $request, $id)
    {
        try{
        $service = Service::where('professional_id', $request->user()->id)
            ->where('id', $id)
            ->first();

        if (!$service) {
            return response()->json([
                'message' => 'Service not found'
            ], 404);
        }

        return response()->json([
            'id' => $service->id,
            'name' => $service->name,
            'description' => $service->description,
            'price' => $service->price,
            'duration' => $service->duration,
            'category' => $service->category,
            'is_active' => $service->is_active,
            'status' => $service->is_active ? 'active' : 'inactive'
        ]);
        }catch (\Exception $e) {
            return response()->json([
                'message' => 'Error getting service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // FIX 12: Added missing updateService method
    public function updateService(Request $request, $id)
    {
     try{   
        $service = Service::where('professional_id', $request->user()->id)
            ->where('id', $id)
            ->first();

        if (!$service) {
            return response()->json([
                'message' => 'Service not found'
            ], 404);
        }

        $request->validate([
            'name' => 'sometimes|string',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'duration' => 'sometimes|integer',
            'category' => 'sometimes|string',
            'is_active' => 'sometimes|boolean',
            'status' => 'sometimes|string|in:active,inactive,paused'
        ]);

        // Update fields
        if ($request->has('name')) $service->name = $request->name;
        if ($request->has('description')) $service->description = $request->description;
        if ($request->has('price')) $service->price = $request->price;
        if ($request->has('duration')) $service->duration = $request->duration;
        if ($request->has('category')) $service->category = $request->category;
        if ($request->has('is_active')) $service->is_active = $request->is_active;
        if ($request->has('status')) {
            $service->is_active = $request->status === 'active';
        }

        $service->save();

        return response()->json([
            'message' => 'Service updated successfully',
            'service' => $service
        ]);
     }catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // FIX 13: Added missing deleteService method
    public function deleteService(Request $request, $id)
    {
        try{
        $service = Service::where('professional_id', $request->user()->id)
            ->where('id', $id)
            ->first();

        if (!$service) {
            return response()->json([
                'message' => 'Service not found'
            ], 404);
        }

        $service->delete();

        return response()->json([
            'message' => 'Service deleted successfully'
        ]);
        }catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /*Get appointment*/
    public function getAppointment(Request $request)
    {
        try{
        $appointments = Appointment::where('professional_id', $request->user()->id)
            ->with(['user', 'service'])
            ->orderBy('appointment_time', 'desc')
            ->get()
            // FIX 14: Format appointments for frontend
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'client_name' => $appointment->user->name ?? 'Client',
                    'service_name' => $appointment->service->name ?? 'Service',
                    'date' => $appointment->appointment_time->format('M d, Y'),
                    'time' => $appointment->appointment_time->format('h:i A'),
                    'price' => $appointment->total_price,
                    'status' => $appointment->status,
                    'notes' => $appointment->notes,
                    'location' => 'N/A',
                    'appointment_time' => $appointment->appointment_time
                ];
            });

        return response()->json($appointments);
        }catch(\Exception $e) {
            return response()->json([
                'message' => 'Error loading appointments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateAppointment(Request $request, $id)
    {

      try{
        // FIX 15: Fixed validation - removed spaces in status values
        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
            'notes' => 'nullable|string'
        ]);

        $appointment = Appointment::where('professional_id', $request->user()->id)
            ->where('id', $id)
            ->first();

        if (!$appointment) {
            return response()->json([
                'message' => 'Appointment not found'
            ], 404);
        }

        $currentStatus = $appointment->status;
        $newStatus = $request->status;

        $allowedTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['completed', 'cancelled'],
            'completed' => [], // Cannot change once completed
            'cancelled' => []  // Cannot change once cancelled
        ];

        if(!in_array($newStatus, $allowedTransitions[$currentStatus] ?? [])){
            return response()->json([
                'message' => "Cannot change status from {$currentStatus} to {$newStatus}"
            ], 400);
        }

        $appointment->status = $newStatus;
        if ($request->has('notes')) {

        $exitstingNotes = $appointment->notes ? $appointment->notes . "\n\n" : "";
        $appointment->notes = $exitstingNotes . "[" . now()->format('Y-m-d H:i') . " ]" . $request->notes;
            /* $appointment->notes = $request->notes; */
        }
        $appointment->save();

        return response()->json([
            'message' => 'Appointment updated successfully',
            'appointment' => $appointment->load(['user', 'service'])
        ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating appointment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /*List Services*/
    public function listService(Request $request)
    {
        try{
        $services = Service::where('professional_id', $request->user()->id)
            ->withCount('appointments')
            ->orderBy('created_at', 'desc')
            ->get()
            // FIX 16: Format services for frontend
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'description' => $service->description,
                    'price' => $service->price,
                    'duration' => $service->duration,
                    'category' => $service->category,
                    'is_active' => $service->is_active,
                    'status' => $service->is_active ? 'active' : 'inactive',
                    'bookings' => $service->appointments_count,
                    'rating' => 0,
                    'created_at' => $service->created_at
                ];
            });
        return response()->json($services);
        }catch(\Exception $e) {
            return response()->json([
                'message' => 'Error loading services',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /*Get Earnings*/
    public function getEarnings(Request $request)
    {
      try {
        $user = $request->user();

        // Total earnings from completed appointments
        $totalEarnings = Appointment::where('professional_id', $user->id)
            ->where('status', 'completed')
            ->sum('total_price');

        // This month's earnings
        $thisMonthEarnings = Appointment::where('professional_id', $user->id)
            ->where('status', 'completed')
            ->whereMonth('appointment_time', now()->month)
            ->whereYear('appointment_time', now()->year)
            ->sum('total_price');

        // Last month's earnings
        $lastMonthEarnings = Appointment::where('professional_id', $user->id)
            ->where('status', 'completed')
            ->whereMonth('appointment_time', now()->subMonth()->month)
            ->whereYear('appointment_time', now()->subMonth()->year)
            ->sum('total_price');

        // Calculate percentage change
        $percentageChange = 0;
        if ($lastMonthEarnings > 0) {
            $percentageChange = (($thisMonthEarnings - $lastMonthEarnings) / $lastMonthEarnings) * 100;
        }

        // FIX 17: Added pending payments
        $pendingPayments = Appointment::where('professional_id', $user->id)
            ->where('status', 'confirmed')
            ->sum('total_price');

        // Recent earnings (last 10 completed appointments)
        $recentEarnings = Appointment::where('professional_id', $user->id)
            ->where('status', 'completed')
            ->with(['user', 'service'])
            ->orderBy('appointment_time', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'total_earnings' => $totalEarnings ?? 0,
            'this_month' => $thisMonthEarnings ?? 0,
            'last_month' => $lastMonthEarnings ?? 0,
            'percentage_change' => round($percentageChange, 2),
            'pending_payments' => $pendingPayments ?? 0,
            'available_balance' => ($totalEarnings - $pendingPayments) ?? 0,
            'recent_earnings' => $recentEarnings
        ]);

      }catch(\Exception $e){
        return response()->json([
            'message' => 'Error loading earnings',
            'error' => $e->getMessage()
        ],500);
      }
    }

    /*Get Reviews*/
    public function getReviews(Request $request)
    {
        // For now, return mock data since we don't have a reviews table yet
        return response()->json([
            'average_rating' => 0,
            'total_reviews' => 0,
            'reviews' => []
        ]);
    }

    public function getNotifications(Request $request)
{
    // Return empty array for now, you can add real notifications later
    return response()->json([]);
}

public function getMessages(Request $request)
{
    // Return empty array for now, you can add real messages later
    return response()->json([]);
}
}