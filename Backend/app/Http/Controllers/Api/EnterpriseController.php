<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Enterprise;  
use App\Models\User;
use App\Models\Product;

class EnterpriseController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        // HARD STOP: already registered
        if ($user->enterprise) {
            return response()->json([
                'message' => 'Enterprise already registered'
            ], 403);
        }

        // validate
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

            'photo'              => 'required|image|mimes:jpg,jpeg,png|max:5120'
        ]);

        // store image
        $photoPath = $request->file('photo')
                             ->store('enterprise_photos', 'public');

        // create enterprise
        Enterprise::create([
            'user_id'             => $user->id,
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
            'status'              => 'pending'
        ]);

        return response()->json([
            'message' => 'Enterprise registered successfully',
            'status'  => 'pending'
        ], 201);
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

    protected $table = 'enterprise';

    protected $fillable = [
        'user_id','business_name','category','status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }


}

