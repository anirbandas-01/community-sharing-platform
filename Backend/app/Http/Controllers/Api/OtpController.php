<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\OtpPending;
use App\Models\User;
use App\Mail\OtpMail;

class OtpController extends Controller
{
    private const OTP_TTL_MINUTES = 10;

    // ── REGISTRATION: Step 1 — Send OTP ─────────────────────────────────────

    /**
     * POST /otp/send-registration
     * Body: { email, phone, name, ... (all registration fields except profile_image) }
     * Stores payload in otp_pending, sends OTP to email.
     */
    public function sendRegistrationOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email',
            'password'              => 'required|string|min:8|confirmed',
            'user_type'             => 'required|in:resident,professional,business',
            'phone'                 => 'required|string|max:20',
            'city'                  => 'required|string|max:100',
            'state'                 => 'required|string|max:100',
            'address'               => 'required|string|max:500',
            'aadhaar'               => 'required|string|size:12',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // Check email uniqueness
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => ['email' => ['This email is already registered.']],
            ], 422);
        }

        $otp = $this->generateOtp();

        // Delete any previous pending OTP for this email
        OtpPending::where('identifier', $request->email)
            ->where('purpose', 'registration')
            ->delete();

        // Store OTP + full payload (excluding file — handled at verify step)
        OtpPending::create([
            'identifier'      => $request->email,
            'identifier_type' => 'email',
            'otp_code'        => hash('sha256', $otp),
            'otp_expires_at'  => now()->addMinutes(self::OTP_TTL_MINUTES),
            'purpose'         => 'registration',
            'payload'         => [
                'name'      => $request->name,
                'email'     => $request->email,
                'password'  => $request->password, // already hashed
                'user_type' => $request->user_type,
                'phone'     => $request->phone,
                'city'      => $request->city,
                'state'     => $request->state,
                'address'   => $request->address,
                'aadhaar'   => $request->aadhaar,
            ],
        ]);

        // Send OTP email
        try {
            Mail::to($request->email)->send(new OtpMail($otp, 'registration'));
        } catch (\Exception $e) {
            Log::error('OTP email failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to send OTP email. Please try again.',
            ], 500);
        }

        Log::info('Registration OTP sent', ['email' => $request->email]);

        return response()->json([
            'message' => 'OTP sent to your email address.',
            'email'   => $request->email,
        ]);
    }

    // ── REGISTRATION: Step 2 — Verify OTP + Create Account ──────────────────

    /**
     * POST /otp/verify-registration
     * Body: multipart — otp (string), email (string), profile_image (file)
     */
    public function verifyRegistrationOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'otp'           => 'required|string',
            'email'         => 'required|email',
            'profile_image' => 'required|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $pending = OtpPending::where('identifier', $request->email)
            ->where('purpose', 'registration')
            ->first();

        if (!$pending) {
            return response()->json(['message' => 'No OTP request found. Please start over.'], 400);
        }

        if (!hash_equals($pending->otp_code, hash('sha256', $request->otp))) {
            return response()->json(['message' => 'Invalid OTP. Please check and try again.'], 400);
        }

        if (now()->isAfter($pending->otp_expires_at)) {
            $pending->delete();
            return response()->json(['message' => 'OTP has expired. Please request a new one.'], 400);
        }

        // Double-check email not taken (race condition guard)
        if (User::where('email', $request->email)->exists()) {
            $pending->delete();
            return response()->json(['message' => 'This email is already registered.'], 422);
        }

        // Upload profile image
        $profileImageUrl = null;
        if ($request->hasFile('profile_image')) {
            try {
                $supabase = app(\App\Services\SupabaseStorageService::class);
                $profileImageUrl = $supabase->upload(
                    $request->file('profile_image'),
                    'profiles'
                );
            } catch (\Exception $e) {
                Log::error('Profile image upload failed: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Profile image upload failed: ' . $e->getMessage(),
                ], 500);
            }
        }

        $payload = $pending->payload;

        // Create user — password is already bcrypt-hashed in payload
        $user = new User($payload);
        $user->profile_image = $profileImageUrl;
        $user->save();

        // Clean up OTP record
        $pending->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Registration successful',
            'user'         => $user,
            'token'        => $token,
            'redirect_url' => "/{$user->user_type}/dashboard",
        ], 201);
    }

    // ── RESEND OTP ───────────────────────────────────────────────────────────

    /**
     * POST /otp/resend
     * Body: { email, purpose: 'registration'|'password_reset' }
     */
    public function resend(Request $request)
    {
        $request->validate([
            'email'   => 'required|email',
            'purpose' => 'required|in:registration,password_reset',
        ]);

        $pending = OtpPending::where('identifier', $request->email)
            ->where('purpose', $request->purpose)
            ->first();

        if (!$pending) {
            return response()->json(['message' => 'No pending OTP session found.'], 400);
        }

        $otp = $this->generateOtp();
        $pending->otp_code      = hash('sha256', $otp);
        $pending->otp_expires_at = now()->addMinutes(self::OTP_TTL_MINUTES);
        $pending->save();

        try {
            Mail::to($request->email)->send(new OtpMail($otp, $request->purpose));
        } catch (\Exception $e) {
            Log::error('OTP resend failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to resend OTP.'], 500);
        }

        return response()->json(['message' => 'OTP resent successfully.']);
    }

    // ── PASSWORD RESET: Send OTP ─────────────────────────────────────────────

    /**
     * POST /otp/send-password-reset
     * Body: { email }
     */
    public function sendPasswordResetOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        // Security: always return 200 to avoid email enumeration
        if (!$user) {
            return response()->json([
                'message' => 'If this email is registered, an OTP has been sent.',
            ]);
        }

        $otp = $this->generateOtp();

        OtpPending::where('identifier', $request->email)
            ->where('purpose', 'password_reset')
            ->delete();

        OtpPending::create([
            'identifier'      => $request->email,
            'identifier_type' => 'email',
            'otp_code'        => hash('sha256', $otp),
            'otp_expires_at'  => now()->addMinutes(self::OTP_TTL_MINUTES),
            'purpose'         => 'password_reset',
            'payload'         => null,
        ]);

        try {
            Mail::to($request->email)->send(new OtpMail($otp, 'password_reset'));
        } catch (\Exception $e) {
            Log::error('Password reset OTP email failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to send OTP. Please try again.'], 500);
        }

        Log::info('Password reset OTP sent', ['email' => $request->email]);

        return response()->json([
            'message' => 'If this email is registered, an OTP has been sent.',
            'email'   => $request->email,
        ]);
    }

    // ── PASSWORD RESET: Verify OTP ───────────────────────────────────────────

    /**
     * POST /otp/verify-password-reset
     * Body: { email, otp }
     * Returns a reset token valid for the /reset-password endpoint.
     */
    public function verifyPasswordResetOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp'   => 'required|string',
        ]);

        $pending = OtpPending::where('identifier', $request->email)
            ->where('purpose', 'password_reset')
            ->first();

        if (!$pending) {
            return response()->json(['message' => 'No OTP request found. Please request a new OTP.'], 400);
        }

        if (!hash_equals($pending->otp_code, hash('sha256', $request->otp))) {
            return response()->json(['message' => 'Invalid OTP. Please try again.'], 400);
        }

        if (now()->isAfter($pending->otp_expires_at)) {
            $pending->delete();
            return response()->json(['message' => 'OTP has expired. Please request a new one.'], 400);
        }

        // OTP valid — generate a reset token and store on the user
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $plainToken = \Illuminate\Support\Str::random(64);
        $user->reset_token            = hash('sha256', $plainToken);
        $user->reset_token_expires_at = now()->addMinutes(15);
        $user->save();

        // Clean up OTP record
        $pending->delete();

        return response()->json([
            'message' => 'OTP verified successfully.',
            'token'   => $plainToken,
            'email'   => $request->email,
        ]);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private function generateOtp(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }
}