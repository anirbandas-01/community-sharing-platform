<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Services\SupabaseStorageService;

class AuthController extends Controller
{
    protected $supabaseStorage;

    public function __construct(SupabaseStorageService $supabaseStorage)
    {
        $this->supabaseStorage = $supabaseStorage;
    }

   /* public function register(Request $request)
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:users,email',
            'password'      => 'required|min:8|confirmed',
            'user_type'     => 'required|in:resident,professional,business',
            'phone'         => 'required|digits:10|unique:users,phone',
            'aadhaar'       => 'required|digits:12|unique:users,aadhaar',
            'city'          => 'required|string|max:255',
            'profile_image' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        // ---------- IMAGE UPLOAD ----------
        $image = $request->file('profile_image');
        $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
        $image->move(public_path('uploads/profiles'), $imageName);
        // ----------------------------------

        $user = User::create([
            'name'          => $request->name,
            'email'         => $request->email,
            'password'      => Hash::make($request->password), // ✅ bcrypt hash
            'user_type'     => $request->user_type,
            'phone'         => $request->phone,
            'aadhaar'       => $request->aadhaar,
            'city'          => $request->city,
            'profile_image' => $imageName,
            'profile_image_url' => asset('uploads/profiles/' . $imageName),
        ]);

        // ✅ Create token immediately
$token = $user->createToken('auth-token')->plainTextToken;

// ✅ Redirect based on role
$redirectUrl = match($user->user_type) {
    'professional' => '/professional/dashboard',
    'resident' => '/resident/dashboard',
    default => '/'
};

return response()->json([
    'message' => 'User registered successfully',
    'token' => $token,
    'user' => $user,
    'redirect_url' => $redirectUrl
], 201);
    } */


  public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8|confirmed',
                'user_type' => 'required|in:resident,professional,business',
                'phone' => 'required|string|max:20',
                'city' => 'required|string|max:100',
                'aadhaar' => 'required|string|size:12',
                'profile_image' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            ]);
          if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Handle profile image upload to Supabase
            $profileImageUrl = null;
            if ($request->hasFile('profile_image')) {
                try {
                    $profileImageUrl = $this->supabaseStorage->upload(
                        $request->file('profile_image'),
                        'profiles'
                    );
                } catch (\Exception $e) {
                    Log::error('Profile image upload failed: ' . $e->getMessage());
                    // Continue registration even if image upload fails
                }
            }

            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'user_type' => $request->user_type,
                'phone' => $request->phone,
                'city' => $request->city,
                'aadhaar' => $request->aadhaar,
                'profile_image' => $profileImageUrl, // Full Supabase URL
            ]);

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Determine redirect URL
            $redirectUrl = "/{$user->user_type}/dashboard";

            return response()->json([
              'message' => 'Registration successful',
                'user' => $user,
                'token' => $token,
                'redirect_url' => $redirectUrl
            ], 201);

        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }



     /* public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if(!Auth::attempt($request->only('email', 'password'))){
            return response()->json([
                'message'=>'Invalid login credentials'
            ],401);
        }

        $user = User::where('email', $request->email)->first();
        
        session([
            'user_id' => $user->id,
            'role' => $user->user_type,
            'name' => $user->name,
        ]);

        $user->tokens()->delete();

        $token = $user->createToken('api-token')->plainTextToken;
         
        $redirectUrl = match ($user->user_type)
        {
            'professional' => '/professional',
            'business' => '/business/dashboard',
            'resident' => '/resident/dashboard',
            default=> '/'
        };

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
            'user_type'=> $user->user_type,
            'redirect_url' => $redirectUrl
        ],200);
    }  */
   

        public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    // ✅ Find user
    $user = User::where('email', $credentials['email'])->first();

    // ✅ Check password with Hash::check (NOT Auth::attempt)
    if (!$user || !Hash::check($credentials['password'], $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    // ✅ Delete OLD tokens FIRST
    $user->tokens()->delete();

    // ✅ Create NEW token
    $token = $user->createToken('auth-token')->plainTextToken;

    // ❌ REMOVE THIS LINE (No sessions for API):
    // session(['user_id' => $user->id]); 

    return response()->json([
        'token' => $token,
        'user' => $user,
        'redirect_url' => match($user->user_type) {
            'professional' => '/professional/dashboard',
            'resident' => '/resident/dashboard',
            default => '/'
        }
    ]);
}
 

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }



/**
 * Admin login
 */
public function adminLogin(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    // Check if user is admin
    if ($user->user_type !== 'admin') {
        return response()->json([
            'message' => 'Unauthorized access'
        ], 403);
    }

    // Delete old tokens
    $user->tokens()->delete();

    // Create new token
    $token = $user->createToken('admin-token')->plainTextToken;

    return response()->json([
        'message' => 'Login successful',
        'token' => $token,
        'user' => $user,
        'redirect_url' => '/admin/dashboard'
    ]);
}
}
