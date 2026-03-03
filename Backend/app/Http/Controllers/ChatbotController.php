<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatbotController extends Controller
{
    /**
     * Handle chatbot message and get AI response
     */
    public function sendMessage(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        try {
            // Send request to OpenRouter API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer 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',
                'Content-Type' => 'application/json'
            ])->timeout(30)->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => 'mistralai/mistral-7b-instruct',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a helpful AI assistant for LocalHub, a local business and community platform. Provide helpful, concise, and friendly responses.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $request->message
                    ]
                ]
            ]);

            // Check if request was successful
            if ($response->successful()) {
                return response()->json($response->json());
            } else {
                return response()->json([
                    'error' => 'Failed to get response from AI service'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while processing your request',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
