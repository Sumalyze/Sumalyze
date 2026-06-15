// src/pages/CheckoutPage.tsx
import { useState, useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Paddle?: any;
  }
}

// Price ID lookup from env — never hardcoded
function getPriceId(planId: string, billing: string): string | null {
  const map: Record<string, string> = {
    'starter-monthly': import.meta.env.VITE_PADDLE_PRICE_STARTER_MONTHLY ?? '',
    'starter-annually': import.meta.env.VITE_PADDLE_PRICE_STARTER_ANNUAL ?? '',
    'pro-monthly': import.meta.env.VITE_PADDLE_PRICE_PRO_MONTHLY ?? '',
    'pro-annually': import.meta.env.VITE_PADDLE_PRICE_PRO_ANNUAL ?? '',
    'max-monthly': import.meta.env.VITE_PADDLE_PRICE_MAX_MONTHLY ?? '',
    'max-annually': import.meta.env.VITE_PADDLE_PRICE_MAX_ANNUAL ?? '',
  };
  const key = `${planId}-${billing}`;
  return map[key] || null;
}

const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter',
  pro: 'Pro',
  max: 'Max',
};

type Status = 'loading-sdk' | 'ready' | 'opening' | 'success' | 'error';

function navTo(path: string) {
  window.history.pushState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function CheckoutPage() {
  const [status, setStatus] = useState<Status>('loading-sdk');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [planId, setPlanId] = useState('pro');
  const [billing, setBilling] = useState('annually');
  const paddleLoaded = useRef(false);

  const priceId = getPriceId(planId, billing);
  const clientToken = import.meta.env.VITE_PADDLE_CLIENT_TOKEN ?? '';
  const paddleEnv = import.meta.env.VITE_PADDLE_ENV ?? 'sandbox';

  useEffect(() => {
    document.title = 'Secure Checkout | Sumalyze';
    return () => { document.title = 'Sumalyze'; };
  }, []);

  // Parse URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('plan') || 'pro';
    const b = params.get('billing') || 'annually';
    setPlanId(p);
    setBilling(b);
  }, []);

  // Load Paddle.js SDK once
  useEffect(() => {
    if (paddleLoaded.current) return;
    paddleLoaded.current = true;

    if (!clientToken) {
      setStatus('error');
      setErrorMsg('Paddle is not configured. Missing client token.');
      return;
    }
    if (!priceId) {
      setStatus('error');
      setErrorMsg('No price ID configured for this plan. Please contact support.');
      return;
    }

    // If already present (hot reload), init directly
    if (window.Paddle) {
      initPaddle();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = initPaddle;
    script.onerror = () => {
      setStatus('error');
      setErrorMsg('Could not load the payment SDK. Check your connection and try again.');
    };
    document.head.appendChild(script);

    return () => {
      // Don't remove script on unmount — Paddle needs to stay loaded
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientToken, priceId]);

  function initPaddle() {
    try {
      window.Paddle.Environment.set(paddleEnv);
      window.Paddle.Initialize({
        token: clientToken,
        eventCallback: (data: { name: string }) => {
          if (data.name === 'checkout.completed') {
            setStatus('success');
          }
          if (data.name === 'checkout.error') {
            setStatus('error');
            setErrorMsg('Payment could not be completed. Please try again or contact support.');
          }
        },
      });
      setStatus('ready');
    } catch (e) {
      setStatus('error');
      setErrorMsg('Failed to initialize the payment SDK. Please refresh and try again.');
    }
  }

  function openCheckout() {
    if (!window.Paddle || !priceId) return;
    setStatus('opening');
    try {
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        settings: {
          displayMode: 'overlay',
          theme: 'dark',
          locale: 'en',
          allowedPaymentMethods: ['card', 'paypal', 'apple_pay', 'google_pay'],
          successUrl: 'https://sumalyze.space/checkout?success=1',
        },
      });
      // Set status back to ready — actual success comes from eventCallback
      setStatus('ready');
    } catch (e) {
      setStatus('error');
      setErrorMsg('Could not open checkout. Please refresh and try again.');
    }
  }

  // Check for ?success=1 redirect from Paddle successUrl
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') {
      setStatus('success');
    }
  }, []);

  const planLabel = PLAN_LABELS[planId] ?? planId;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a000f',
      color: 'white',
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      {/* Logo */}
      <button
        onClick={() => navTo('/')}
        style={{
          position: 'fixed', top: 28, left: 28,
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
          boxShadow: '0 4px 12px rgba(226,62,87,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 5h12M3 9h8M3 13h10" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
            <circle cx="14" cy="13" r="2.5" fill="white" fillOpacity="0.9" />
          </svg>
        </div>
        <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: '-0.02em' }}>Sumalyze</span>
      </button>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 24,
        padding: '40px 36px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(226,62,87,0.4), transparent)',
        }} />

        {/* ── SUCCESS ── */}
        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle size={30} style={{ color: '#34d399' }} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Payment successful!
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: '22px', marginBottom: 28 }}>
              Your <strong style={{ color: 'white' }}>{planLabel} plan</strong> is being activated.
              Your account will be updated within a minute via webhook.
            </p>
            <button
              onClick={() => navTo('/tools')}
              style={{
                padding: '12px 28px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                color: 'white',
                fontFamily: 'inherit',
                boxShadow: '0 4px 16px rgba(226,62,87,0.3)',
                marginBottom: 16,
              }}
            >
              Go to my workspace →
            </button>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
              Confirmation will be sent to your email by Paddle.
            </p>
          </div>
        )}

        {/* ── ERROR ── */}
        {status === 'error' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(226,62,87,0.1)',
              border: '1px solid rgba(226,62,87,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <AlertCircle size={30} style={{ color: '#E23E57' }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: '20px', marginBottom: 24 }}>
              {errorMsg || 'An unexpected error occurred.'}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setStatus('loading-sdk'); paddleLoaded.current = false; window.location.reload(); }}
                style={{
                  padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)', color: 'white', fontFamily: 'inherit',
                }}
              >
                Try again
              </button>
              <a
                href="mailto:support@sumalyze.space"
                style={{
                  padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                  border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                }}
              >
                Contact support
              </a>
            </div>
          </div>
        )}

        {/* ── LOADING SDK ── */}
        {status === 'loading-sdk' && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{
              width: 48, height: 48,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite',
            }}>
              <Loader size={28} style={{ color: 'rgba(255,255,255,0.3)' }} />
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Preparing secure checkout…</p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── READY / OPENING ── */}
        {(status === 'ready' || status === 'opening') && (
          <div>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(226,62,87,0.08)',
                border: '1px solid rgba(226,62,87,0.2)',
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 11,
                fontWeight: 600,
                color: '#ff8fa3',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 14,
              }}>
                Secure Checkout
              </div>
              <h1 style={{
                fontSize: 24, fontWeight: 700, color: 'white',
                letterSpacing: '-0.02em', marginBottom: 6,
              }}>
                {planLabel} Plan
              </h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: '20px' }}>
                Billed {billing === 'annually' ? 'annually' : 'monthly'} · Cancel anytime via Paddle
              </p>
            </div>

            {/* Info rows */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 12,
              padding: '14px 16px',
              marginBottom: 24,
            }}>
              {[
                { label: 'Merchant of Record', value: 'Paddle.com' },
                { label: 'Subscription', value: `${planLabel} · ${billing === 'annually' ? 'Annual' : 'Monthly'}` },
                { label: 'Refund window', value: '14 days' },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 13, marginBottom: 8,
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
                  <span style={{ color: 'white', fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Checkout button */}
            <button
              id="checkout-open-button"
              onClick={openCheckout}
              disabled={status === 'opening'}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: status === 'opening' ? 'not-allowed' : 'pointer',
                border: 'none',
                background: status === 'opening'
                  ? 'rgba(226,62,87,0.5)'
                  : 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                color: 'white',
                boxShadow: status === 'opening' ? 'none' : '0 4px 20px rgba(226,62,87,0.35)',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 12,
              }}
              onMouseEnter={e => { if (status !== 'opening') e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              {status === 'opening' ? (
                <>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Opening checkout…
                </>
              ) : (
                <>🔒 Complete Payment</>
              )}
            </button>

            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', lineHeight: '16px', marginBottom: 20 }}>
              Powered by Paddle · PCI-compliant · Your card data is never stored by Sumalyze
            </p>

            {/* Legal links */}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 14px' }}>
              {[
                { label: 'Terms', href: '/terms' },
                { label: 'Privacy', href: '/privacy' },
                { label: 'Refund Policy', href: '/refund' },
                { label: 'Support', href: '/support' },
              ].map(l => (
                <a key={l.href} href={l.href}
                  onClick={e => { e.preventDefault(); navTo(l.href); }}
                  style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Back link */}
      {status !== 'success' && (
        <button
          onClick={() => navTo('/pay')}
          style={{
            marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.25)',
            background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; }}
        >
          ← Back to payment details
        </button>
      )}
    </div>
  );
}
