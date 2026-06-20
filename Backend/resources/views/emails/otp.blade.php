<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px 24px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 24px; }
        .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
        .body { padding: 32px 24px; }
        .otp-box { background: #f0f0ff; border: 2px dashed #6366f1; border-radius: 12px; text-align: center; padding: 24px; margin: 24px 0; }
        .otp-code { font-size: 40px; font-weight: 800; letter-spacing: 10px; color: #6366f1; font-family: monospace; }
        .note { font-size: 13px; color: #6b7280; text-align: center; margin-top: 8px; }
        .footer { background: #f9fafb; padding: 16px 24px; text-align: center; font-size: 12px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏘️ CommunitySharing</h1>
            <p>{{ $purpose === 'registration' ? 'Account Verification' : 'Password Reset' }}</p>
        </div>
        <div class="body">
            <p style="color:#374151;">Hello,</p>
            <p style="color:#374151;">
                @if($purpose === 'registration')
                    Thanks for signing up! Use the OTP below to complete your registration.
                @else
                    We received a request to reset your password. Use the OTP below.
                @endif
            </p>
            <div class="otp-box">
                <div class="otp-code">{{ $otp }}</div>
                <div class="note">Valid for <strong>10 minutes</strong></div>
            </div>
            <p style="color:#6b7280; font-size:13px;">
                If you didn't request this, please ignore this email. Your account is safe.
            </p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Community Sharing &bull; This is an automated message
        </div>
    </div>
</body>
</html>