<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;


class AuthController extends Controller
{

//Registration 
 public function register(Request $request)
    {

      $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'user_type' => 'required|in:resident,professional,business',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required|string',


        // Conditional validation based on user_type
            'profession' => 'required_if:user_type,professional|string|max:100',
            'specialization' => 'nullable|string|max:200',
            'qualification' => 'nullable|string|max:200',
            'experience_years' => 'nullable|integer|min:0|max:50',
            'license_number' => 'nullable|string|max:100',
            
            'business_name' => 'required_if:user_type,business|string|max:200',
            'business_type' => 'nullable|string|max:100',
            'business_category' => 'nullable|string|max:100',
            'registration_number' => 'nullable|string|max:100',

            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
          ]);

           if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Handle profile image upload
        $profileImageName = null;
        if ($request->hasFile('profile_image')) {
            $image = $request->file('profile_image');
            $profileImageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('public/profiles', $profileImageName);
        }

        // Create user with basic info
        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => $request->user_type,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'state' => $request->state,
            'zip_code' => $request->zip_code,
            'profile_image' => $profileImageName,
            'trust_score' => 100, // Starting trust score
        ];

        // Add professional-specific fields
        if ($request->user_type === 'professional') {
            $userData['profession'] = $request->profession;
            $userData['specialization'] = $request->specialization;
            $userData['qualification'] = $request->qualification;
            $userData['experience_years'] = $request->experience_years;
            $userData['license_number'] = $request->license_number;
        }

        // Add business-specific fields
        if ($request->user_type === 'business') {
            $userData['business_name'] = $request->business_name;
            $userData['business_type'] = $request->business_type;
            $userData['business_category'] = $request->business_category;
            $userData['registration_number'] = $request->registration_number;
            
            // Set default business hours if provided
            if ($request->opening_time) {
                $userData['opening_time'] = $request->opening_time;
            }
            if ($request->closing_time) {
                $userData['closing_time'] = $request->closing_time;
            }
        }

        // Create user
        $user = User::create($userData);

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registration successful!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'user_type' => $user->user_type,
                'display_name' => $user->getDisplayName(),
                'profile_image_url' => $user->getProfileImageUrl(),
                'is_professional' => $user->isProfessional(),
                'is_business' => $user->isBusiness(),
                'is_resident' => $user->isResident(),
            ],
            'token' => $token
        ], 201);
    }



//Login
    public function login(Request $request){
        $request->validate([
            'email'=>'required| email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if(!$user || !Hash::check($request->password, $user->password)){
            return response()->json([
                'success' => false,
                'message' => 'invalid email or password'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;


        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at
            ]
        ]);
    }

    public function user(Request $request){
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();


        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}
