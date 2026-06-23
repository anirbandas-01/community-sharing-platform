<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reply from CommunitySharing Admin</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 28px 32px; }
    .header h1 { color: #fff; font-size: 20px; }
    .body { padding: 32px; }
    .greet { font-size: 15px; margin-bottom: 16px; }
    .msg-box { padding: 18px; background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 8px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
    .quote-label { font-size: 12px; color: #6b7280; margin-bottom: 6px; }
    .quote-box { padding: 14px; background: #f9fafb; border-radius: 8px; white-space: pre-wrap; font-size: 13px; color: #6b7280; line-height: 1.5; }
    .footer { padding: 20px 32px; font-size: 12px; color: #9ca3af; border-top: 1px solid #f0f0f0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>💬 Reply from Admin</h1>
    </div>
    <div class="body">
      <p class="greet">Hi {{ $ticket->name }},</p>
      <p class="greet">You recently contacted CommunitySharing support. Here's our reply:</p>
      <div class="msg-box">{{ $ticket->admin_reply }}</div>
      <div class="quote-label">Your original message:</div>
      <div class="quote-box">{{ $ticket->message }}</div>
    </div>
    <div class="footer">
      Ticket #{{ $ticket->id }} · Reply to this email if you need further help.
    </div>
  </div>
</body>
</html>
