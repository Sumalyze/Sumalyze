import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import sumalyzeLogo from '../assets/sumalyzelogo.png';
import { captureEvent } from '../lib/analytics';

type Page = 'home' | 'privacy' | 'terms' | 'cookies' | 'refund' | 'billing' | 'data-deletion' | 'support' | 'tools' | 'tooldetail' | 'agent' | 'workflows' | 'usecases' | 'history' | 'pricing' | 'login' | 'signup' | 'forgot-password' | 'settings';

interface ForgotPasswordPageProps {
  onNavigate: (p: Page) => void;
}

export default function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Reset Password | Sumalyze';
    return () => {
      document.title = 'Sumalyze';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    captureEvent('forgot_password_submitted');

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message || 'Could not send reset email.');
      } else {
        setSuccess('Password reset email sent. Check your inbox.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(10,0,15,0.6)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a000f',
      padding: '80px 20px',
      position: 'relative',
      boxSizing: 'border-box',
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: -170,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 1440,
        height: 900,
        background: 'radial-gradient(40% 60% at 50% 30%, rgba(226,62,87,0.06) 0%, rgba(10,0,15,0) 100%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Back Link */}
        <button
          onClick={() => onNavigate('home')}
          style={{
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
          }}
        >
          ← Back to Home
        </button>

        {/* Card */}
        <div style={{
          position: 'relative',
          background: 'rgba(14,4,22,0.97)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          padding: '36px 28px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
          boxSizing: 'border-box',
          width: '100%',
        }}>
          {/* Top gradient accent */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(226,62,87,0.5), transparent)',
            borderRadius: '20px 20px 0 0',
          }} />

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <img src={sumalyzeLogo} alt="Sumalyze logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            <span style={{ fontSize: 16, fontWeight: 500, color: 'white' }}>Sumalyze</span>
          </div>

          {/* Title & Subtitle */}
          <h2 style={{ fontSize: 22, fontWeight: 500, color: 'white', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Reset your password
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
            Enter your email and we'll send instructions if an account exists.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(226,62,87,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Links row */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ff8fa3'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
              >
                ← Back to login
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 9,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                fontSize: 13, color: '#fca5a5',
              }}>
                ⚠ {error}
              </div>
            )}

            {/* Success message */}
            {success && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 9,
                background: 'rgba(52,211,153,0.1)',
                border: '1px solid rgba(52,211,153,0.25)',
                fontSize: 13, color: '#6ee7b7',
              }}>
                ✓ {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                padding: '13px',
                borderRadius: 11,
                fontSize: 14,
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none',
                background: loading
                  ? 'rgba(255,255,255,0.05)'
                  : 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                color: loading ? 'rgba(255,255,255,0.25)' : 'white',
                boxShadow: loading ? 'none' : '0 4px 24px rgba(226,62,87,0.35)',
                transition: 'all 0.25s',
              }}
            >
              {loading ? 'Please wait...' : 'Send reset link →'}
            </button>
          </form>

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 24 }}>
            MVP Free · No credit card · Independent project
          </p>
        </div>
      </div>
    </div>
  );
}
