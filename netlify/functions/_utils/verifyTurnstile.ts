/**
 * Reusable server-side Cloudflare Turnstile verification utility.
 * Used to validate frontend challenges before running operations.
 *
 * @param token - The turnstile token sent from the client
 * @param remoteIp - The optional client IP address
 * @returns { success: boolean, error?: string, statusCode?: number }
 */
export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string
): Promise<{ success: boolean; error?: string; statusCode?: number }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  const allowBypass = process.env.ALLOW_TURNSTILE_BYPASS === 'true';

  // 1. If Turnstile secret key is not configured
  if (!secretKey) {
    if (allowBypass) {
      console.warn('[Turnstile] TURNSTILE_SECRET_KEY is missing. ALLOW_TURNSTILE_BYPASS is true. Bypassing Turnstile (development mode).');
      return { success: true };
    }
    console.error('[Turnstile] Server configuration error: TURNSTILE_SECRET_KEY is missing and bypass is not enabled.');
    return {
      success: false,
      error: 'Security verification is not configured on the server.',
      statusCode: 500,
    };
  }

  // 2. If token is missing, return 400
  if (!token || token.trim().length === 0) {
    console.warn('[Turnstile] Verification failed: missing token.');
    return {
      success: false,
      error: 'Security verification token is missing. Please solve the captcha challenge.',
      statusCode: 400,
    };
  }

  // 3. Make POST call to Cloudflare Turnstile verification endpoint
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
        remoteip: remoteIp,
      }),
    });

    if (!response.ok) {
      console.error('[Turnstile] Cloudflare API responded with HTTP error:', response.status);
      return {
        success: false,
        error: 'Failed to verify security check with Cloudflare. Please try again.',
        statusCode: 502,
      };
    }

    const data = await response.json() as {
      success: boolean;
      'error-codes'?: string[];
      challenge_ts?: string;
      hostname?: string;
    };

    if (!data.success) {
      console.warn('[Turnstile] Token verification failed. Error codes:', data['error-codes']);
      return {
        success: false,
        error: 'Security verification failed. Please try again or refresh the page.',
        statusCode: 403,
      };
    }

    // Success!
    return { success: true };
  } catch (err: any) {
    console.error('[Turnstile] Network/Internal exception during siteverify:', err.message || err);
    return {
      success: false,
      error: 'Internal service error during security verification.',
      statusCode: 500,
    };
  }
}
