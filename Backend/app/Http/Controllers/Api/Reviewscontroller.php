<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Appointment;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Enterprise;
use App\Services\NotificationService;

class ReviewsController extends Controller
{
    /**
     * Create a review.
     * POST /reviews
     * Body: { review_type: 'professional'|'product'|'store', ... }
     */
    public function store(Request $request)
    {
        try {
            $type = $request->input('review_type', 'professional');

            return match ($type) {
                'product' => $this->storeProductReview($request),
                'store'   => $this->storeStoreReview($request),
                default   => $this->storeProfessionalReview($request),
            };
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function storeProfessionalReview(Request $request)
    {
        $validated = $request->validate([
            'professional_id' => 'required|exists:users,id',
            'appointment_id'  => 'nullable|exists:appointments,id',
            'rating'          => 'required|integer|min:1|max:5',
            'comment'         => 'required|string|min:10|max:1000',
        ]);

        $professional = User::where('id', $validated['professional_id'])
            ->where('user_type', 'professional')
            ->first();

        if (!$professional) {
            return response()->json(['message' => 'Invalid professional'], 404);
        }

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

            $existingReview = Review::where('user_id', $request->user()->id)
                ->where('appointment_id', $validated['appointment_id'])
                ->where('review_type', 'professional')
                ->first();

            if ($existingReview) {
                return response()->json([
                    'message' => 'You have already reviewed this appointment'
                ], 400);
            }
        }

        $review = Review::create([
            'user_id'         => $request->user()->id,
            'review_type'     => 'professional',
            'professional_id' => $validated['professional_id'],
            'appointment_id'  => $validated['appointment_id'] ?? null,
            'rating'          => $validated['rating'],
            'comment'         => $validated['comment'],
        ]);

        NotificationService::reviewReceived($review);
        $review->load('user');

        return response()->json([
            'message' => 'Review submitted successfully',
            'review'  => $this->formatReview($review),
        ], 201);
    }

    private function storeProductReview(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id'   => 'nullable|exists:orders,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'required|string|min:10|max:1000',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if ($product->user_id === $request->user()->id) {
            return response()->json(['message' => 'You cannot review your own product'], 403);
        }

        if (isset($validated['order_id'])) {
            $order = Order::where('id', $validated['order_id'])
                ->where('user_id', $request->user()->id)
                ->where('product_id', $validated['product_id'])
                ->first();

            if (!$order) {
                return response()->json(['message' => 'Invalid order for this product'], 400);
            }

            $existingReview = Review::where('user_id', $request->user()->id)
                ->where('order_id', $validated['order_id'])
                ->where('review_type', 'product')
                ->first();

            if ($existingReview) {
                return response()->json(['message' => 'You have already reviewed this order'], 400);
            }
        }

        $review = Review::create([
            'user_id'          => $request->user()->id,
            'review_type'      => 'product',
            'product_id'       => $product->id,
            'order_id'         => $validated['order_id'] ?? null,
            'business_user_id' => $product->user_id,
            'rating'           => $validated['rating'],
            'comment'          => $validated['comment'],
        ]);

        NotificationService::reviewReceived($review);
        $review->load('user', 'product');

        return response()->json([
            'message' => 'Review submitted successfully',
            'review'  => $this->formatReview($review),
        ], 201);
    }

    /**
     * Review of the store/business as a whole — no specific product.
     * Body: { business_user_id, order_id?, rating, comment }
     */
    private function storeStoreReview(Request $request)
    {
        $validated = $request->validate([
            'business_user_id' => 'required|exists:users,id',
            'order_id'         => 'nullable|exists:orders,id',
            'rating'           => 'required|integer|min:1|max:5',
            'comment'          => 'required|string|min:10|max:1000',
        ]);

        $businessOwner = User::where('id', $validated['business_user_id'])
            ->where('user_type', 'business')
            ->first();

        if (!$businessOwner) {
            return response()->json(['message' => 'Invalid business'], 404);
        }

        if ($businessOwner->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot review your own store'], 403);
        }

        // Only allow reviewing a store the enterprise has approved (storefront is live)
        $enterprise = Enterprise::where('user_id', $businessOwner->id)->first();
        if (!$enterprise || $enterprise->status !== 'approved') {
            return response()->json(['message' => 'This store is not available for reviews'], 400);
        }

        if (isset($validated['order_id'])) {
            $order = Order::where('id', $validated['order_id'])
                ->where('user_id', $request->user()->id)
                ->where('business_user_id', $validated['business_user_id'])
                ->first();

            if (!$order) {
                return response()->json(['message' => 'Invalid order for this store'], 400);
            }

            $existingReview = Review::where('user_id', $request->user()->id)
                ->where('order_id', $validated['order_id'])
                ->where('review_type', 'store')
                ->first();

            if ($existingReview) {
                return response()->json(['message' => 'You have already reviewed this order'], 400);
            }
        } else {
            // One store review per user per business if no specific order is attached
            $existingReview = Review::where('user_id', $request->user()->id)
                ->where('business_user_id', $validated['business_user_id'])
                ->where('review_type', 'store')
                ->whereNull('order_id')
                ->first();

            if ($existingReview) {
                return response()->json(['message' => 'You have already reviewed this store'], 400);
            }
        }

        $review = Review::create([
            'user_id'          => $request->user()->id,
            'review_type'      => 'store',
            'business_user_id' => $businessOwner->id,
            'order_id'         => $validated['order_id'] ?? null,
            'rating'           => $validated['rating'],
            'comment'          => $validated['comment'],
        ]);

        NotificationService::reviewReceived($review);
        $review->load('user', 'business.enterprise');

        return response()->json([
            'message' => 'Review submitted successfully',
            'review'  => $this->formatReview($review),
        ], 201);
    }

    /**
     * GET /professionals/{id}/reviews — public, unchanged
     */
    public function getProfessionalReviews($professionalId)
    {
        try {
            $professional = User::where('id', $professionalId)
                ->where('user_type', 'professional')
                ->first();

            if (!$professional) {
                return response()->json(['message' => 'Professional not found'], 404);
            }

            $reviews = Review::where('review_type', 'professional')
                ->where('professional_id', $professionalId)
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($r) => $this->formatReview($r));

            return response()->json([
                'reviews' => $reviews,
                'stats'   => $this->buildStats($reviews),
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error loading reviews', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * GET /products/{id}/reviews — public, product-level only
     */
    public function getProductReviews($productId)
    {
        try {
            $product = Product::findOrFail($productId);

            $reviews = Review::where('review_type', 'product')
                ->where('product_id', $productId)
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($r) => $this->formatReview($r));

            return response()->json([
                'reviews' => $reviews,
                'stats'   => $this->buildStats($reviews),
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Product not found', 'error' => $e->getMessage()], 404);
        }
    }

    /**
     * GET /businesses/{id}/reviews — public, store-level only
     * (id = business owner's user id)
     */
    public function getStoreReviews($businessUserId)
    {
        try {
            $businessOwner = User::where('id', $businessUserId)
                ->where('user_type', 'business')
                ->firstOrFail();

            $reviews = Review::where('review_type', 'store')
                ->where('business_user_id', $businessUserId)
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($r) => $this->formatReview($r));

            return response()->json([
                'reviews' => $reviews,
                'stats'   => $this->buildStats($reviews),
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Store not found', 'error' => $e->getMessage()], 404);
        }
    }

    /**
     * GET /business/reviews — owner sees ALL reviews about them:
     * both individual product reviews AND overall store reviews.
     */
    public function getBusinessReviews(Request $request)
    {
        try {
            $reviews = Review::businessReviews() // product + store
                ->where('business_user_id', $request->user()->id)
                ->with(['user', 'product'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($r) => $this->formatReview($r));

            return response()->json([
                'reviews' => $reviews,
                'stats'   => $this->buildStats($reviews),
                // split counts so the dashboard can show tabs if desired
                'product_count' => $reviews->where('review_type', 'product')->count(),
                'store_count'   => $reviews->where('review_type', 'store')->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error loading reviews', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * GET /user/reviews — reviews written by the authenticated user (any type)
     */
    public function getUserReviews(Request $request)
    {
        try {
            $reviews = Review::where('user_id', $request->user()->id)
                ->with([
                    'professional.professionalProfile',
                    'product',
                    'business.enterprise',
                ])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($r) => $this->formatReview($r));

            return response()->json(['reviews' => $reviews]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error loading reviews', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * POST /reviews/{id}/respond
     * Works for: professional replying to their review,
     * OR business owner replying to a product OR store review.
     */
    public function respond(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'response' => 'required|string|min:10|max:500',
            ]);

            $review = Review::findOrFail($id);
            $userId = $request->user()->id;

            $authorized = $review->review_type === 'professional'
                ? $review->professional_id === $userId
                : $review->business_user_id === $userId; // covers 'product' and 'store'

            if (!$authorized) {
                return response()->json(['message' => 'Not authorized to respond to this review'], 403);
            }

            $review->professional_response = $validated['response'];
            $review->responded_at = now();
            $review->save();

            NotificationService::reviewResponded($review);

            return response()->json([
                'message' => 'Response added successfully',
                'review'  => $this->formatReview($review->fresh(['user', 'product', 'professional', 'business'])),
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error responding to review', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'rating'  => 'sometimes|integer|min:1|max:5',
                'comment' => 'sometimes|string|min:10|max:1000',
            ]);

            $review = Review::where('id', $id)->where('user_id', $request->user()->id)->first();

            if (!$review) {
                return response()->json(['message' => 'Review not found'], 404);
            }

            $review->update($validated);

            return response()->json([
                'message' => 'Review updated successfully',
                'review'  => $this->formatReview($review),
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating review', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            $review = Review::where('id', $id)->where('user_id', $request->user()->id)->first();

            if (!$review) {
                return response()->json(['message' => 'Review not found'], 404);
            }

            $review->delete();

            return response()->json(['message' => 'Review deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting review', 'error' => $e->getMessage()], 500);
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    private function formatReview(Review $review): array
    {
        $base = [
            'id'                    => $review->id,
            'review_type'           => $review->review_type,
            'rating'                => $review->rating,
            'comment'               => $review->comment,
            'professional_response' => $review->professional_response,
            'responded_at'          => $review->responded_at?->diffForHumans(),
            'created_at'            => $review->created_at->diffForHumans(),
            'date'                  => $review->created_at->format('M d, Y'),
            'user' => [
                'id'     => $review->user->id ?? null,
                'name'   => $review->user->name ?? 'Anonymous',
                'avatar' => $review->user->profile_image_url ?? null,
            ],
        ];

        switch ($review->review_type) {
            case 'professional':
                $base['professional'] = [
                    'id'             => $review->professional_id,
                    'name'           => $review->professional->name ?? null,
                    'specialization' => $review->professional->professionalProfile->specialization ?? 'Professional',
                ];
                break;

            case 'product':
                $base['product'] = [
                    'id'    => $review->product_id,
                    'name'  => $review->product->name ?? null,
                    'photo' => $review->product && $review->product->photo
                        ? asset('storage/' . $review->product->photo) : null,
                ];
                $base['business_user_id'] = $review->business_user_id;
                break;

            case 'store':
                $base['store'] = [
                    'business_user_id' => $review->business_user_id,
                    'company_name'     => $review->business->enterprise->company_name
                        ?? $review->business->name ?? 'Store',
                    'photo'            => ($review->business->enterprise->enterprise_photo ?? null)
                        ? asset('storage/' . $review->business->enterprise->enterprise_photo) : null,
                ];
                break;
        }

        return $base;
    }

    private function buildStats($reviews): array
    {
        $total = $reviews->count();
        $avg   = $total > 0 ? round($reviews->avg('rating'), 1) : 0;

        return [
            'total_reviews'    => $total,
            'average_rating'   => $avg,
            'rating_breakdown' => [
                5 => $reviews->where('rating', 5)->count(),
                4 => $reviews->where('rating', 4)->count(),
                3 => $reviews->where('rating', 3)->count(),
                2 => $reviews->where('rating', 2)->count(),
                1 => $reviews->where('rating', 1)->count(),
            ],
        ];
    }
}