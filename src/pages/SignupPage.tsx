import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import sumalyzeLogo from '../assets/sumalyzelogo.png';
import { captureEvent } from '../lib/analytics';

type Page = 'home' | 'privacy' | 'terms' | 'cookies' | 'refund' | 'billing' | 'data-deletion' | 'support' | 'tools' | 'tooldetail' | 'agent' | 'workflows' | 'usecases' | 'history' | 'pricing' | 'login' | 'signup' | 'forgot-password' | 'settings';

interface SignupPageProps {
  onNavigate: (p: Page) => void;
}

export default function SignupPage({ onNavigate }: SignupPageProps) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Sign Up | Sumalyze';
    return () => {
      document.title = 'Sumalyze';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    captureEvent('signup_started');

    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message || 'Could not create account.');
      } else {
        captureEvent('signup_completed');
        setSuccess('Check your email to confirm your account.');
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
            Create your account
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
            Save your work, export results, and keep clarity in one place.
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

            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(226,62,87,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(226,62,87,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Link row */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ff8fa3'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
              >
                Already have an account? Log in
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
              {loading ? 'Please wait...' : 'Create Account →'}
            </button>
          </form>

          {/* Legal Notice */}
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: 24, lineHeight: '16px' }}>
            By creating an account, you agree to our{' '}
            <button
              onClick={() => onNavigate('terms')}
              style={{ display: 'inline', background: 'none', border: 'none', padding: 0, margin: 0, fontSize: 'inherit', color: '#ff8fa3', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button
              onClick={() => onNavigate('privacy')}
              style={{ display: 'inline', background: 'none', border: 'none', padding: 0, margin: 0, fontSize: 'inherit', color: '#ff8fa3', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Privacy Policy
            </button>.
          </p>

          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 12 }}>
            MVP Free · No credit card · Independent project
          </p>
        </div>
      </div>
    </div>
  );
}
