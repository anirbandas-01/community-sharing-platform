<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Business Application Update — CommunitySharing</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background-color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }

    /* Header — neutral/orange tone so it doesn't feel like a hard "failure" */
    .header {
      background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
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
      font-size: 24px;
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
    .body { padding: 36px 40px; }
    .greeting {
      font-size: 16px;
      color: #374151;
      margin-bottom: 16px;
      line-height: 1.6;
    }
    .greeting strong { color: #111827; }

    /* Info card */
    .info-card {
      background: #fef3c7;
      border: 1px solid #fde68a;
      border-radius: 12px;
      padding: 20px 24px;
      margin: 24px 0;
    }
    .info-card .info-title {
      font-size: 12px;
      font-weight: 600;
      color: #b45309;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 14px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #fde68a;
      font-size: 14px;
    }
    .info-row:last-child { border-bottom: none; }
    .info-row .label { color: #6b7280; }
    .info-row .value { font-weight: 600; color: #111827; }

    /* Reason / notes box */
    .reason-box {
      background: #fff1f2;
      border: 1px solid #fecdd3;
      border-left: 4px solid #f43f5e;
      border-radius: 0 10px 10px 0;
      padding: 16px 20px;
      margin: 20px 0;
      font-size: 14px;
      color: #881337;
      line-height: 1.7;
    }
    .reason-box strong {
      display: block;
      margin-bottom: 6px;
      color: #9f1239;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    /* Common rejection reasons */
    .reasons {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px 24px;
      margin: 20px 0;
    }
    .reasons h3 {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 12px;
    }
    .reason-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 7px 0;
      font-size: 13px;
      color: #4b5563;
      border-bottom: 1px solid #f3f4f6;
    }
    .reason-item:last-child { border-bottom: none; }
    .reason-item::before {
      content: '•';
      color: #f59e0b;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 1px;
    }

    /* CTA Button */
    .cta-wrap { text-align: center; margin: 32px 0 24px; }
    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
    .footer p { font-size: 12px; color: #9ca3af; line-height: 1.7; }
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
      <div class="icon-circle">📋</div>
      <h1>Application Needs Attention</h1>
      <p>We couldn't approve your business at this time</p>
    </div>

    <!-- Body -->
    <div class="body">
      <p class="greeting">
        Hi <strong>{{ $ownerName }}</strong>,<br><br>
        Thank you for applying to list your business on CommunitySharing. After reviewing your
        application for <strong>{{ $enterprise->company_name }}</strong>, we were unable to
        approve it at this time.
      </p>

      <!-- Business details -->
      <div class="info-card">
        <div class="info-title">📋 Application Details</div>
        <div class="info-row">
          <span class="label">Company Name</span>
          <span class="value">{{ $enterprise->company_name }}</span>
        </div>
        <div class="info-row">
          <span class="label">Registration No.</span>
          <span class="value">{{ $enterprise->registration_number }}</span>
        </div>
        <div class="info-row">
          <span class="label">Industry</span>
          <span class="value">{{ $enterprise->industry_type }}</span>
        </div>
        <div class="info-row">
          <span class="label">Status</span>
          <span class="value" style="color: #dc2626;">❌ Not Approved</span>
        </div>
      </div>

      @if($notes)
      <!-- Specific reason from admin -->
      <div class="reason-box">
        <strong>Reason from our review team:</strong>
        {{ $notes }}
      </div>
      @else
      <!-- Generic common reasons when no notes provided -->
      <div class="reasons">
        <h3>Common reasons for rejection include:</h3>
        <div class="reason-item">Invalid or unverifiable GST / registration number</div>
        <div class="reason-item">Business details that don't match official records</div>
        <div class="reason-item">Unclear or low-quality business photo</div>
        <div class="reason-item">Incomplete or inconsistent contact information</div>
        <div class="reason-item">Business description that is too vague or generic</div>
      </div>
      @endif

      <p style="font-size: 14px; color: #374151; line-height: 1.7; margin-bottom: 20px;">
        The good news is that you can <strong>update your details and re-apply</strong> at any
        time. Please review the points above, correct any issues, and submit a new application
        — we'll review it again as soon as possible.
      </p>

      <!-- CTA -->
      <div class="cta-wrap">
        <a href="{{ $reapplyUrl }}" class="cta-btn">
          Update Details &amp; Re-apply →
        </a>
      </div>

      <p style="font-size: 13px; color: #6b7280; line-height: 1.6; margin-top: 8px;">
        If you believe this decision was made in error or need clarification, please contact
        our support team and reference your company name: <strong>{{ $enterprise->company_name }}</strong>.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>
        This email was sent to <strong>{{ $enterprise->email }}</strong> regarding your
        CommunitySharing business application.<br>
        © {{ date('Y') }} CommunitySharing. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>