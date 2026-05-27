import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message || 'Could not send reset email.');
        } else {
          setSuccess('Password reset email sent. Check your inbox.');
        }
      } else if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message || 'Invalid email or password.');
        } else {
          onClose();
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message || 'Could not create account.');
        } else {
          setSuccess('Check your email to confirm your account.');
        }
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
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          animation: 'fadeUp 0.2s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        width: 'calc(100% - 32px)', maxWidth: 420,
        background: 'rgba(14,4,22,0.97)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: '36px 28px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        animation: 'fadeUp 0.25s ease',
        boxSizing: 'border-box',
      }}>
        {/* Top gradient accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(226,62,87,0.5), transparent)',
          borderRadius: '20px 20px 0 0',
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.4)',
            fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✕</button>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
            boxShadow: '0 4px 14px rgba(226,62,87,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M3 5h12M3 9h8M3 13h10" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
              <circle cx="14" cy="13" r="2" fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 500, color: 'white' }}>Sumalyze</span>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: 22, fontWeight: 500, color: 'white', letterSpacing: '-0.02em', marginBottom: 6 }}>
          {mode === 'login' ? 'Welcome back' : mode === 'forgot' ? 'Reset password' : 'Create account'}
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
          {mode === 'login'
            ? 'Sign in to your Sumalyze account'
            : mode === 'forgot'
            ? 'Enter your email and we\'ll send a reset link'
            : 'Free forever — no credit card required'}
        </p>

        {/* Mode tabs — only login/signup */}
        {mode !== 'forgot' && (
          <div style={{
            display: 'flex', gap: 4,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10, padding: 4, marginBottom: 24,
          }}>
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); setSuccess(null); }}
                style={{
                  flex: 1, padding: '8px', borderRadius: 7, fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: mode === m ? 'rgba(226,62,87,0.15)' : 'transparent',
                  border: mode === m ? '1px solid rgba(226,62,87,0.3)' : '1px solid transparent',
                  color: mode === m ? '#ff8fa3' : 'rgba(255,255,255,0.45)',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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

          {/* Password — hidden in forgot mode */}
          {mode !== 'forgot' && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(226,62,87,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          )}

          {/* Forgot password link */}
          {mode === 'login' && (
            <button
              type="button"
              onClick={() => { setMode('forgot'); setError(null); setSuccess(null); }}
              style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'inherit' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ff8fa3'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
            >
              Forgot password?
            </button>
          )}

          {/* Back link in forgot mode */}
          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
              style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'inherit' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ff8fa3'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
            >
              ← Back to sign in
            </button>
          )}

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
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : mode === 'forgot' ? 'Send Reset Email →' : 'Create Account →'}
          </button>
        </form>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 20 }}>
          Free forever · No credit card · Nonprofit
        </p>
      </div>
    </>
  );
}
