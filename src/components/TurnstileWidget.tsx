// src/components/TurnstileWidget.tsx
// Cloudflare Turnstile bot protection widget.
//
// TODO/Future Integration Points:
// - signup: Render this widget on the signup form to prevent automated account creations.
// - login after repeated attempts: Trigger after 3+ failed attempts using custom state to prevent brute-forcing.
// - forgot password: Protect the recovery link request form against email spamming.
// - AI analyze endpoint: Require Turnstile tokens for guest users in AgentPage/ToolPanel if server loads increase.
//
// Security & Privacy Compliance:
// - Turnstile tokens are never stored in databases or sent to PostHog/external trackers.
// - VITE_TURNSTILE_SITE_KEY is public; TURNSTILE_SECRET_KEY is kept strictly server-side.

import { useEffect, useRef, useState } from 'react';

// Declare Turnstile API on window object for TypeScript safety
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'invisible';
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

export default function TurnstileWidget({
  onSuccess,
  onExpire,
  onError,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    // If site key is not configured, show a helpful developer warning or skip silently in dev
    if (!siteKey) {
      setLoadError('Security verification config error: Site Key missing.');
      setLoading(false);
      return;
    }

    let active = true;
    let checkInterval: NodeJS.Timeout | null = null;

    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile) return;
      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'dark',
          size: 'normal',
          callback: (token: string) => {
            if (active) onSuccess(token);
          },
          'expired-callback': () => {
            if (active) {
              onExpire?.();
            }
          },
          'error-callback': () => {
            if (active) {
              onError?.();
            }
          },
        });
        widgetIdRef.current = id;
        setLoading(false);
      } catch (err) {
        console.error('[Turnstile] Render exception:', err);
        if (active) {
          setLoadError('Failed to initialize security verification widget.');
          setLoading(false);
        }
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      // Find or create script element
      let script = document.getElementById('cloudflare-turnstile-script') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = 'cloudflare-turnstile-script';
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }

      // Check repeatedly for script loading to handle the window.turnstile definition
      checkInterval = setInterval(() => {
        if (window.turnstile) {
          if (checkInterval) clearInterval(checkInterval);
          if (active) renderWidget();
        }
      }, 100);

      // Handle loading failure
      const handleError = () => {
        if (checkInterval) clearInterval(checkInterval);
        console.error('[Turnstile] Script load failure.');
        if (active) {
          setLoadError('Failed to load security verification services. Please check your connection or disable adblockers.');
          setLoading(false);
          onError?.();
        }
      };

      script.addEventListener('error', handleError);
    }

    return () => {
      active = false;
      if (checkInterval) clearInterval(checkInterval);
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore removal exceptions during unmount
        }
      }
    };
  }, [siteKey, onSuccess, onExpire, onError]);

  // Clean, premium design to fit Sumalyze dark/lux styling
  return (
    <div style={{
      width: '100%',
      minHeight: '74px',
      margin: '12px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      background: 'rgba(255, 255, 255, 0.01)',
      border: '1px solid rgba(255, 255, 255, 0.04)',
      padding: '8px',
      boxSizing: 'border-box'
    }}>
      {loading && !loadError && (
        <div style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" style={{ opacity: 0.2 }} />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="16" />
          </svg>
          Loading security check...
        </div>
      )}

      {loadError ? (
        <div style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: 8,
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          fontSize: 12,
          color: '#fca5a5',
          textAlign: 'center',
          lineHeight: '16px'
        }}>
          ⚠️ {loadError}
        </div>
      ) : (
        <div ref={containerRef} style={{ display: loading ? 'none' : 'block' }} />
      )}

      {/* Embedded Spinner CSS for safety */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
