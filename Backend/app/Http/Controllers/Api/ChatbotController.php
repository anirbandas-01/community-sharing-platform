<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class ChatbotController extends Controller
{
    /**
     * Send message to AI chatbot using Google Gemini
     */
    public function sendMessage(Request $request)
    {
        try {
            $request->validate([
                'message' => 'required|string|max:1000',
                'conversation_history' => 'nullable|array',
            ]);

            $userMessage = $request->message;
            $history = $request->conversation_history ?? [];

            // Build prompt with context
            $prompt = $this->buildPrompt($history, $userMessage);

            // Get API key from config
            $apiKey = config('services.gemini.api_key');

            if (empty($apiKey)) {
                throw new \Exception('Gemini API key not configured');
            }

            // Call Google Gemini API with CORRECT model name
            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post(
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}",
                    [
                        'contents' => [
                            [
                                'parts' => [
                                    ['text' => $prompt]
                                ]
                            ]
                        ],
                        'generationConfig' => [
                            'temperature' => 0.9,
                            'topK' => 40,
                            'topP' => 0.95,
                            'maxOutputTokens' => 2048,
                        ],
                        'safetySettings' => [
                            [
                                'category' => 'HARM_CATEGORY_HARASSMENT',
                                'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                            ],
                            [
                                'category' => 'HARM_CATEGORY_HATE_SPEECH',
                                'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                            ],
                            [
                                'category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                                'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                            ],
                            [
                                'category' => 'HARM_CATEGORY_DANGEROUS_CONTENT',
                                'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                            ],
                        ]
                    ]
                );

            Log::info('Gemini API Response', [
                'status' => $response->status(),
                'successful' => $response->successful()
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // Extract AI message from response
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    $aiMessage = $data['candidates'][0]['content']['parts'][0]['text'];
                    $aiMessage = $this->cleanResponse($aiMessage);

                    return response()->json([
                        'success' => true,
                        'message' => $aiMessage,
                        'timestamp' => now()->toIso8601String(),
                    ]);
                }

                // Check for blocked content
                if (isset($data['promptFeedback']['blockReason'])) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Sorry, I cannot respond to that message. Please rephrase your question.',
                    ], 400);
                }

                throw new \Exception('No valid response from Gemini API');
            }

            // Handle errors
            $errorData = $response->json();
            $errorMessage = $errorData['error']['message'] ?? 'Unknown error';
            
            Log::error('Gemini API Error', [
                'status' => $response->status(),
                'error' => $errorData
            ]);

            throw new \Exception("Gemini API Error: {$errorMessage}");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('Chatbot error', [
                'message' => $e->getMessage(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Sorry, I encountered an error. Please try again.',
                'debug' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Build prompt with conversation history
     */
    private function buildPrompt(array $history, string $userMessage)
    {
        $systemPrompt = $this->getSystemPrompt();
        
        $conversationText = $systemPrompt . "\n\n";

        // Add conversation history (last 6 messages)
        $recentHistory = array_slice($history, -6);
        
        foreach ($recentHistory as $msg) {
            $role = ($msg['role'] ?? 'user') === 'user' ? 'User' : 'Assistant';
            $content = $msg['content'] ?? $msg['message'] ?? '';
            
            if (!empty($content) && $content !== '👋 Hi! I\'m your LocalHub AI Assistant. How can I help you today?') {
                $conversationText .= "{$role}: {$content}\n\n";
            }
        }

        // Add current user message
        $conversationText .= "User: {$userMessage}\n\n";
        $conversationText .= "Assistant:";

        return $conversationText;
    }

    /**
     * System prompt
     */
    private function getSystemPrompt()
    {
        return "You are LocalHub AI Assistant, a helpful and friendly chatbot for LocalHub - a community platform connecting residents with local professionals.

**About LocalHub:**
- Connects residents with verified professionals (plumbers, electricians, carpenters, cleaners, painters, gardeners, AC technicians)
- Enables community groups for neighborhoods
- Provides secure booking and payment system
- Features reviews and ratings

**Your Role:**
1. Help users understand LocalHub features
2. Guide residents on booking professionals
3. Assist professionals with service management
4. Explain communities, reviews, and payments
5. Be friendly, concise, and helpful

**Response Style:**
- Keep answers brief (2-4 sentences)
- Use emojis occasionally (✅ 🏠 💼 👍)
- Be encouraging and supportive
- Provide step-by-step help when needed

Now respond to user questions as LocalHub AI Assistant:";
    }

    /**
     * Clean response
     */
    private function cleanResponse(string $response)
    {
        $response = preg_replace('/\n{3,}/', "\n\n", $response);
        $response = trim($response);
        return $response;
    }

    /**
     * Get suggested questions
     */
    public function getSuggestedQuestions()
    {
        return response()->json([
            'questions' => [
                'How do I book a professional?',
                'What services are available?',
                'How do I join a community?',
                'How does payment work?',
                'Can I leave reviews?',
                'How do I update my profile?',
            ]
        ]);
    }

    /**
     * Health check
     */
    public function healthCheck()
    {
        $apiKey = config('services.gemini.api_key');
        
        return response()->json([
            'status' => 'ok',
            'api_configured' => !empty($apiKey),
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}