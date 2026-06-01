// Sumalyze — Send Team Waitlist Serverless Netlify Function
// netlify/functions/send-team-waitlist.ts

import { rateLimitTeamWaitlist } from './_utils/rateLimit';

function getHeaderCaseInsensitive(headers: Record<string, string | undefined>, name: string): string | undefined {
  const target = name.toLowerCase();
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === target) {
      return headers[key];
    }
  }
  return undefined;
}

interface NLEvent {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string | undefined>;
}

interface NLResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const json = (statusCode: number, data: unknown): NLResponse => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  },
  body: JSON.stringify(data),
});

export const handler = async (event: NLEvent): Promise<NLResponse> => {
  // CORS support
  if (event.httpMethod === 'OPTIONS') {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  // Parse request body
  let body: {
    workEmail?: unknown;
    companyName?: unknown;
    teamSize?: unknown;
    useCase?: unknown;
    expectedUsage?: unknown;
    message?: unknown;
    pageUrl?: unknown;
  };

  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const { workEmail, companyName, teamSize, useCase, expectedUsage, message, pageUrl } = body;

  // ─── Input Validation ──────────────────────────────────────────────────────

  // 1. Validate workEmail (Required, must be string and valid email structure)
  if (!workEmail || typeof workEmail !== 'string') {
    return json(400, { error: 'Work email is required' });
  }
  const cleanEmail = workEmail.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return json(400, { error: 'Please provide a valid email address' });
  }

  // 2. Validate companyName (Optional, max 120 chars)
  let cleanCompany = '';
  if (companyName !== undefined && companyName !== null && companyName !== '') {
    if (typeof companyName !== 'string') {
      return json(400, { error: 'Company name must be a string' });
    }
    cleanCompany = companyName.trim();
    if (cleanCompany.length > 120) {
      return json(400, { error: 'Company name cannot exceed 120 characters' });
    }
  }

  // 3. Validate teamSize (Optional, max 80 chars)
  let cleanSize = '';
  if (teamSize !== undefined && teamSize !== null && teamSize !== '') {
    if (typeof teamSize !== 'string') {
      return json(400, { error: 'Team size must be a string' });
    }
    cleanSize = teamSize.trim();
    if (cleanSize.length > 80) {
      return json(400, { error: 'Team size cannot exceed 80 characters' });
    }
  }

  // 4. Validate useCase (Optional, max 120 chars)
  let cleanUseCase = '';
  if (useCase !== undefined && useCase !== null && useCase !== '') {
    if (typeof useCase !== 'string') {
      return json(400, { error: 'Use case must be a string' });
    }
    cleanUseCase = useCase.trim();
    if (cleanUseCase.length > 120) {
      return json(400, { error: 'Use case cannot exceed 120 characters' });
    }
  }

  // 5. Validate expectedUsage (Optional, max 120 chars)
  let cleanExpectedUsage = '';
  if (expectedUsage !== undefined && expectedUsage !== null && expectedUsage !== '') {
    if (typeof expectedUsage !== 'string') {
      return json(400, { error: 'Expected usage must be a string' });
    }
    cleanExpectedUsage = expectedUsage.trim();
    if (cleanExpectedUsage.length > 120) {
      return json(400, { error: 'Expected usage description cannot exceed 120 characters' });
    }
  }

  // 6. Validate message (Optional, max 1000 chars)
  let cleanMessage = '';
  if (message !== undefined && message !== null && message !== '') {
    if (typeof message !== 'string') {
      return json(400, { error: 'Message must be a string' });
    }
    cleanMessage = message.trim();
    if (cleanMessage.length > 1000) {
      return json(400, { error: 'Message cannot exceed 1000 characters' });
    }
  }

  // 7. Validate pageUrl (Optional, max 300 chars)
  let cleanPageUrl = '';
  if (pageUrl !== undefined && pageUrl !== null && pageUrl !== '') {
    if (typeof pageUrl !== 'string') {
      return json(400, { error: 'Page URL must be a string' });
    }
    cleanPageUrl = pageUrl.trim();
    if (cleanPageUrl.length > 300) {
      return json(400, { error: 'Page URL cannot exceed 300 characters' });
    }
  }

  // ─── Rate Limiting ─────────────────────────────────────────────────────────
  const rateLimitRes = await rateLimitTeamWaitlist(event);
  if (!rateLimitRes.allowed) {
    return json(
      rateLimitRes.statusCode || 429,
      { error: rateLimitRes.error || 'Too many waitlist submissions. Please try again in 10 minutes.' }
    );
  }

  // ─── Environment Variables & Recipient Routing ─────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Sumalyze <no-reply@sumalyze.space>';
  const toEmail = process.env.RESEND_INFO_TO || process.env.RESEND_SUPPORT_TO || 'info@sumalyze.space';

  if (!apiKey) {
    console.error('[send-team-waitlist] Server configuration error: RESEND_API_KEY variable is missing.');
    return json(500, { error: 'Email service configuration error. Please contact support.' });
  }

  // ─── HTML Escaping & Template Generation ───────────────────────────────────
  const escapeHtml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const escapedEmail = escapeHtml(cleanEmail);
  const escapedCompany = cleanCompany ? escapeHtml(cleanCompany) : 'Not specified';
  const escapedSize = cleanSize ? escapeHtml(cleanSize) : 'Not specified';
  const escapedUseCase = cleanUseCase ? escapeHtml(cleanUseCase) : 'Not specified';
  const escapedExpectedUsage = cleanExpectedUsage ? escapeHtml(cleanExpectedUsage) : 'Not specified';
  const escapedMessage = cleanMessage ? escapeHtml(cleanMessage) : 'None';
  const escapedPageUrl = cleanPageUrl ? escapeHtml(cleanPageUrl) : 'Not provided';
  const submittedAt = new Date().toLocaleString('en-US', { timeZoneName: 'short' });

  // Plain Text Version
  const textContent = `
New Sumalyze Team Workspace Waitlist Request
--------------------------------------------
Work Email: ${cleanEmail}
Company/Team: ${cleanCompany || 'Not specified'}
Team Size: ${cleanSize || 'Not specified'}
Expected Usage: ${cleanExpectedUsage || 'Not specified'}
Primary Use Case: ${cleanUseCase || 'Not specified'}
Page URL: ${cleanPageUrl || 'Not provided'}
Submitted At: ${submittedAt}
Source: Sumalyze Pricing Team Waitlist

Message:
${cleanMessage || 'None'}
  `.trim();

  // HTML Version
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Team Workspace Waitlist Request</title>
        <style>
          body {
            background-color: #0f0914;
            color: #e8e4ec;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            padding: 30px 20px;
            margin: 0;
          }
          .container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #160f1c;
            border: 1px solid rgba(226, 62, 87, 0.15);
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }
          .header {
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 18px;
            margin-bottom: 24px;
          }
          .logo-text {
            font-size: 18px;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: -0.01em;
          }
          .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background-color: rgba(226, 62, 87, 0.12);
            color: #ff8fa3;
            border: 1px solid rgba(226, 62, 87, 0.25);
            margin-top: 8px;
          }
          .message-box {
            background-color: rgba(10, 0, 15, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 18px;
            font-size: 14px;
            line-height: 1.6;
            color: #ffffff;
            white-space: pre-wrap;
            margin-bottom: 24px;
          }
          .meta-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.65);
          }
          .meta-table td {
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            vertical-align: top;
          }
          .meta-label {
            font-weight: 600;
            width: 150px;
            color: rgba(255, 255, 255, 0.35);
          }
          .footer {
            margin-top: 32px;
            padding-top: 18px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 11px;
            text-align: center;
            color: rgba(255, 255, 255, 0.25);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="logo-text">Sumalyze Workspace Request</span>
            <br />
            <span class="badge">Team Waitlist</span>
          </div>

          <table class="meta-table" style="margin-bottom: 24px;">
            <tr>
              <td class="meta-label">Work Email:</td>
              <td><strong>${escapedEmail}</strong></td>
            </tr>
            <tr>
              <td class="meta-label">Company / Team Name:</td>
              <td>${escapedCompany}</td>
            </tr>
            <tr>
              <td class="meta-label">Team Size:</td>
              <td>${escapedSize}</td>
            </tr>
            <tr>
              <td class="meta-label">Expected Usage:</td>
              <td>${escapedExpectedUsage}</td>
            </tr>
            <tr>
              <td class="meta-label">Primary Use Case:</td>
              <td>${escapedUseCase}</td>
            </tr>
            <tr>
              <td class="meta-label">Submitted At:</td>
              <td>${escapeHtml(submittedAt)}</td>
            </tr>
            <tr>
              <td class="meta-label">Source page URL:</td>
              <td><a href="${escapedPageUrl}" style="color: #ff8fa3; text-decoration: none;">${escapedPageUrl}</a></td>
            </tr>
          </table>

          <div style="font-size: 12px; color: rgba(255, 255, 255, 0.35); margin-bottom: 8px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em;">
            Waitlist message:
          </div>
          <div class="message-box">${escapedMessage}</div>

          <div class="footer">
            Sumalyze · AI Clarity Workspace & Team Platforms
          </div>
        </div>
      </body>
    </html>
  `;

  // ─── Resend REST API Call ──────────────────────────────────────────────────
  try {
    const payload = {
      from: fromEmail,
      to: [toEmail],
      subject: `New Sumalyze Team Workspace waitlist request`,
      text: textContent,
      html: htmlContent,
      reply_to: cleanEmail,
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errRes = await response.json().catch(() => ({}));
      console.error('[send-team-waitlist] Resend API error:', response.status, errRes);
      return json(502, { error: 'Failed to deliver waitlist email through notification provider.' });
    }

    const data = await response.json() as { id?: string };
    console.log('[send-team-waitlist] Email sent successfully. ID:', data?.id);
    return json(200, { success: true, emailId: data?.id });

  } catch (err: unknown) {
    console.error('[send-team-waitlist] Server exception during execution:', err);
    return json(500, { error: 'Internal server error while sending email.' });
  }
};
