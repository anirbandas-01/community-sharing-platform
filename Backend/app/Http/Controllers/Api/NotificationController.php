<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    /**
     * GET /notifications
     * Returns the latest 30 notifications for the authenticated user.
     */
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->latest()
            ->limit(30)
            ->get()
            ->map(fn($n) => $this->format($n));

        $unreadCount = Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count'  => $unreadCount,
        ]);
    }

    /**
     * GET /notifications/count
     * Lightweight poll endpoint — only returns the unread count.
     * Frontend polls this every 15 s to update the bell badge.
     */
    public function count(Request $request)
    {
        $count = Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['unread_count' => $count]);
    }

    /**
     * PUT /notifications/{id}/read
     * Mark a single notification as read.
     */
    public function markRead(Request $request, $id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $notification->markRead();

        return response()->json(['message' => 'Marked as read']);
    }

    /**
     * PUT /notifications/read-all
     * Mark every unread notification as read for this user.
     */
    public function markAllRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * DELETE /notifications/{id}
     * Delete a single notification.
     */
    public function destroy(Request $request, $id)
    {
        Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json(['message' => 'Notification deleted']);
    }

    /**
     * DELETE /notifications
     * Clear all notifications for this user.
     */
    public function clearAll(Request $request)
    {
        Notification::where('user_id', $request->user()->id)->delete();

        return response()->json(['message' => 'All notifications cleared']);
    }

    // ── Private ───────────────────────────────────────────────────────────

    private function format(Notification $n): array
    {
        return [
            'id'         => $n->id,
            'type'       => $n->type,
            'title'      => $n->title,
            'body'       => $n->body,
            'link'       => $n->link,
            'meta'       => $n->meta,
            'is_read'    => $n->is_read,
            'icon_info'  => \App\Models\Notification::iconFor($n->type),
            'time'       => $n->created_at->diffForHumans(),
            'time_full'  => $n->created_at->format('M d, Y h:i A'),
        ];
    }
}