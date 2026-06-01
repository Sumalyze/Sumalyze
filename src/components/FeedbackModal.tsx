import { useState, useEffect } from 'react';
import { saveUserFeedback } from '../services/database';
import { useAuth } from '../hooks/useAuth';
import sumalyzeLogo from '../assets/sumalyzelogo.png';
import { captureEvent } from '../lib/analytics';
import TurnstileWidget from './TurnstileWidget';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = 'bug' | 'suggestion' | 'other';

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { user } = useAuth();
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('suggestion');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const isTurnstileRequired = !!import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const canSubmit = message.trim().length > 0 && (!isTurnstileRequired || !!turnstileToken) && !loading;

  useEffect(() => {
    if (isOpen) {
      captureEvent('feedback_modal_opened');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError('Please provide a message for your feedback.');
      return;
    }

    if (trimmedMessage.length > 1000) {
      setError('Feedback message cannot exceed 1000 characters.');
      return;
    }

    if (rating !== null && (rating < 1 || rating > 5)) {
      setError('Rating must be between 1 and 5.');
      return;
    }

    setLoading(true);
    try {
      // 1. Save to Supabase database (client-side)
      const { error: dbError } = await saveUserFeedback(feedbackType, trimmedMessage, rating);
      if (dbError) {
        console.warn('[FeedbackModal] Supabase save failed:', dbError);
      }

      // 2. Capitalize category for Netlify validation
      const capitalizedCategory = feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1);

      // 3. POST data to the transactional email endpoint
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-turnstile-token': turnstileToken || '',
        },
        body: JSON.stringify({
          category: capitalizedCategory,
          message: trimmedMessage,
          rating: rating || undefined,
          userEmail: user?.email || undefined,
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          turnstileToken: turnstileToken || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Server failed to send feedback notification email.');
      }

      captureEvent('feedback_submitted', {
        category: feedbackType,
        has_rating: rating !== null,
        rating: rating || undefined,
        is_authenticated: !!user,
      });

      setSuccess('Thank you! Your feedback has been submitted successfully.');
      setMessage('');
      setRating(null);
      setTurnstileToken(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setTurnstileToken(null);
      setTurnstileKey(prev => prev + 1);
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
          animation: 'backdropFadeIn 0.2s ease both',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        width: 'calc(100% - 32px)', maxWidth: 460,
        background: 'rgba(14,4,22,0.97)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: '36px 28px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        animation: 'modalFadeInCenter 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
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
          <img src={sumalyzeLogo} alt="Sumalyze logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span style={{ fontSize: 16, fontWeight: 500, color: 'white' }}>Sumalyze</span>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: 22, fontWeight: 500, color: 'white', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Share Your Feedback
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
          Spotted a bug? Have a suggestion? We'd love to hear your thoughts to improve Sumalyze.
        </p>

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', textAlign: 'center', padding: '20px 0 10px' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, color: '#34d399'
            }}>✓</div>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: '22px' }}>{success}</p>
            <button
              onClick={onClose}
              style={{
                padding: '10px 24px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                background: 'rgba(255,255,255,0.06)',
                color: 'white',
                marginTop: 8,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Feedback Type Selector */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Category
              </label>
              <div style={{
                display: 'flex', gap: 4,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: 4,
              }}>
                {(['suggestion', 'bug', 'other'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFeedbackType(t)}
                    style={{
                      flex: 1, padding: '8px 4px', borderRadius: 7, fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: feedbackType === t ? 'rgba(226,62,87,0.15)' : 'transparent',
                      border: feedbackType === t ? '1px solid rgba(226,62,87,0.3)' : '1px solid transparent',
                      color: feedbackType === t ? '#ff8fa3' : 'rgba(255,255,255,0.45)',
                      textTransform: 'capitalize',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Rating */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Rating <span style={{ textTransform: 'none', color: 'rgba(255,255,255,0.25)', fontWeight: 'normal' }}>(Optional)</span>
              </label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating !== null ? hoverRating : rating || 0) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star === rating ? null : star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        fontSize: 22,
                        color: isActive ? '#ff8fa3' : 'rgba(255,255,255,0.12)',
                        transition: 'color 0.15s, transform 0.1s',
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      ★
                    </button>
                  );
                })}
                {rating && (
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginLeft: 8 }}>
                    {rating} / 5
                  </span>
                )}
              </div>
            </div>

            {/* Message Area */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Your Message
                </label>
                <span style={{ fontSize: 11, color: message.length > 900 ? '#ff8fa3' : 'rgba(255,255,255,0.25)' }}>
                  {message.length} / 1000
                </span>
              </div>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value.slice(0, 1000))}
                placeholder={
                  feedbackType === 'bug'
                    ? "Describe what happened and how to reproduce the issue..."
                    : feedbackType === 'suggestion'
                    ? "What feature or improvement would you like to see?"
                    : "Write your comments or questions here..."
                }
                rows={5}
                style={{ ...inputStyle, resize: 'none', lineHeight: '20px' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(226,62,87,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Error Message */}
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

            {/* Cloudflare Turnstile Verification */}
            {isTurnstileRequired && (
              <TurnstileWidget
                key={turnstileKey}
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
                onError={() => setTurnstileToken(null)}
              />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                marginTop: 4,
                padding: '13px',
                borderRadius: 11,
                fontSize: 14,
                fontWeight: 500,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                border: 'none',
                background: !canSubmit
                  ? 'rgba(255,255,255,0.05)'
                  : 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                color: !canSubmit ? 'rgba(255,255,255,0.25)' : 'white',
                boxShadow: !canSubmit ? 'none' : '0 4px 24px rgba(226,62,87,0.35)',
                transition: 'all 0.25s',
              }}
            >
              {loading ? 'Submitting...' : 'Submit Feedback →'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
