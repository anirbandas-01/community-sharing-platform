<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Order;
use App\Models\Product;
use App\Services\NotificationService;
use App\Models\Review;

class OrderController extends Controller
{
    /**
     * Browse all available products from approved businesses.
     * PUBLIC within auth — accessible by resident & professional.
     */
    public function browseProducts(Request $request)
{
    try {
        $query = Product::with(['user.enterprise'])
            ->whereHas('user.enterprise', function ($q) {
                $q->where('status', 'approved');
            })
            ->where('stock', '>', 0);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('category', 'LIKE', "%{$search}%");
            });
        }

        if ($request->category && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $allProducts = $query->latest()->get();

        // Bulk-fetch product rating averages in one query
        $productIds = $allProducts->pluck('id');
        $productRatings = Review::where('review_type', 'product')
            ->whereIn('product_id', $productIds)
            ->selectRaw('product_id, AVG(rating) as avg_rating, COUNT(*) as total')
            ->groupBy('product_id')
            ->get()
            ->keyBy('product_id');

        // Bulk-fetch store (business) rating averages too
        $businessIds = $allProducts->pluck('user_id')->unique();
        $storeRatings = Review::where('review_type', 'store')
            ->whereIn('business_user_id', $businessIds)
            ->selectRaw('business_user_id, AVG(rating) as avg_rating, COUNT(*) as total')
            ->groupBy('business_user_id')
            ->get()
            ->keyBy('business_user_id');

        $products = $allProducts->map(function ($product) use ($productRatings, $storeRatings) {
            $pRating = $productRatings->get($product->id);
            $sRating = $storeRatings->get($product->user_id);

            return [
                'id'           => $product->id,
                'name'         => $product->name,
                'category'     => $product->category,
                'price'        => $product->price,
                'stock'        => $product->stock,
                'sku'          => $product->sku,
                'photo'        => $product->photo
                    ? asset('storage/' . $product->photo)
                    : null,
                'rating'       => $pRating ? round($pRating->avg_rating, 1) : null,
                'reviews_count' => $pRating ? (int) $pRating->total : 0,
                'business' => [
                    'id'            => $product->user->id,
                    'name'          => $product->user->enterprise->company_name ?? $product->user->name,
                    'city'          => $product->user->city,
                    'photo'         => $product->user->enterprise->enterprise_photo
                        ? asset('storage/' . $product->user->enterprise->enterprise_photo)
                        : null,
                    'rating'        => $sRating ? round($sRating->avg_rating, 1) : null,
                    'reviews_count' => $sRating ? (int) $sRating->total : 0,
                ],
            ];
        });

        $categories = Product::whereHas('user.enterprise', function ($q) {
                $q->where('status', 'approved');
            })
            ->where('stock', '>', 0)
            ->distinct()
            ->pluck('category')
            ->sort()
            ->values();

        return response()->json([
            'products'   => $products,
            'categories' => $categories,
        ]);
    } catch (\Exception $e) {
        Log::error('Browse products error: ' . $e->getMessage());
        return response()->json([
            'message'  => 'Error loading products',
            'products' => [],
        ], 500);
    }
}

    /**
     * Get a single product detail (public within auth).
     */
    public function showProduct($id)
{
    try {
        $product = Product::with('user.enterprise')
            ->whereHas('user.enterprise', function ($q) {
                $q->where('status', 'approved');
            })
            ->findOrFail($id);

        $pRating = Review::where('review_type', 'product')
            ->where('product_id', $product->id)
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as total')
            ->first();

        $sRating = Review::where('review_type', 'store')
            ->where('business_user_id', $product->user_id)
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as total')
            ->first();

        return response()->json([
            'id'       => $product->id,
            'name'     => $product->name,
            'category' => $product->category,
            'price'    => $product->price,
            'stock'    => $product->stock,
            'sku'      => $product->sku,
            'photo'    => $product->photo
                ? asset('storage/' . $product->photo)
                : null,
            'rating'        => $pRating && $pRating->total > 0 ? round($pRating->avg_rating, 1) : null,
            'reviews_count' => $pRating ? (int) $pRating->total : 0,
            'business' => [
                'id'            => $product->user->id,
                'name'          => $product->user->enterprise->company_name ?? $product->user->name,
                'city'          => $product->user->city,
                'rating'        => $sRating && $sRating->total > 0 ? round($sRating->avg_rating, 1) : null,
                'reviews_count' => $sRating ? (int) $sRating->total : 0,
            ],
        ]);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Product not found'], 404);
    }
}

    /**
     * Place an order.
     * Decrements stock atomically using a DB transaction.
     */
    public function placeOrder(Request $request)
    {
        try {
            $validated = $request->validate([
                'product_id'       => 'required|exists:products,id',
                'quantity'         => 'required|integer|min:1',
                'delivery_address' => 'nullable|string|max:500',
                'notes'            => 'nullable|string|max:500',
            ]);

            $order = DB::transaction(function () use ($validated, $request) {
                // Lock the product row to prevent race conditions
                $product = Product::lockForUpdate()->findOrFail($validated['product_id']);

                // Check stock
                if ($product->stock < $validated['quantity']) {
                    throw new \Exception("Only {$product->stock} units available.");
                }

                // Decrement stock
                $product->stock -= $validated['quantity'];
                $product->save();

                // Create order
                return Order::create([
                    'user_id'          => $request->user()->id,
                    'business_user_id' => $product->user_id,
                    'product_id'       => $product->id,
                    'quantity'         => $validated['quantity'],
                    'unit_price'       => $product->price,
                    'total_price'      => $product->price * $validated['quantity'],
                    'status'           => 'pending',
                    'delivery_address' => $validated['delivery_address'] ?? null,
                    'notes'            => $validated['notes'] ?? null,
                ]);
            });

            $order->load('product', 'business');
            NotificationService::orderPlaced($order);

            return response()->json([
                'message' => 'Order placed successfully',
                'order'   => $this->formatOrder($order),
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Place order error: ' . $e->getMessage());
            return response()->json([
                'message' => $e->getMessage() ?: 'Failed to place order',
            ], 400);
        }
    }

    /**
     * Get orders for the logged-in buyer (resident or professional).
     */
    public function myOrders(Request $request)
    {
        try {
            $orders = Order::where('user_id', $request->user()->id)
                ->with(['product', 'business'])
                ->latest()
                ->get()
                ->map(fn($o) => $this->formatOrder($o));

            return response()->json(['orders' => $orders]);
        } catch (\Exception $e) {
            Log::error('My orders error: ' . $e->getMessage());
            return response()->json(['orders' => []], 500);
        }
    }

    /**
     * Cancel an order (buyer only, only if still pending).
     * Restores stock.
     */
    public function cancelOrder(Request $request, $id)
    {
        try {
            $order = Order::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            if ($order->status !== 'pending') {
                return response()->json([
                    'message' => 'Only pending orders can be cancelled.',
                ], 400);
            }

            DB::transaction(function () use ($order) {
                // Restore stock
                $product = Product::lockForUpdate()->find($order->product_id);
                if ($product) {
                    $product->stock += $order->quantity;
                    $product->save();
                }

                $order->status = 'cancelled';
                $order->save();
                NotificationService::orderCancelled($order, 'buyer');
            });

            return response()->json(['message' => 'Order cancelled successfully']);
        } catch (\Exception $e) {
            Log::error('Cancel order error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to cancel order'], 500);
        }
    }

    /**
     * Get orders for the business owner.
     */
    public function businessOrders(Request $request)
    {
        try {
            $orders = Order::where('business_user_id', $request->user()->id)
                ->with(['product', 'user'])
                ->latest()
                ->get()
                ->map(function ($order) {
                    return [
                        'id'               => $order->id,
                        'customer'         => $order->user->name ?? 'Customer',
                        'customer_phone'   => $order->user->phone ?? 'N/A',
                        'product_name'     => $order->product->name ?? 'Product',
                        'product_photo'    => $order->product->photo
                            ? asset('storage/' . $order->product->photo)
                            : null,
                        'quantity'         => $order->quantity,
                        'unit_price'       => $order->unit_price,
                        'total'            => $order->total_price,
                        'status'           => $order->status,
                        'delivery_address' => $order->delivery_address,
                        'notes'            => $order->notes,
                        'date'             => $order->created_at->format('M d, Y'),
                        'items'            => "{$order->quantity}x {$order->product->name}",
                    ];
                });

            return response()->json(['orders' => $orders]);
        } catch (\Exception $e) {
            Log::error('Business orders error: ' . $e->getMessage());
            return response()->json(['orders' => []], 500);
        }
    }

    /**
     * Business owner updates order status.
     */
    public function updateOrderStatus(Request $request, $id)
    {
        try {
            $order = Order::where('id', $id)
                ->where('business_user_id', $request->user()->id)
                ->firstOrFail();

            $validated = $request->validate([
                'status' => 'required|in:processing,shipped,delivered,cancelled',
            ]);

            // If business cancels, restore stock
            if ($validated['status'] === 'cancelled' && $order->status !== 'cancelled') {
                DB::transaction(function () use ($order, $validated) {
                    $product = Product::lockForUpdate()->find($order->product_id);
                    if ($product) {
                        $product->stock += $order->quantity;
                        $product->save();
                    }
                    $order->status = $validated['status'];
                    $order->save();
                    if ($order->status === 'cancelled') {
                        NotificationService::orderCancelled($order, 'business');
                    } else {
                        NotificationService::orderStatusChanged($order);
                    }
                });
            } else {
                $order->status = $validated['status'];
                $order->save();
                 if ($order->status === 'cancelled') {
                    NotificationService::orderCancelled($order, 'business');
                } else {
                    NotificationService::orderStatusChanged($order);
                }
            }

            return response()->json(['message' => 'Order updated successfully']);
        } catch (\Exception $e) {
            Log::error('Update order status error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update order'], 500);
        }
    }

    /**
     * Business sales summary — real data now.
     */
    public function businessSales(Request $request)
    {
        try {
            $businessUserId = $request->user()->id;
 
            $period    = $request->query('period', 'month');
            $startDate = match ($period) {
                'week'  => now()->subWeek(),
                'year'  => now()->subYear(),
                default => now()->subMonth(),
            };
 
            // Previous period (same length) for growth comparison
            $prevStart = match ($period) {
                'week'  => now()->subWeeks(2),
                'year'  => now()->subYears(2),
                default => now()->subMonths(2),
            };
 
            // ── Revenue & orders for selected period ──
            $totalRevenue = Order::where('business_user_id', $businessUserId)
                ->whereIn('status', ['delivered', 'shipped', 'processing'])
                ->where('created_at', '>=', $startDate)
                ->sum('total_price');
 
            $totalOrders = Order::where('business_user_id', $businessUserId)
                ->where('created_at', '>=', $startDate)
                ->count();
 
            $avgOrderValue = $totalOrders > 0
                ? round($totalRevenue / $totalOrders, 2)
                : 0;
 
            // ── Growth vs previous period ──
            $prevRevenue = Order::where('business_user_id', $businessUserId)
                ->whereIn('status', ['delivered', 'shipped', 'processing'])
                ->whereBetween('created_at', [$prevStart, $startDate])
                ->sum('total_price');
 
            $growth = $prevRevenue > 0
                ? round((($totalRevenue - $prevRevenue) / $prevRevenue) * 100, 1)
                : 0;
 
            // ── Top products for the period ──
            $topProducts = Order::where('business_user_id', $businessUserId)
                ->whereIn('status', ['delivered', 'shipped', 'processing'])
                ->where('created_at', '>=', $startDate)
                ->select('product_id', DB::raw('SUM(quantity) as units'), DB::raw('SUM(total_price) as revenue'))
                ->groupBy('product_id')
                ->with('product')
                ->orderByDesc('revenue')
                ->limit(5)
                ->get()
                ->map(fn($o) => [
                    'name'    => $o->product->name ?? 'Product',
                    'units'   => $o->units,
                    'revenue' => number_format($o->revenue, 0),
                ]);
 
            // ── Daily sales chart data for the period ──
            $dailySales = Order::where('business_user_id', $businessUserId)
                ->whereIn('status', ['delivered', 'shipped', 'processing'])
                ->where('created_at', '>=', $startDate)
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('COUNT(*) as orders'),
                    DB::raw('SUM(total_price) as revenue')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(fn($d) => [
                    'date'    => \Carbon\Carbon::parse($d->date)->format('M d'),
                    'orders'  => $d->orders,
                    'revenue' => number_format($d->revenue, 0),
                ]);
 
            return response()->json([
                'revenue'         => ['total' => $totalRevenue],
                'orders'          => ['total' => $totalOrders],
                'avg_order_value' => $avgOrderValue,
                'growth'          => $growth,
                'daily_sales'     => $dailySales,
                'top_products'    => $topProducts,
            ]);
        } catch (\Exception $e) {
            Log::error('Business sales error: ' . $e->getMessage());
            return response()->json([
                'revenue'         => ['total' => 0],
                'orders'          => ['total' => 0],
                'avg_order_value' => 0,
                'growth'          => 0,
                'daily_sales'     => [],
                'top_products'    => [],
            ], 500);
        }
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private function formatOrder(Order $order): array
    {
        return [
            'id'               => $order->id,
            'product_id'       => $order->product_id,        
            'business_user_id' => $order->business_user_id,
            'product_name'     => $order->product->name ?? 'Product',
            'product_photo'    => $order->product->photo
                ? asset('storage/' . $order->product->photo)
                : null,
            'business_name'    => $order->business->name ?? 'Business',
            'quantity'         => $order->quantity,
            'unit_price'       => $order->unit_price,
            'total_price'      => $order->total_price,
            'status'           => $order->status,
            'delivery_address' => $order->delivery_address,
            'notes'            => $order->notes,
            'date'             => $order->created_at->format('M d, Y'),
        ];
    }
}