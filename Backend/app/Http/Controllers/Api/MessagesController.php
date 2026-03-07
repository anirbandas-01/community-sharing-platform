<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MessagesController extends Controller
{
    // GET /messages/conversations
    public function conversations(Request $request)
    {
        // Return empty for now
        return response()->json(['conversations' => []]);
    }

    // GET /messages/conversations/{id}
    public function messages(Request $request, $id)
    {
        // Return empty for now
        return response()->json(['messages' => []]);
    }

    // POST /messages
    public function send(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required',
            'message' => 'required|string'
        ]);

        return response()->json(['message' => 'Message sent successfully']);
    }
}