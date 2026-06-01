// Sumalyze — Send Feedback Serverless Netlify Function
// netlify/functions/send-feedback.ts
// Compiled by Netlify esbuild. NOT part of Vite bundle.

import { verifyTurnstile } from './_utils/verifyTurnstile';
import { rateLimitFeedback } from './_utils/rateLimit';

function getHeaderCaseInsensitive(headers: Record<string, string | undefined>, name: string): string | undefined {
  const target = name.toLowerCase();
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === target) {
      return headers[key];
    }
  }
  return undefined;
}

function getClientIp(headers: Record<string, string | undefined>): string {
  let ip = getHeaderCaseInsensitive(headers, 'x-nf-client-connection-ip');
  if (ip) return ip.trim();

  ip = getHeaderCaseInsensitive(headers, 'client-ip');
  if (ip) return ip.trim();

  const xForwardedFor = getHeaderCaseInsensitive(headers, 'x-forwarded-for');
  if (xForwardedFor) {
    const parts = xForwardedFor.split(',');
    if (parts.length > 0 && parts[0]) {
      return parts[0].trim();
    }
  }

  return 'unknown';
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

const json = (statusCode: number, data: unknown, responseHeaders?: Record<string, string>): NLResponse => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-turnstile-token',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    ...responseHeaders
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
    category?: unknown;
    message?: unknown;
    rating?: unknown;
    userEmail?: unknown;
    pageUrl?: unknown;
    userAgent?: unknown;
    turnstileToken?: unknown;
  };

  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const { category, message, rating, userEmail, pageUrl, userAgent } = body;

  // ─── Input Validation ──────────────────────────────────────────────────────

  // 1. Validate Category
  if (!category || typeof category !== 'string') {
    return json(400, { error: 'Category is required and must be a string' });
  }
  const validCategories = ['Suggestion', 'Bug', 'Other'];
  if (!validCategories.includes(category)) {
    return json(400, { error: 'Category must be one of: Suggestion, Bug, Other' });
  }

  // 2. Validate Message
  if (!message || typeof message !== 'string') {
    return json(400, { error: 'Message is required and must be a string' });
  }
  const trimmedMessage = message.trim();
  if (trimmedMessage.length === 0) {
    return json(400, { error: 'Message cannot be empty' });
  }
  if (trimmedMessage.length > 1000) {
    return json(400, { error: 'Message cannot exceed 1000 characters' });
  }

  // 3. Validate Rating (Optional)
  if (rating !== undefined && rating !== null) {
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return json(400, { error: 'Rating must be a number between 1 and 5' });
    }
  }

  // 4. Validate User Email (Optional)
  if (userEmail !== undefined && userEmail !== null && userEmail !== '') {
    if (typeof userEmail !== 'string') {
      return json(400, { error: 'User email must be a string' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return json(400, { error: 'Please enter a valid email address' });
    }
  }

  // ─── Rate Limiting ─────────────────────────────────────────────────────────
  const rateLimitRes = await rateLimitFeedback(event);
  const responseHeaders: Record<string, string> = {};
  if (rateLimitRes.limit !== undefined) {
    responseHeaders['X-RateLimit-Limit'] = String(rateLimitRes.limit);
    responseHeaders['X-RateLimit-Remaining'] = String(rateLimitRes.remaining);
    responseHeaders['X-RateLimit-Reset'] = String(rateLimitRes.reset);
  }

  if (!rateLimitRes.allowed) {
    return json(
      rateLimitRes.statusCode || 429,
      { error: rateLimitRes.error || 'Too many feedback submissions. Please try again later.' },
      responseHeaders
    );
  }

  // ─── Turnstile Verification ────────────────────────────────────────────────
  const turnstileToken = getHeaderCaseInsensitive(event.headers, 'x-turnstile-token') || (typeof body.turnstileToken === 'string' ? body.turnstileToken : undefined);
  const clientIp = getClientIp(event.headers);

  const turnstileRes = await verifyTurnstile(turnstileToken, clientIp);
  if (!turnstileRes.success) {
    return json(turnstileRes.statusCode || 400, { error: turnstileRes.error }, responseHeaders);
  }

  // ─── Environment Variables ─────────────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Sumalyze <no-reply@sumalyze.space>';
  const toEmail = process.env.RESEND_SUPPORT_TO || 'support@sumalyze.space';

  if (!apiKey) {
    console.error('[send-feedback] Server configuration error: RESEND_API_KEY environment variable is missing.');
    return json(500, { error: 'Email service configuration error. Please contact support.' }, responseHeaders);
  }

  // ─── Email Template Generation ─────────────────────────────────────────────
  const ratingVal = rating !== undefined && rating !== null ? Number(rating) : null;
  const ratingStars = ratingVal ? '★'.repeat(ratingVal) + '☆'.repeat(5 - ratingVal) : 'Not provided';
  const cleanEmail = typeof userEmail === 'string' ? userEmail.trim() : 'Guest/Anonymous';
  const cleanUrl = typeof pageUrl === 'string' ? pageUrl.trim() : 'Not provided';
  const cleanUA = typeof userAgent === 'string' ? userAgent.trim() : 'Not provided';
  const submittedAt = new Date().toLocaleString('en-US', { timeZoneName: 'short' });

  // Escape HTML helper to prevent injection in the email body
  const escapeHtml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const escapedMessage = escapeHtml(trimmedMessage);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Sumalyze Feedback</title>
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
            display: flex;
            align-items: center;
            gap: 10px;
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
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .badge-bug {
            background-color: rgba(239, 68, 68, 0.12);
            color: #fca5a5;
            border: 1px solid rgba(239, 68, 68, 0.25);
          }
          .badge-suggestion {
            background-color: rgba(59, 130, 246, 0.12);
            color: #93c5fd;
            border: 1px solid rgba(59, 130, 246, 0.25);
          }
          .badge-other {
            background-color: rgba(107, 114, 128, 0.12);
            color: #d1d5db;
            border: 1px solid rgba(107, 114, 128, 0.25);
          }
          .rating {
            font-size: 16px;
            color: #ff8fa3;
            margin: 6px 0 16px;
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
            font-size: 12px;
            color: rgba(255, 255, 255, 0.45);
          }
          .meta-table td {
            padding: 6px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            vertical-align: top;
          }
          .meta-label {
            font-weight: 500;
            width: 110px;
            color: rgba(255, 255, 255, 0.3);
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
            <span class="logo-text">Sumalyze Feedback</span>
          </div>

          <div>
            <span class="badge ${category === 'Bug' ? 'badge-bug' : category === 'Suggestion' ? 'badge-suggestion' : 'badge-other'}">
              ${category}
            </span>
          </div>

          ${ratingVal ? `<div class="rating">Rating: ${ratingStars} (${ratingVal}/5)</div>` : '<div class="rating" style="color: rgba(255,255,255,0.25)">Rating: Not provided</div>'}

          <div class="message-box">${escapedMessage}</div>

          <table class="meta-table">
            <tr>
              <td class="meta-label">Submitted By:</td>
              <td>${escapeHtml(cleanEmail)}</td>
            </tr>
            <tr>
              <td class="meta-label">Source Page:</td>
              <td><a href="${cleanUrl}" style="color: #ff8fa3; text-decoration: none;">${escapeHtml(cleanUrl)}</a></td>
            </tr>
            <tr>
              <td class="meta-label">Browser details:</td>
              <td>${escapeHtml(cleanUA)}</td>
            </tr>
            <tr>
              <td class="meta-label">Submitted At:</td>
              <td>${escapeHtml(submittedAt)}</td>
            </tr>
            <tr>
              <td class="meta-label">Trigger Source:</td>
              <td>Sumalyze Feedback Modal</td>
            </tr>
          </table>

          <div class="footer">
            Sumalyze · AI Clarity Workspace & Agent Platform
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
      subject: `New Sumalyze feedback: ${category}`,
      html: htmlContent,
      reply_to: (userEmail && typeof userEmail === 'string' && userEmail.trim().length > 0) 
        ? userEmail.trim() 
        : undefined,
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
      console.error('[send-feedback] Resend API error details:', response.status, errRes);
      return json(502, { error: 'Failed to deliver email through payment/notification provider.' }, responseHeaders);
    }

    const data = await response.json() as { id?: string };
    console.log('[send-feedback] Email sent successfully via Resend. ID:', data?.id);
    return json(200, { success: true, emailId: data?.id }, responseHeaders);

  } catch (err: unknown) {
    console.error('[send-feedback] Server exception when calling Resend API:', err);
    return json(500, { error: 'Internal server error while sending email.' }, responseHeaders);
  }
};
