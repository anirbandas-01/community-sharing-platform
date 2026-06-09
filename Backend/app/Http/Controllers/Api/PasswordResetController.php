<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\User;

/**
 * PasswordResetController
 *
 * Current flow  (no OTP):
 *   POST /forgot-password          → validateEmail()   — verifies email exists, returns a token
 *   POST /reset-password            → resetPassword()   — takes token + new password, saves it
 *
 * Future OTP flow (add later without breaking current flow):
 *   POST /forgot-password/send-otp  → sendOtp()        — sends a 6-digit OTP via SMS/email
 *   POST /forgot-password/verify-otp→ verifyOtp()      — checks OTP, returns the reset token
 *   POST /reset-password            → resetPassword()   — same as today, no changes needed here
 *
 * The token is stored as a bcrypt hash in users.reset_token so raw tokens are never in the DB.
 * Expiry is 15 minutes (TOKEN_TTL_MINUTES constant — change freely).
 */
class PasswordResetController extends Controller
{
    /** Token lifetime in minutes */
    private const TOKEN_TTL_MINUTES = 15;

    // ─────────────────────────────────────────────────────────────────────
    // STEP 1 — validate email and return a reset token
    // POST /forgot-password
    // Body: { "email": "user@example.com" }
    // ─────────────────────────────────────────────────────────────────────
    public function validateEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        // Always return 200 — never reveal whether the email exists (security best-practice).
        // The frontend shows a generic "if this email exists, a reset link has been sent" message.
        if (!$user) {
            return response()->json([
                'message' => 'If this email is registered, a reset token has been generated.',
            ]);
        }

        // Generate a plain token, hash it before storing
        $plainToken = Str::random(64);

        $user->reset_token            = hash('sha256', $plainToken);
        $user->reset_token_expires_at = now()->addMinutes(self::TOKEN_TTL_MINUTES);
        $user->save();

        // ──────────────────────────────────────────────────────────────────
        // NOTE: Right now we return the token directly so the frontend can
        //       redirect to /reset-password?token=XXX immediately.
        //
        //       When you add email sending later, remove the `token` key
        //       from this response, send an email with the link instead,
        //       and keep the generic message only.
        //
        //       When you add OTP, replace this block with sendOtp() below.
        // ──────────────────────────────────────────────────────────────────
        Log::info('Password reset token generated', ['email' => $user->email]);

        return response()->json([
            'message' => 'Token generated. Proceed to reset your password.',
            'token'   => $plainToken,   // Remove this line once you add email sending
            'email'   => $user->email,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────
    // STEP 2 — reset the password using the token
    // POST /reset-password
    // Body: { "token": "...", "email": "user@example.com",
    //         "password": "newpass", "password_confirmation": "newpass" }
    // ─────────────────────────────────────────────────────────────────────
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'                 => 'required|string',
            'email'                 => 'required|email',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired reset token.'], 400);
        }

        // Verify token hash
        if (!$user->reset_token || !hash_equals($user->reset_token, hash('sha256', $request->token))) {
            return response()->json(['message' => 'Invalid or expired reset token.'], 400);
        }

        // Check expiry
        if (!$user->reset_token_expires_at || now()->isAfter($user->reset_token_expires_at)) {
            return response()->json(['message' => 'Reset token has expired. Please request a new one.'], 400);
        }

        // All good — update password and clear the token
        $user->password               = Hash::make($request->password);
        $user->reset_token            = null;
        $user->reset_token_expires_at = null;
        $user->save();

        // Revoke all existing API tokens so old sessions can't be reused
        $user->tokens()->delete();

        Log::info('Password reset successful', ['email' => $user->email]);

        return response()->json([
            'message' => 'Password reset successfully. Please log in with your new password.',
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────
    // FUTURE — OTP stub (implement when ready)
    // POST /forgot-password/send-otp
    // ─────────────────────────────────────────────────────────────────────
    public function sendOtp(Request $request)
    {
        // TODO when implementing OTP:
        // 1. Validate email
        // 2. Generate 6-digit OTP: $otp = random_int(100000, 999999);
        // 3. Add `otp_code` and `otp_expires_at` columns to users (new migration)
        // 4. Store hashed OTP: $user->otp_code = hash('sha256', (string)$otp);
        // 5. Send via SMS (Twilio) or email (Laravel Mail)
        // 6. Return generic success — never return the OTP itself

        return response()->json(['message' => 'OTP feature not yet implemented.'], 501);
    }

    // ─────────────────────────────────────────────────────────────────────
    // FUTURE — OTP verify stub
    // POST /forgot-password/verify-otp
    // ─────────────────────────────────────────────────────────────────────
    public function verifyOtp(Request $request)
    {
        // TODO when implementing OTP:
        // 1. Validate email + otp
        // 2. Check hash_equals and expiry
        // 3. Clear OTP columns
        // 4. Generate and return a reset_token (same as validateEmail() above)
        // 5. Frontend then calls /reset-password with that token — no other changes needed

        return response()->json(['message' => 'OTP feature not yet implemented.'], 501);
    }
}