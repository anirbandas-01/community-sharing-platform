<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;


class AuthController extends Controller
{

//Registration 
 public function register(Request $request)
    {
        //validate user input
       $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed','min:6', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name'=> $validated['name'],
            'email'=> $validated['email'],
            'password'=> Hash::make($validated['password']),
        ]);


          return response()->json([
            'success'=>true,
            'message' => 'Registration successfully',
            'user' => [
                'id'=> $user->id,
                'name'=>$user->name,
                'email'=>$user->email
            ]
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
