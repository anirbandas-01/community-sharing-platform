<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Business Approved — CommunitySharing</title>
  <style>
    /* Reset */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background-color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      -webkit-font-smoothing: antialiased;
    }

    /* Wrapper */
    .wrapper {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      padding: 40px 40px 32px;
      text-align: center;
    }
    .header .logo {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 24px;
    }
    .header .logo-box {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.25);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.3px;
    }
    .header .icon-circle {
      width: 72px;
      height: 72px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      margin: 0 auto 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
    }
    .header h1 {
      font-size: 26px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.3;
      margin-bottom: 8px;
    }
    .header p {
      font-size: 15px;
      color: rgba(255,255,255,0.85);
    }

    /* Body */
    .body {
      padding: 36px 40px;
    }
    .greeting {
      font-size: 16px;
      color: #374151;
      margin-bottom: 16px;
      line-height: 1.6;
    }
    .greeting strong {
      color: #111827;
    }

    /* Info card */
    .info-card {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 20px 24px;
      margin: 24px 0;
    }
    .info-card .info-title {
      font-size: 12px;
      font-weight: 600;
      color: #059669;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 14px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #d1fae5;
      font-size: 14px;
    }
    .info-row:last-child { border-bottom: none; }
    .info-row .label { color: #6b7280; }
    .info-row .value { font-weight: 600; color: #111827; }

    /* What's unlocked */
    .unlocked {
      margin: 24px 0;
    }
    .unlocked h3 {
      font-size: 15px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 12px;
    }
    .unlock-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #f3f4f6;
      font-size: 14px;
      color: #374151;
    }
    .unlock-item:last-child { border-bottom: none; }
    .unlock-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      flex-shrink: 0;
    }

    /* Notes box */
    .notes-box {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      border-radius: 0 8px 8px 0;
      padding: 14px 18px;
      margin: 20px 0;
      font-size: 14px;
      color: #92400e;
      line-height: 1.6;
    }
    .notes-box strong { display: block; margin-bottom: 4px; color: #78350f; }

    /* CTA Button */
    .cta-wrap { text-align: center; margin: 32px 0 24px; }
    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      padding: 14px 36px;
      border-radius: 10px;
      letter-spacing: 0.2px;
    }

    /* Footer */
    .footer {
      padding: 24px 40px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      text-align: center;
    }
    .footer p {
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.7;
    }
    .footer a { color: #6366f1; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">

    <!-- Header -->
    <div class="header">
      <div class="logo">
        <div class="logo-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
        </div>
        <span class="logo-text">CommunitySharing</span>
      </div>
      <div class="icon-circle">🎉</div>
      <h1>Your Business is Approved!</h1>
      <p>Your enterprise is now live on CommunitySharing</p>
    </div>

    <!-- Body -->
    <div class="body">
      <p class="greeting">
        Hi <strong>{{ $ownerName }}</strong>,<br><br>
        Great news! Your business application for <strong>{{ $enterprise->company_name }}</strong>
        has been reviewed and <strong>approved</strong> by our admin team.
        You now have full access to your business dashboard.
      </p>

      <!-- Business details -->
      <div class="info-card">
        <div class="info-title">✅ Approved Business Details</div>
        <div class="info-row">
          <span class="label">Company Name</span>
          <span class="value">{{ $enterprise->company_name }}</span>
        </div>
        <div class="info-row">
          <span class="label">Industry</span>
          <span class="value">{{ $enterprise->industry_type }}</span>
        </div>
        <div class="info-row">
          <span class="label">Registration No.</span>
          <span class="value">{{ $enterprise->registration_number }}</span>
        </div>
        <div class="info-row">
          <span class="label">City</span>
          <span class="value">{{ $enterprise->city }}</span>
        </div>
        <div class="info-row">
          <span class="label">Status</span>
          <span class="value" style="color: #059669;">✅ Approved</span>
        </div>
      </div>

      <!-- What's now unlocked -->
      <div class="unlocked">
        <h3>What you can do now:</h3>
        <div class="unlock-item"><div class="unlock-dot"></div>Add products to your inventory</div>
        <div class="unlock-item"><div class="unlock-dot"></div>Receive and manage customer orders</div>
        <div class="unlock-item"><div class="unlock-dot"></div>View sales reports and revenue analytics</div>
        <div class="unlock-item"><div class="unlock-dot"></div>Message customers directly</div>
        <div class="unlock-item"><div class="unlock-dot"></div>Your products appear in the public store</div>
      </div>

      @if($notes)
      <!-- Admin notes -->
      <div class="notes-box">
        <strong>Note from our team:</strong>
        {{ $notes }}
      </div>
      @endif

      <!-- CTA -->
      <div class="cta-wrap">
        <a href="{{ $dashboardUrl }}" class="cta-btn">
          Go to My Business Dashboard →
        </a>
      </div>

      <p style="font-size: 13px; color: #6b7280; line-height: 1.6;">
        If you have any questions or need help getting started, feel free to reach out to our
        support team. We're happy to help you make the most of your CommunitySharing business account.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>
        This email was sent to <strong>{{ $enterprise->email }}</strong> because you applied
        for a business account on CommunitySharing.<br>
        © {{ date('Y') }} CommunitySharing. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>