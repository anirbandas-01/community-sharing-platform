<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ReviewsController extends Controller
{
    /**
     * Create a new review
     * POST /reviews
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'professional_id' => 'required|exists:users,id',
                'appointment_id' => 'nullable|exists:appointments,id',
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'required|string|min:10|max:1000',
            ]);

            // Check if professional exists and is actually a professional
            $professional = User::where('id', $validated['professional_id'])
                ->where('user_type', 'professional')
                ->first();

            if (!$professional) {
                return response()->json([
                    'message' => 'Invalid professional'
                ], 404);
            }

            // If appointment_id provided, verify it exists and user is the client
            if (isset($validated['appointment_id'])) {
                $appointment = Appointment::where('id', $validated['appointment_id'])
                    ->where('user_id', $request->user()->id)
                    ->where('professional_id', $validated['professional_id'])
                    ->where('status', 'completed')
                    ->first();

                if (!$appointment) {
                    return response()->json([
                        'message' => 'Invalid appointment or appointment not completed'
                    ], 400);
                }

                // Check if already reviewed
                $existingReview = Review::where('user_id', $request->user()->id)
                    ->where('appointment_id', $validated['appointment_id'])
                    ->first();

                if ($existingReview) {
                    return response()->json([
                        'message' => 'You have already reviewed this appointment'
                    ], 400);
                }
            }

            $review = Review::create([
                'user_id' => $request->user()->id,
                'professional_id' => $validated['professional_id'],
                'appointment_id' => $validated['appointment_id'] ?? null,
                'rating' => $validated['rating'],
                'comment' => $validated['comment'],
            ]);

            $review->load('user');

            return response()->json([
                'message' => 'Review submitted successfully',
                'review' => [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'user' => [
                        'name' => $review->user->name,
                        'avatar' => $review->user->profile_image_url,
                    ],
                    'created_at' => $review->created_at->diffForHumans(),
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get reviews for a professional
     * GET /professionals/{id}/reviews
     */
    public function getProfessionalReviews($professionalId)
    {
        try {
            $professional = User::where('id', $professionalId)
                ->where('user_type', 'professional')
                ->first();

            if (!$professional) {
                return response()->json([
                    'message' => 'Professional not found'
                ], 404);
            }

            $reviews = Review::where('professional_id', $professionalId)
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'rating' => $review->rating,
                        'comment' => $review->comment,
                        'user' => [
                            'name' => $review->user->name,
                            'avatar' => $review->user->profile_image_url,
                        ],
                        'professional_response' => $review->professional_response,
                        'created_at' => $review->created_at->diffForHumans(),
                        'date' => $review->created_at->format('M d, Y'),
                    ];
                });

            // Calculate rating statistics
            $totalReviews = $reviews->count();
            $averageRating = $totalReviews > 0 ? round($reviews->avg('rating'), 1) : 0;

            $ratingBreakdown = [
                5 => $reviews->where('rating', 5)->count(),
                4 => $reviews->where('rating', 4)->count(),
                3 => $reviews->where('rating', 3)->count(),
                2 => $reviews->where('rating', 2)->count(),
                1 => $reviews->where('rating', 1)->count(),
            ];

            return response()->json([
                'reviews' => $reviews,
                'stats' => [
                    'total_reviews' => $totalReviews,
                    'average_rating' => $averageRating,
                    'rating_breakdown' => $ratingBreakdown,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loading reviews',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's own reviews (reviews they've written)
     * GET /user/reviews
     */
    public function getUserReviews(Request $request)
    {
        try {
            $reviews = Review::where('user_id', $request->user()->id)
                ->with(['professional', 'appointment'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'rating' => $review->rating,
                        'comment' => $review->comment,
                        'professional' => [
                            'id' => $review->professional->id,
                            'name' => $review->professional->name,
                            'specialization' => $review->professional->professionalProfile->specialization ?? 'Professional',
                        ],
                        'professional_response' => $review->professional_response,
                        'created_at' => $review->created_at->diffForHumans(),
                    ];
                });

            return response()->json(['reviews' => $reviews]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loading reviews',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Professional responds to a review
     * POST /reviews/{id}/respond
     */
    public function respond(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'response' => 'required|string|min:10|max:500',
            ]);

            $review = Review::where('id', $id)
                ->where('professional_id', $request->user()->id)
                ->first();

            if (!$review) {
                return response()->json([
                    'message' => 'Review not found'
                ], 404);
            }

            $review->professional_response = $validated['response'];
            $review->responded_at = now();
            $review->save();

            return response()->json([
                'message' => 'Response added successfully',
                'review' => $review
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error responding to review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a review
     * PUT /reviews/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'rating' => 'sometimes|integer|min:1|max:5',
                'comment' => 'sometimes|string|min:10|max:1000',
            ]);

            $review = Review::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->first();

            if (!$review) {
                return response()->json([
                    'message' => 'Review not found'
                ], 404);
            }

            $review->update($validated);

            return response()->json([
                'message' => 'Review updated successfully',
                'review' => $review
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a review
     * DELETE /reviews/{id}
     */
    public function destroy(Request $request, $id)
    {
        try {
            $review = Review::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->first();

            if (!$review) {
                return response()->json([
                    'message' => 'Review not found'
                ], 404);
            }

            $review->delete();

            return response()->json([
                'message' => 'Review deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting review',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}