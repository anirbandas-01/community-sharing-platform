<?php

namespace App\Http\Controllers;

use App\Models\Tool;
use Illuminate\Http\Request;

class ToolController extends Controller{
    public function index()
    {
        $tools = Tool::with('owner')->get();
        return response()->json($tools);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'=> 'required|string|max:255',
            'description' => 'required',
            'price_per_day' => 'nullable|numeric'
        ]);

        $tool = Tool::create([
            'name'=> $request->name,
            'description' => $request->description,
            'price_per_day' => $request->price_per_day,
            'user_id'=>auth()->id()
        ]);

        return response()->json($tool, 201);
    }

}