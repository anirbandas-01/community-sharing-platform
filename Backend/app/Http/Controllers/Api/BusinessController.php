<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\Product;
use App\Models\Enterprise;
use App\Models\User;

class BusinessController extends Controller
{
    /**
     * Get business profile
     */
    public function getProfile(Request $request)
    {
        try {
            $user = $request->user();
            
            // Get enterprise data if exists
            $enterprise = Enterprise::where('user_id', $user->id)->first();
            
            $profile = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'city' => $user->city,
                'state' => $user->state,
                'address' => $user->address,
                'profile_image' => $user->profile_image,
                'user_type' => $user->user_type,
            ];

            // Add enterprise data if exists
            if ($enterprise) {
                $profile['enterprise'] = [
                    'company_name' => $enterprise->company_name,
                    'registration_number' => $enterprise->registration_number,
                    'industry_type' => $enterprise->industry_type,
                    'annual_revenue' => $enterprise->annual_revenue,
                    'contact_person' => $enterprise->contact_person,
                    'designation' => $enterprise->designation,
                    'description' => $enterprise->description,
                    'enterprise_photo' => $enterprise->enterprise_photo ? asset('storage/' . $enterprise->enterprise_photo) : null,
                    'status' => $enterprise->status,
                ];
            }

            return response()->json($profile);
        } catch (\Exception $e) {
            Log::error('Get business profile error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error loading profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update business profile
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();
            
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|string|max:20',
                'city' => 'sometimes|string|max:100',
                'state' => 'sometimes|string|max:100',
                'address' => 'sometimes|string|max:500',
            ]);

            $user->update($validated);

            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('Update business profile error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dashboard data
     */
    public function getDashboard(Request $request)
    {
        try {
            $userId = $request->user()->id;
            
            // Get products
            $products = Product::where('user_id', $userId)->get();
            $totalProducts = $products->count();
            $lowStockCount = $products->where('stock', '<=', 10)->where('stock', '>', 0)->count();
            $outOfStockCount = $products->where('stock', 0)->count();
            
            // Calculate total inventory value
            $totalValue = $products->sum(function($product) {
                return $product->stock * $product->price;
            });

            // Mock data for orders, revenue, customers (replace with real data later)
            $dashboard = [
                'revenue' => [
                    'total' => 0,
                    'change' => '+0%',
                ],
                'orders' => [
                    'pending' => 0,
                    'new_today' => 0,
                    'recent' => [],
                ],
                'products' => [
                    'total' => $totalProducts,
                    'low_stock' => $lowStockCount,
                    'low_stock_items' => $products->where('stock', '<=', 10)->where('stock', '>', 0)->take(5)->map(function($p) {
                        return [
                            'name' => $p->name,
                            'current' => $p->stock,
                            'minimum' => 10,
                        ];
                    })->values(),
                    'top' => [],
                ],
                'customers' => [
                    'total' => 0,
                    'new_month' => 0,
                ],
            ];

            return response()->json($dashboard);
        } catch (\Exception $e) {
            Log::error('Get business dashboard error: ' . $e->getMessage());
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
                        'price' => $product->price,
                        'stock' => $product->stock,
                        'min_stock' => 10, // Default minimum stock level
                        'sku' => 'SKU-' . str_pad($product->id, 5, '0', STR_PAD_LEFT),
                        'photo' => $product->photo ? asset('storage/' . $product->photo) : null,
                        'created_at' => $product->created_at->format('Y-m-d'),
                    ];
                });

            return response()->json([
                'products' => $products
            ]);
        } catch (\Exception $e) {
            Log::error('Get products error: ' . $e->getMessage());
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
                'photo' => 'required|image|mimes:jpg,jpeg,png|max:5120',
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
                'photo' => $photoPath,
            ]);

            return response()->json([
                'message' => 'Product created successfully',
                'product' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'photo' => $product->photo ? asset('storage/' . $product->photo) : null,
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Create product error: ' . $e->getMessage());
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
                'price' => $product->price,
                'stock' => $product->stock,
                'photo' => $product->photo ? asset('storage/' . $product->photo) : null,
            ]);
        } catch (\Exception $e) {
            Log::error('Get product error: ' . $e->getMessage());
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
            Log::error('Update product error: ' . $e->getMessage());
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
            Log::error('Delete product error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get orders (mock data for now)
     */
    public function getOrders(Request $request)
    {
        try {
            // Mock data - replace with real orders later
            $orders = [];

            return response()->json([
                'orders' => $orders
            ]);
        } catch (\Exception $e) {
            Log::error('Get orders error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error loading orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sales data (mock data for now)
     */
    public function getSales(Request $request)
    {
        try {
            $period = $request->query('period', 'week');
            
            // Mock data - replace with real sales later
            $salesData = [
                'revenue' => [
                    'total' => 0,
                ],
                'orders' => [
                    'total' => 0,
                ],
                'avg_order_value' => 0,
                'growth' => 0,
                'daily_sales' => [],
                'top_products' => [],
            ];

            return response()->json($salesData);
        } catch (\Exception $e) {
            Log::error('Get sales error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error loading sales',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}