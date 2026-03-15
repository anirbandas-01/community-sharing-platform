<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Service;
use App\Models\Review;  // ← ADD THIS
use Illuminate\Support\Facades\Log;  // ← ADD THIS

class ResidentController extends Controller
{
    public function profile(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:500',
        ]);

        $user = $request->user();
        $user->update($request->only(['name', 'phone', 'city', 'address']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Get all appointments for the resident
     */
    public function getAppointments(Request $request)
    {
        try {
            $appointments = Appointment::where('user_id', $request->user()->id)
                ->with(['professional.professionalProfile', 'service'])
                ->orderBy('appointment_time', 'desc')
                ->get()
                ->map(function ($appointment) use ($request) {
                    // Check if user has reviewed this appointment
                    $hasReview = Review::where('user_id', $request->user()->id)
                        ->where('appointment_id', $appointment->id)
                        ->exists();

                    return [
                        'id' => $appointment->id,
                        'service' => $appointment->service->name ?? 'Service',
                        'professional' => [
                            'id' => $appointment->professional->id,
                            'name' => $appointment->professional->name,
                            'profession' => $appointment->professional->professionalProfile->specialization ?? 'Professional',
                            'image' => $appointment->professional->profile_image_url ?? 'https://i.pravatar.cc/150?img=12',
                            'phone' => $appointment->professional->phone ?? 'N/A',
                        ],
                        'date' => $appointment->appointment_time->format('M d, Y'),
                        'time' => $appointment->appointment_time->format('h:i A'),
                        'duration' => '1-2 hours',
                        'location' => $appointment->professional->city ?? 'Location',
                        'amount' => '₹' . number_format($appointment->total_price ?? 500, 0),
                        'status' => $appointment->status,
                        'notes' => $appointment->notes,
                        'has_review' => $hasReview, // ← NOW THIS WORKS
                    ];
                });

            return response()->json([
                'success' => true,
                'bookings' => $appointments
            ]);
        } catch (\Exception $e) {
            Log::error('Get appointments error', [  // ← NOW THIS WORKS
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to load appointments',
                'bookings' => []
            ], 500);
        }
    }

    /**
     * Create a new appointment
     */
    public function createAppointment(Request $request)
    {
        try {
            $validated = $request->validate([
                'professional_id' => 'required|exists:users,id',
                'service_id' => 'required|exists:services,id',
                'date' => 'required|date|after:today',
                'time' => 'required',
                'notes' => 'nullable|string|max:500',
            ]);

            // Combine date and time
            $appointmentTime = $validated['date'] . ' ' . $validated['time'];

            // Get service details
            $service = Service::findOrFail($validated['service_id']);

            $appointment = Appointment::create([
                'user_id' => $request->user()->id,
                'professional_id' => $validated['professional_id'],
                'service_id' => $validated['service_id'],
                'appointment_time' => $appointmentTime,
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
                'total_price' => $service->price ?? 500,
            ]);

            return response()->json([
                'message' => 'Appointment booked successfully',
                'appointment' => $appointment
            ], 201);

        } catch (\Exception $e) {
            Log::error('Create appointment error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to create appointment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel an appointment
     */
    public function cancelAppointment(Request $request, $id)
    {
        try {
            $appointment = Appointment::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            if (in_array($appointment->status, ['completed', 'cancelled'])) {
                return response()->json([
                    'message' => 'Cannot cancel this appointment'
                ], 400);
            }

            $appointment->status = 'cancelled';
            $appointment->save();

            return response()->json([
                'message' => 'Appointment cancelled successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Cancel appointment error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to cancel appointment'
            ], 500);
        }
    }

    /**
     * Search professionals
     */
    public function searchProfessionals(Request $request)
    {
        try {
            $query = User::where('user_type', 'professional')
                ->with(['professionalProfile', 'services']);

            // Search by name or specialization
            if ($request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhereHas('professionalProfile', function ($subQ) use ($search) {
                          $subQ->where('specialization', 'LIKE', "%{$search}%");
                      });
                });
            }

            // Filter by profession
            if ($request->profession) {
                $query->whereHas('professionalProfile', function ($q) use ($request) {
                    $q->where('specialization', 'LIKE', "%{$request->profession}%");
                });
            }

            // Filter by city
            if ($request->city) {
                $query->where('city', $request->city);
            }

            $professionals = $query->get()->map(function ($pro) {
                return [
                    'id' => $pro->id,
                    'name' => $pro->name,
                    'profession' => $pro->professionalProfile->specialization ?? 'Professional',
                    'rating' => $pro->average_rating ?? 4.5,
                    'reviews_count' => $pro->total_reviews ?? 0,
                    'price' => '₹500',
                    'experience' => ($pro->professionalProfile->experience_years ?? 0) . ' years',
                    'location' => $pro->city ?? 'Location',
                    'verified' => true,
                    'available' => true,
                    'image' => $pro->profile_image_url ?? 'https://i.pravatar.cc/150?img=1',
                    'services' => $pro->services->pluck('name')->toArray(),
                ];
            });

            return response()->json([
                'professionals' => $professionals
            ]);

        } catch (\Exception $e) {
            Log::error('Search professionals error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to search professionals',
                'professionals' => []
            ], 500);
        }
    }
}