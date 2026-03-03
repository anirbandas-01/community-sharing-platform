<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
   public function register(Request $request)
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:users,email',
            'password'      => 'required|min:8|confirmed',
            'user_type'     => 'required|in:resident,professional,business',
            'phone'         => 'required|digits:10|unique:users,phone',
            'aadhaar'       => 'required|digits:12|unique:users,aadhaar',
            'city'          => 'required|string|max:255',
            'profile_image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
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

        return response()->json([
            'message' => 'User registered successfully',
            'user'    => $user
        ], 201);
    }






     public function login(Request $request)
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
    } 

 

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
