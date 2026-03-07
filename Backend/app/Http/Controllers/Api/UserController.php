<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function profile(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }


    public function updateProfile(Request $request)
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

    public function uploadPhoto (Request $request)
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
    }



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
