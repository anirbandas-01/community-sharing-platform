<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Enterprise;  
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class EnterpriseController extends Controller
{
     public function store(Request $request)
    {
        $user = $request->user();
 
        // Allow re-apply only if rejected (or no enterprise yet).
        // Pending and approved are blocked.
        $existing = $user->enterprise;
 
        if ($existing) {
            if ($existing->status === 'approved') {
                return response()->json([
                    'message' => 'Enterprise is already approved.'
                ], 403);
            }
 
            if ($existing->status === 'pending') {
                return response()->json([
                    'message' => 'Your application is still under review.'
                ], 403);
            }
 
            // status === 'rejected' — fall through to update
        }
 
        // Validate
        $validated = $request->validate([
            'companyName'        => 'required|string|max:255',
            'registrationNumber' => 'required|string|max:100',
            'industryType'       => 'required|string',
            'revenue'            => 'required|string',
            'contactPerson'      => 'required|string|max:255',
            'designation'        => 'required|string|max:255',
            'email'              => 'required|email',
            'phone'              => 'required|digits:10',
            'address'            => 'required|string',
            'city'               => 'required|string|max:100',
            'description'        => 'required|string',
            // Photo is required only on first registration; optional on re-apply
            'photo'              => ($existing ? 'nullable' : 'required') . '|image|mimes:jpg,jpeg,png|max:5120',
        ]);
 
        // Handle photo
        $photoPath = $existing?->enterprise_photo; // keep old photo by default
        if ($request->hasFile('photo')) {
            // Delete old photo if it exists
            if ($existing && $existing->enterprise_photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($existing->enterprise_photo);
            }
            $photoPath = $request->file('photo')->store('enterprise_photos', 'public');
        }
 
        $data = [
            'company_name'        => $validated['companyName'],
            'registration_number' => $validated['registrationNumber'],
            'industry_type'       => $validated['industryType'],
            'annual_revenue'      => $validated['revenue'],
            'contact_person'      => $validated['contactPerson'],
            'designation'         => $validated['designation'],
            'email'               => $validated['email'],
            'phone'               => $validated['phone'],
            'address'             => $validated['address'],
            'city'                => $validated['city'],
            'description'         => $validated['description'],
            'enterprise_photo'    => $photoPath,
            'status'              => 'pending',   // reset to pending on re-apply
        ];
 
        if ($existing) {
            $existing->update($data);
        } else {
            \App\Models\Enterprise::create(array_merge($data, ['user_id' => $user->id]));
        }
 
        return response()->json([
            'message' => $existing
                ? 'Re-application submitted. Awaiting admin review.'
                : 'Enterprise registered successfully.',
            'status'  => 'pending',
        ], $existing ? 200 : 201);
    }
 


    public function show(Request $request)
    {
        $enterprise = $request->user()->enterprise;

        if (!$enterprise) {
            return response()->json(['message' => 'No enterprise'], 404);
        }

        $enterprise->enterprise_photo_url = $enterprise->enterprise_photo
            ? asset('storage/' . $enterprise->enterprise_photo)
            : null;

        return response()->json($enterprise);
    }

    public function index()
    {
        return Enterprise::latest()->get();
    }

}

