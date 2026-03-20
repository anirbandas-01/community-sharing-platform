<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;
use App\Models\Enterprise;

class BusinessController extends Controller
{
    /**
     * Get business dashboard data
     */
    public function getDashboard(Request $request)
    {
        try {
            $user = $request->user();
            
            // Get products for this business
            $products = Product::where('user_id', $user->id)->get();
            
            // Calculate stats
            $totalProducts = $products->count();
            $lowStockCount = $products->where('stock', '<=', function($product) {
                return $product->min_stock;
            })->where('stock', '>', 0)->count();
            $outOfStockCount = $products->where('stock', 0)->count();
            $totalValue = $products->sum(function($product) {
                return $product->stock * $product->price;
            });
            
            // Get low stock items
            $lowStockItems = $products->filter(function($product) {
                return $product->stock > 0 && $product->stock <= $product->min_stock;
            })->take(5)->map(function($product) {
                return [
                    'name' => $product->name,
                    'current' => $product->stock,
                    'minimum' => $product->min_stock
                ];
            })->values();
            
            // Mock data for orders and revenue (you can implement these later)
            return response()->json([
                'revenue' => [
                    'total' => 0,
                    'change' => '+0%'
                ],
                'orders' => [
                    'pending' => 0,
                    'new_today' => 0,
                    'recent' => []
                ],
                'products' => [
                    'total' => $totalProducts,
                    'low_stock' => $lowStockCount,
                    'low_stock_items' => $lowStockItems,
                    'top' => []
                ],
                'customers' => [
                    'total' => 0,
                    'new_month' => 0
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loading dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all products for the authenticated business user
     */
    public function getProducts(Request $request)
    {
        try {
            $products = Product::where('user_id', $request->user()->id)
                ->latest()
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'category' => $product->category,
                        'sku' => $product->sku ?: 'SKU-' . str_pad($product->id, 5, '0', STR_PAD_LEFT),
                        'price' => $product->price,
                        'stock' => $product->stock,
                        'min_stock' => $product->min_stock ?: 10,
                        'photo' => $product->photo ? asset('storage/' . $product->photo) : null,
                        'created_at' => $product->created_at,
                    ];
                });

            return response()->json([
                'products' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loading products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new product
     */
    public function createProduct(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'min_stock' => 'nullable|integer|min:0',
                'sku' => 'nullable|string|max:255',
                'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            ]);

            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('product_photos', 'public');
            }

            $product = Product::create([
                'user_id' => $request->user()->id,
                'name' => $validated['name'],
                'category' => $validated['category'],
                'price' => $validated['price'],
                'stock' => $validated['stock'],
                'min_stock' => $validated['min_stock'] ?? 10,
                'sku' => $validated['sku'] ?? null,
                'photo' => $photoPath,
            ]);

            return response()->json([
                'message' => 'Product created successfully',
                'product' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category,
                    'sku' => $product->sku,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'min_stock' => $product->min_stock,
                    'photo' => $product->photo ? asset('storage/' . $product->photo) : null,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a single product
     */
    public function getProduct(Request $request, $id)
    {
        try {
            $product = Product::where('user_id', $request->user()->id)
                ->where('id', $id)
                ->first();

            if (!$product) {
                return response()->json([
                    'message' => 'Product not found'
                ], 404);
            }

            return response()->json([
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category,
                'sku' => $product->sku,
                'price' => $product->price,
                'stock' => $product->stock,
                'min_stock' => $product->min_stock,
                'photo' => $product->photo ? asset('storage/' . $product->photo) : null,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error getting product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a product
     */
    public function updateProduct(Request $request, $id)
    {
        try {
            $product = Product::where('user_id', $request->user()->id)
                ->where('id', $id)
                ->first();

            if (!$product) {
                return response()->json([
                    'message' => 'Product not found'
                ], 404);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'category' => 'sometimes|string|max:255',
                'price' => 'sometimes|numeric|min:0',
                'stock' => 'sometimes|integer|min:0',
                'min_stock' => 'sometimes|integer|min:0',
                'sku' => 'sometimes|string|max:255',
                'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            ]);

            if ($request->hasFile('photo')) {
                // Delete old photo if exists
                if ($product->photo) {
                    Storage::disk('public')->delete($product->photo);
                }
                $validated['photo'] = $request->file('photo')->store('product_photos', 'public');
            }

            $product->update($validated);

            return response()->json([
                'message' => 'Product updated successfully',
                'product' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a product
     */
    public function deleteProduct(Request $request, $id)
    {
        try {
            $product = Product::where('user_id', $request->user()->id)
                ->where('id', $id)
                ->first();

            if (!$product) {
                return response()->json([
                    'message' => 'Product not found'
                ], 404);
            }

            // Delete photo if exists
            if ($product->photo) {
                Storage::disk('public')->delete($product->photo);
            }

            $product->delete();

            return response()->json([
                'message' => 'Product deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting product',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}