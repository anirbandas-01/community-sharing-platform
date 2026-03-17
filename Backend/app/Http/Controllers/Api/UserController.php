<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Services\SupabaseStorageService;

class UserController extends Controller
{

   protected $supabaseStorage;

    public function __construct(SupabaseStorageService $supabaseStorage)
    {
        $this->supabaseStorage = $supabaseStorage;
    } 
    public function profile(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }


    /* public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
        ]);

        $user = $request->user();

        $user->update($request->only([
            'name','phone','city','state'
        ]));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    } */ 


     public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:500',
            'bio' => 'nullable|string|max:1000',
            'profile_image' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        $user = $request->user();

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            try {   
           // Delete old image if exists
                if ($user->profile_image) {
                    $oldPath = $this->supabaseStorage->extractPath($user->profile_image);
                    if ($oldPath) {
                        $this->supabaseStorage->delete($oldPath);
                    }
                }

                // Upload new image
                $profileImageUrl = $this->supabaseStorage->upload(
                    $request->file('profile_image'),
                    'profiles'
                );

                $user->profile_image = $profileImageUrl;
            } catch (\Exception $e) {
                Log::error('Profile image update failed: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Failed to upload profile image',
                    'error' => $e->getMessage()
                ], 500);
            }
        }
        // Update other fields
        $user->update($request->only(['name', 'phone', 'city', 'address', 'bio']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $user = $request->user();

        try {
            // Delete old image if exists
            if ($user->profile_image) {
                $oldPath = $this->supabaseStorage->extractPath($user->profile_image);
                if ($oldPath)  {
                    $this->supabaseStorage->delete($oldPath);
                }
            }

            // Upload new image
            $profileImageUrl = $this->supabaseStorage->upload(
                $request->file('photo'),
                'profiles'
            );

            $user->profile_image = $profileImageUrl;
            $user->save();

            return response()->json([
                'message' => 'Profile photo uploaded successfully',
                'profile_image' => $profileImageUrl
            ]);
        } catch (\Exception $e) {
            Log::error('Photo upload error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to upload photo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if(!Hash::check($request->current_password, $user->password)){
            return response()->json([
                'message' => 'Current password is incorrect'
            ], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        $user->tokens()->delete();

        return response()->json([
            'message' => 'Password changed successfully. Please login again.'
        ]);
    }

    /* public function uploadPhoto (Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $user = $request->user();

        if($user->profile_image){
            Storage::disk('public')->delete($user->profile_image);
        }

        $path = $request->file('photo')->store('profile_photos', 'public');

        $user->profile_image = $path;
        $user->save();

        return response()->json([
            'message' => 'Profile photo uploaded successfully',
            'profile_image' => asset('storage/' .$path)
        ]);
    } */



    // GET /user/settings
public function getSettings(Request $request)
{
    // Return default settings
    return response()->json([
        'email_notifications' => true,
        'sms_notifications' => false,
        'push_notifications' => true,
        'booking_updates' => true,
        'community_updates' => true,
        'message_notifications' => true,
        'promotional_emails' => false,
        'profile_visibility' => 'public',
        'show_phone' => true,
        'show_email' => false,
        'show_address' => false,
        'language' => 'en',
        'timezone' => 'Asia/Kolkata',
        'theme' => 'light',
    ]);
}

// POST /user/settings
public function saveSettings(Request $request)
{
    // For now, just return success
    return response()->json(['message' => 'Settings saved successfully']);
}
}
