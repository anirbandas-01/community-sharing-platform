<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Order;
use App\Models\Product;

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
                ->where('stock', '>', 0); // only in-stock products

            // Search by name or category
            if ($request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('category', 'LIKE', "%{$search}%");
                });
            }

            // Filter by category
            if ($request->category && $request->category !== 'all') {
                $query->where('category', $request->category);
            }

            $products = $query->latest()->get()->map(function ($product) {
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
                    'business' => [
                        'id'           => $product->user->id,
                        'name'         => $product->user->enterprise->company_name ?? $product->user->name,
                        'city'         => $product->user->city,
                        'photo'        => $product->user->enterprise->enterprise_photo
                            ? asset('storage/' . $product->user->enterprise->enterprise_photo)
                            : null,
                    ],
                ];
            });

            // Distinct categories for filter dropdown
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
                'business' => [
                    'id'   => $product->user->id,
                    'name' => $product->user->enterprise->company_name ?? $product->user->name,
                    'city' => $product->user->city,
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
                });
            } else {
                $order->status = $validated['status'];
                $order->save();
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

            $totalRevenue = Order::where('business_user_id', $businessUserId)
                ->whereIn('status', ['delivered', 'shipped', 'processing'])
                ->sum('total_price');

            $totalOrders = Order::where('business_user_id', $businessUserId)->count();

            $avgOrderValue = $totalOrders > 0
                ? round($totalRevenue / $totalOrders, 2)
                : 0;

            // Top products
            $topProducts = Order::where('business_user_id', $businessUserId)
                ->whereIn('status', ['delivered', 'shipped', 'processing'])
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

            // Daily sales (last 7 days)
            $dailySales = Order::where('business_user_id', $businessUserId)
                ->whereIn('status', ['delivered', 'shipped', 'processing'])
                ->where('created_at', '>=', now()->subDays(7))
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
                'growth'          => 0,
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