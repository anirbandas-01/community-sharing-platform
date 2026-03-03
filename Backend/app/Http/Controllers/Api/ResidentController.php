<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ResidentController extends Controller
{
    public function profile(Request $request)
    {
        return response()->json(
            $request->user()->residentProfile
        );
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'preferences' => 'nullable|array',
            'notification_settings' => 'nullable|array'
        ]);

        $profile = $request->user()->residentProfile()
            ->updateOrCreate(
                ['user_id' => $request->user()->id],
                $data
            );

        return response()->json([
            'message' => 'Resident profile updated',
            'profile' => $profile
        ]);
    }

    public function searchProfessionals(Request $request)
    {
        try {
            $query = $request->input('query');

            // Log the search attempt
            Log::info('Search professionals request', [
                'query' => $query,
                'user_id' => $request->user()?->id,
                'user_type' => $request->user()?->user_type
            ]);

            if (!$query) {
                return response()->json([
                    'message' => 'Search query required',
                    'data' => []
                ], 400);
            }

            // Search for professionals
            $professionals = User::where('user_type', 'professional')
                ->whereHas('professionalProfile', function ($q) use ($query) {
                    $q->where('specialization', 'LIKE', "%$query%")
                      ->orWhere('bio', 'LIKE', "%$query%")
                      ->orWhere('qualifications', 'LIKE', "%$query%");
                })
                ->with('professionalProfile')
                ->get();

            // Log results
            Log::info('Search results', [
                'query' => $query,
                'count' => $professionals->count()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Search completed',
                'data' => $professionals,
                'count' => $professionals->count()
            ]);

        } catch (\Exception $e) {
            Log::error('Search professionals error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Search failed: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    /**
     * Get all appointments for the resident
     */
    public function getAppointments(Request $request)
    {
        try {
            $appointments = Appointment::where('user_id', $request->user()->id)
                ->with(['professional', 'service'])
                ->orderBy('appointment_time', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'appointments' => $appointments
            ]);
        } catch (\Exception $e) {
            Log::error('Get appointments error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to load appointments',
                'appointments' => []
            ], 500);
        }
    }

    /**
     * Create a new appointment/booking
     */
    public function createAppointment(Request $request)
    {
        try {
            $validated = $request->validate([
                'professional_id' => 'required|exists:users,id',
                'service_id' => 'nullable|exists:services,id',
                'appointment_time' => 'required|date|after:now',
                'notes' => 'nullable|string',
                'total_price' => 'nullable|numeric|min:0'
            ]);

            $validated['user_id'] = $request->user()->id;
            $validated['status'] = 'pending';

            $appointment = Appointment::create($validated);
            $appointment->load(['professional', 'service']);

            return response()->json([
                'success' => true,
                'message' => 'Appointment created successfully',
                'appointment' => $appointment
            ], 201);

        } catch (\Exception $e) {
            Log::error('Create appointment error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
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

            if (in_array($appointment->status, ['cancelled', 'completed'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot cancel this appointment'
                ], 400);
            }

            $appointment->status = 'cancelled';
            $appointment->save();

            return response()->json([
                'success' => true,
                'message' => 'Appointment cancelled successfully',
                'appointment' => $appointment
            ]);

        } catch (\Exception $e) {
            Log::error('Cancel appointment error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel appointment'
            ], 500);
        }
    }
}