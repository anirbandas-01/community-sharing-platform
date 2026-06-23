<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewSupportTicketMail;
use App\Mail\SupportTicketReplyMail;
use App\Models\Community;
use App\Models\SupportTicket;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\PersonalAccessToken;

class SupportController extends Controller
{
    /**
     * Resolve the authenticated user from the bearer token if one is
     * present, without requiring the route to use auth:sanctum middleware.
     * This lets the same public endpoint work for guests AND logged-in users.
     */
    private function resolveOptionalUser(Request $request)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return null;
        }

        $accessToken = PersonalAccessToken::findToken($token);
        return $accessToken?->tokenable;
    }

    /**
     * POST /support/contact
     * Universal "Contact Admin" endpoint — works for guests AND logged-in
     * residents / professionals / businesses. Optionally tied to a community
     * (e.g. the "Contact Admin" button on a community's page).
     */
    public function contact(Request $request)
    {
        $validated = $request->validate([
            'name'         => 'nullable|string|max:255',
            'email'        => 'nullable|email|max:255',
            'subject'      => 'nullable|string|max:255',
            'message'      => 'required|string|max:3000',
            'community_id' => 'nullable|integer|exists:communities,id',
            'type'         => 'nullable|in:platform,community',
        ]);

        $user = $this->resolveOptionalUser($request); // null for guests

        if (!$user && (empty($validated['name']) || empty($validated['email']))) {
            return response()->json([
                'message' => 'Name and email are required.',
                'errors'  => [
                    'name'  => empty($validated['name']) ? ['Name is required'] : [],
                    'email' => empty($validated['email']) ? ['Email is required'] : [],
                ],
            ], 422);
        }


        $ticket = SupportTicket::create([
            'user_id'      => $user?->id,
            'name'         => $user?->name ?? $validated['name'],
            'email'        => $user?->email ?? $validated['email'],
            'subject'      => $validated['subject'] ?? null,
            'message'      => $validated['message'],
            'type'         => $validated['community_id'] ? 'community' : ($validated['type'] ?? 'platform'),
            'community_id' => $validated['community_id'] ?? null,
            'status'       => 'open',
        ]);

        // Notify all platform admins in-app
        try {
            NotificationService::supportTicketCreated($ticket);
        } catch (\Exception $e) {
            Log::warning('Could not create in-app notification for support ticket', ['error' => $e->getMessage()]);
        }

        // Email the admin inbox
        try {
            $adminEmail = config('services.admin_support.email');
            $adminName  = config('services.admin_support.name');
            Mail::to($adminEmail, $adminName)->send(new NewSupportTicketMail($ticket));
        } catch (\Exception $e) {
            Log::error('Failed to email admin about new support ticket', ['error' => $e->getMessage()]);
        }

        return response()->json([
            'message' => "Thanks! Your message has been sent to the admin team. We'll get back to you soon.",
            'ticket'  => $ticket,
        ], 201);
    }

    /**
     * GET /admin/support — list all tickets (admin inbox)
     */
    public function index(Request $request)
    {
        $query = SupportTicket::with(['user', 'community']);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('message', 'LIKE', "%{$search}%")
                  ->orWhere('subject', 'LIKE', "%{$search}%");
            });
        }

        $tickets = $query->latest()->get()->map(function ($t) {
            return [
                'id'           => $t->id,
                'name'         => $t->name,
                'email'        => $t->email,
                'subject'      => $t->subject,
                'message'      => $t->message,
                'type'         => $t->type,
                'status'       => $t->status,
                'community'    => $t->community ? ['id' => $t->community->id, 'name' => $t->community->name] : null,
                'user'         => $t->user ? ['id' => $t->user->id, 'user_type' => $t->user->user_type] : null,
                'admin_reply'  => $t->admin_reply,
                'replied_at'   => $t->replied_at?->format('M d, Y h:i A'),
                'created_at'   => $t->created_at->format('M d, Y h:i A'),
            ];
        });

        return response()->json([
            'tickets' => $tickets,
            'counts'  => [
                'all'         => SupportTicket::count(),
                'open'        => SupportTicket::where('status', 'open')->count(),
                'in_progress' => SupportTicket::where('status', 'in_progress')->count(),
                'resolved'    => SupportTicket::where('status', 'resolved')->count(),
            ],
        ]);
    }

    /**
     * PUT /admin/support/{id} — update status (e.g. mark in_progress/resolved)
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:open,in_progress,resolved',
        ]);

        $ticket = SupportTicket::findOrFail($id);
        $ticket->update(['status' => $validated['status']]);

        return response()->json(['message' => 'Ticket updated', 'ticket' => $ticket]);
    }

    /**
     * POST /admin/support/{id}/reply — admin replies, ticket is emailed to the user
     */
    public function reply(Request $request, $id)
    {
        $validated = $request->validate([
            'reply' => 'required|string|max:3000',
        ]);

        $ticket = SupportTicket::findOrFail($id);
        $ticket->update([
            'admin_reply' => $validated['reply'],
            'status'      => 'resolved',
            'replied_by'  => $request->user()->id,
            'replied_at'  => now(),
        ]);

        try {
            Mail::to($ticket->email, $ticket->name)->send(new SupportTicketReplyMail($ticket));
        } catch (\Exception $e) {
            Log::error('Failed to email support reply', ['error' => $e->getMessage()]);
        }

        // Notify the user in-app if they have an account
        if ($ticket->user_id) {
            try {
                NotificationService::supportTicketReplied($ticket);
            } catch (\Exception $e) {
                Log::warning('Could not create in-app reply notification', ['error' => $e->getMessage()]);
            }
        }

        return response()->json(['message' => 'Reply sent successfully', 'ticket' => $ticket]);
    }

    public function destroy($id)
    {
        SupportTicket::findOrFail($id)->delete();
        return response()->json(['message' => 'Ticket deleted']);
    }
}
