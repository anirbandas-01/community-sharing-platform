<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        //validate user input
        $request-> validate([
            'name'=>'required',
            'email'=> 'required|email|unique:users',
            'password'=>'required|min:6'
        ]);

        $user = User::create([
            'name'=> $request->name,
            'email'=> $request->email,
            'password'=> bcrypt($request->password)
        ]);


          return response()->json([
            'message' => 'User created successfully',
            'user' => $user
          ], 201);
    }



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
