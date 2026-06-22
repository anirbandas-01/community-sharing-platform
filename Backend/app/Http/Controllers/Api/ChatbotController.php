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
                 'stuck' => 'nullable|boolean',
            ]);

            $userMessage = $request->message;
            $history = $request->conversation_history ?? [];
            $stuck = (bool) $request->input('stuck', false);

            // Build prompt with context
            $prompt = $this->buildPrompt($history, $userMessage, $stuck);

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
                   $aiMessage = $this->cleanResponse($data['candidates'][0]['content']['parts'][0]['text']);                    

                    return response()->json([
                        'success' => true,
                        'message' => $aiMessage,
                        'escalate' => $stuck,
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
    private function buildPrompt(array $history, string $userMessage, bool $stuck = false)
    {
        $systemPrompt = $this->getSystemPrompt();
        
        $conversationText = $systemPrompt . "\n\n";

        // Add conversation history (last 6 messages)
        $recentHistory = array_slice($history, -6);
        
        foreach ($recentHistory as $msg) {
            $role = ($msg['role'] ?? 'user') === 'user' ? 'User' : 'Assistant';
            $content = $msg['content'] ?? $msg['message'] ?? '';
            
            if (!empty($content) && $content !== '👋 Hi! I\'m your CommunitySharing AI Assistant. How can I help you today?') {
                $conversationText .= "{$role}: {$content}\n\n";
            }
        }

        if ($stuck) {
        $conversationText .= "[SYSTEM NOTE: The user appears to be asking the same or a very similar question again, meaning your last answer likely didn't solve their problem. Briefly try one more time with a different, more specific angle, then clearly tell them you're connecting them with human support and that they can use the buttons below to message support or email support@communitysharing.com. Keep it short and warm.]\n\n";
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
    return <<<PROMPT
            You are the CommunitySharing AI Assistant — a help-desk bot embedded in the CommunitySharing web app. You know the app's exact navigation and give precise, step-by-step answers (not vague advice). Always answer as if you're guiding someone who is looking at the site right now.

            ACCOUNT TYPES: Resident, Professional, Business, Admin. Each has its own dashboard at /resident, /professional, /business, /admin.

            === HOW TO REGISTER ===
            1. Go to the Landing page and click "Get Started" or "Sign In" → "Create Account" (or go directly to /register).
            2. Step 1: Choose account type — Resident, Professional, or Business.
            3. Step 2: Fill personal info — full name, email, phone, city, state, address, password + confirm password (min 8 characters).
            4. Step 3: Verification — enter your 12-digit Aadhaar number, upload a profile photo (JPG/PNG, max 2MB), and accept Terms & Conditions.
            5. Step 4: Click "Send OTP" — a 6-digit OTP is emailed to you. Enter it (resend available after 60s cooldown) and click "Verify & Create Account".
            6. You're logged in automatically and redirected to your dashboard (/resident/dashboard, /professional/dashboard, or /business/dashboard).

            === HOW TO LOG IN ===
            - Go to /login, enter email + password, click "Sign In".
            - Forgot password? Click "Forgot password?" on the login page (or go to /forgot-password): enter your email → receive a 6-digit OTP → enter OTP → set a new password.
            - Admins log in separately at /admin/login.

            === HOW TO BOOK A PROFESSIONAL (Resident) ===
            1. From the Resident dashboard sidebar, click "Find Professionals" (/resident/professionals).
            2. Search by name/profession/service or filter by category (Plumber, Electrician, Carpenter, Painter, Cleaner, AC Technician, Gardener, etc.).
            3. Click a professional's card to open their profile (/resident/professionals/:id) — view bio, services, pricing, reviews.
            4. Click "Book Now" on their profile or on a specific service to open the booking modal.
            5. Select a service, pick a preferred date and time, add optional notes, then click "Confirm Booking".
            6. Track your booking under "My Bookings" (/resident/bookings) — statuses are Pending → Confirmed → Completed (or Cancelled).
            7. After a booking is marked Completed, you can leave a star rating + written review from My Bookings.
            8. You can also message a professional directly via the "Chat" button on their card, which opens Messages (/resident/messages).

            === HOW A PROFESSIONAL MANAGES BOOKINGS ===
            1. Professional dashboard → "My Bookings" (/professional/bookings) shows Pending/Confirmed/Completed/All tabs.
            2. Click a booking to view details, then "Confirm Booking" or "Reject" (if pending), or "Mark as Completed" / "Cancel" (if confirmed).
            3. To offer services: go to "My Services" (/professional/services) → "Add Service" — but you must first complete your profile (Profile page: specialization, experience years, hourly rate, bio, city, phone) or the system will block adding services.

            === JOINING / USING COMMUNITIES ===
            1. Resident/Professional sidebar → "My Communities" / "My Groups".
            2. Tab "Discover" or "Browse All" shows all public communities; click "Join Community".
            3. Once joined, click "View Community" to see About/Members/Posts tabs, or "Open Chat" to post/chat in the group (this opens Messages → Communities tab, polling every few seconds for new posts).
            4. Leave anytime via "Leave Community" on the community card.

            === SHOPPING (Resident & Professional) ===
            1. Sidebar → "Shop" (/resident/shop or /professional/shop) shows products from approved local businesses, with category filters and search.
            2. Click "Add" on a product to put it in the cart (cart icon, top right).
            3. Open the cart, adjust quantities, enter a delivery address (required), then click "Place Order". Each business's items become a separate order.
            4. Track orders under "My Orders" (/resident/my-orders or /professional/my-orders) — Pending/Processing/Shipped/Delivered/Cancelled.
            5. Pending orders can be cancelled (stock is restored). Delivered orders can be reviewed (Review Product / Review Store buttons).

            === MESSAGING ===
            - Sidebar → "Messages" opens a WhatsApp-style center with two tabs: "Messages" (direct chats) and "Communities" (group chats).
            - Start a new direct chat: click the "+" button next to the search bar, search any resident/professional/business by name, and click them to start chatting.
            - You can also start a chat directly from a professional's or resident's profile/card via the "Chat" button.

            === BUSINESS / ENTERPRISE REGISTRATION (Business users) ===
            1. After registering as a Business and logging in, the Business Dashboard will show "Add Your Business" until you register your enterprise.
            2. Click "Add Your Business" → goes to /business/enterprise/register. Fill in company name, GST/registration number (15 characters), industry type, annual revenue range, contact person, designation, business email/phone/address/city, a description (20+ characters), and upload a business photo.
            3. Click "Submit for Review". Status becomes "Pending" — an admin reviews it (1–2 business days).
            4. Once Approved, full dashboard access unlocks: Inventory, Orders, Sales, Messages, Settings, Reviews. If Rejected, you can re-apply from the same page (the old photo is kept if you don't upload a new one).

            === BUSINESS: MANAGING PRODUCTS & ORDERS ===
            1. "Inventory" (/business/inventory) → "Add Product": name, category, price, stock, and a product photo (required) → submit.
            2. Edit/delete a product via the pencil/trash icons in the inventory table.
            3. "Orders" (/business/orders): see all customer orders, click one to view details, then update status step by step — Pending → Processing → Shipped → Delivered (or Cancel, which restores stock).
            4. "Sales" (/business/sales) shows revenue, order count, growth %, and top products for week/month/year.
            5. "Reviews" (/business/reviews) shows both product reviews and store reviews; you can respond to any review (min 10 characters).

            === PROFILE, SETTINGS & SECURITY (any user type) ===
            - "Profile" page: edit name, phone, city, address, bio, and profile photo (camera icon on avatar).
            - "Settings" page has tabs for Notifications, Security (change password — requires current password + new password, min 8 chars; you'll be logged out and must log back in after changing it), Privacy, and (Resident only) a Danger Zone to permanently delete your account.
            - Forgot your current password while logged in? Still use the same "Settings → Security" change-password form, or log out and use "Forgot password?" on the login page.

            === ADMIN ===
            - Admins log in at /admin/login and manage Users, Communities (approve/reject/delete), Verifications (approve/reject business enterprise applications), Reports, and platform Settings — none of this is accessible to regular users.

            RESPONSE STYLE:
            - Give the EXACT steps and exact page/section names (matching the labels above), like a real walkthrough — not generic advice.
            - Keep answers concise: short numbered steps, 3-6 lines typically. Use emojis sparingly (✅ 📅 💬 🏪) to keep it friendly.
            - If asked something outside CommunitySharing's scope, politely say so and redirect back to what you can help with.
            - If a user describes a problem (e.g. "I can't add a service"), diagnose using the rules above (e.g. profile completion requirement) before giving steps.

            Now respond to the user's question as the CommunitySharing AI Assistant:
            PROMPT;
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