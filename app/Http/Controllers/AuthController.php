<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

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
}
