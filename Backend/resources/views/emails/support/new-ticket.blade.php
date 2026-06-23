<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Support Message</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 28px 32px; }
    .header h1 { color: #fff; font-size: 20px; }
    .body { padding: 32px; }
    .row { margin-bottom: 14px; }
    .label { font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: #6b7280; font-weight: 600; }
    .value { font-size: 15px; color: #111827; }
    .msg-box { margin-top: 18px; padding: 18px; background: #f9fafb; border-left: 4px solid #7c3aed; border-radius: 8px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; }
    .footer { padding: 20px 32px; font-size: 12px; color: #9ca3af; border-top: 1px solid #f0f0f0; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; background: #ede9fe; color: #6d28d9; font-size: 11px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>📩 New Support Message</h1>
    </div>
    <div class="body">
      <div class="row">
        <span class="badge">{{ $ticket->type === 'community' ? 'Community Support' : 'Platform Support' }}</span>
      </div>
      <div class="row">
        <div class="label">From</div>
        <div class="value">{{ $ticket->name }} &lt;{{ $ticket->email }}&gt;</div>
      </div>
      @if($ticket->subject)
      <div class="row">
        <div class="label">Subject</div>
        <div class="value">{{ $ticket->subject }}</div>
      </div>
      @endif
      @if($ticket->community)
      <div class="row">
        <div class="label">Regarding Community</div>
        <div class="value">{{ $ticket->community->name }}</div>
      </div>
      @endif
      <div class="row">
        <div class="label">Message</div>
        <div class="msg-box">{{ $ticket->message }}</div>
      </div>
    </div>
    <div class="footer">
      Ticket #{{ $ticket->id }} · Reply to this email or open the Admin Support panel to respond.
    </div>
  </div>
</body>
</html>
