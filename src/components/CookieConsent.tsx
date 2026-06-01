import { useState, useEffect } from 'react';
import { getCookieConsent, saveCookieConsent, DEFAULT_CONSENT, type CookieConsent } from '../lib/cookieConsent';

export default function CookieConsentComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [preferences, setPreferences] = useState<CookieConsent>(DEFAULT_CONSENT);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      // Show consent banner on first visit
      setIsOpen(true);
    } else {
      setPreferences(consent);
    }
  }, []);

  useEffect(() => {
    const handleOpenSettings = () => {
      const currentConsent = getCookieConsent() || DEFAULT_CONSENT;
      setPreferences(currentConsent);
      setIsCustomizing(true);
      setIsOpen(true);
    };
    window.addEventListener('sumalyze-open-cookie-settings', handleOpenSettings);
    return () => window.removeEventListener('sumalyze-open-cookie-settings', handleOpenSettings);
  }, []);

  const handleAcceptAll = () => {
    const allConsent: CookieConsent = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: false, // Explicitly false as we do not use marketing cookies
    };
    saveCookieConsent(allConsent);
    setPreferences(allConsent);
    setIsOpen(false);
    setIsCustomizing(false);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly: CookieConsent = {
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
    };
    saveCookieConsent(necessaryOnly);
    setPreferences(necessaryOnly);
    setIsOpen(false);
    setIsCustomizing(false);
  };

  const handleSaveCustom = () => {
    saveCookieConsent(preferences);
    setIsOpen(false);
    setIsCustomizing(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 48px)',
      maxWidth: 760,
      background: 'rgba(12, 4, 20, 0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(226, 62, 87, 0.15)',
      borderRadius: 16,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(226, 62, 87, 0.05)',
      color: 'white',
      padding: '24px',
      zIndex: 99999,
      fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translate(-50%, 60px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .cookie-toggle-label {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .cookie-toggle-input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .cookie-toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(255, 255, 255, 0.1);
          transition: .3s;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .cookie-toggle-slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 3px;
          bottom: 3px;
          background-color: rgba(255, 255, 255, 0.6);
          transition: .3s;
          border-radius: 50%;
        }
        .cookie-toggle-input:checked + .cookie-toggle-slider {
          background-color: rgba(226, 62, 87, 0.8);
          border-color: rgba(226, 62, 87, 0.3);
        }
        .cookie-toggle-input:checked + .cookie-toggle-slider:before {
          transform: translateX(20px);
          background-color: white;
        }
        .cookie-toggle-input:disabled + .cookie-toggle-slider {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}} />

      {!isCustomizing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff8fa3 0%, #E23E57 100%)',
              marginTop: 6,
              flexShrink: 0,
              boxShadow: '0 0 10px rgba(226, 62, 87, 0.6)'
            }} />
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 4, fontFamily: 'Outfit, sans-serif' }}>
                Cookie Preferences
              </h3>
              <p style={{ fontSize: 13.5, color: 'rgba(255, 255, 255, 0.65)', lineHeight: '20px' }}>
                We use cookies to secure our workspace, save your preferences, and understand feature usage via privacy-safe, anonymized analytics (PostHog). Read our{' '}
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState(null, '', '/cookies');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  style={{ color: '#ff8fa3', textDecoration: 'underline', fontWeight: 500 }}
                >
                  Cookie Policy
                </a>{' '}
                for details.
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            gap: 10,
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: 16
          }}>
            <button
              onClick={() => setIsCustomizing(true)}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.7)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '8px 16px',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              }}
            >
              Customize
            </button>
            <button
              onClick={handleAcceptNecessary}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.7)',
                background: 'transparent',
                border: '1px solid transparent',
                padding: '8px 16px',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              Necessary only
            </button>
            <button
              onClick={handleAcceptAll}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'white',
                background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                border: 'none',
                padding: '8px 20px',
                borderRadius: 8,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(226, 62, 87, 0.25)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 16px rgba(226, 62, 87, 0.35)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(226, 62, 87, 0.25)'}
            >
              Accept all
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 4, fontFamily: 'Outfit, sans-serif' }}>
              Customize Cookie Settings
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.5)', lineHeight: '18px' }}>
              Choose which categories of cookies and local storage items you are willing to allow.
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 12,
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.04)'
          }}>
            {/* Category: Necessary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ paddingRight: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>Strictly Necessary</span>
                  <span style={{ fontSize: 10, background: 'rgba(255, 255, 255, 0.06)', color: 'rgba(255, 255, 255, 0.5)', padding: '2px 6px', borderRadius: 4 }}>Required</span>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.45)', marginTop: 2 }}>
                  Used for account login, session persistence, secure form submissions, and fundamental rate limiting.
                </p>
              </div>
              <div>
                <label className="cookie-toggle-label">
                  <input type="checkbox" className="cookie-toggle-input" checked disabled />
                  <span className="cookie-toggle-slider" />
                </label>
              </div>
            </div>

            {/* Category: Preferences */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: 14 }}>
              <div style={{ paddingRight: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>Preferences</span>
                <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.45)', marginTop: 2 }}>
                  Remembers dashboard choices, workspace visual preferences, theme toggles, and waitlist submission flags.
                </p>
              </div>
              <div>
                <label className="cookie-toggle-label">
                  <input
                    type="checkbox"
                    className="cookie-toggle-input"
                    checked={preferences.preferences}
                    onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                  />
                  <span className="cookie-toggle-slider" />
                </label>
              </div>
            </div>

            {/* Category: Analytics */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: 14 }}>
              <div style={{ paddingRight: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>Analytics (PostHog)</span>
                <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.45)', marginTop: 2 }}>
                  Enables privacy-safe product analytics. No raw text/document contents or full emails are ever tracked.
                </p>
              </div>
              <div>
                <label className="cookie-toggle-label">
                  <input
                    type="checkbox"
                    className="cookie-toggle-input"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  />
                  <span className="cookie-toggle-slider" />
                </label>
              </div>
            </div>

            {/* Category: Marketing */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: 14 }}>
              <div style={{ paddingRight: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>Marketing & Tracking</span>
                  <span style={{ fontSize: 10, background: 'rgba(255, 255, 255, 0.06)', color: 'rgba(255, 255, 255, 0.4)', padding: '2px 6px', borderRadius: 4 }}>Not Used</span>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.45)', marginTop: 2 }}>
                  We do not use marketing pixels, Facebook integrations, or ad trackers.
                </p>
              </div>
              <div>
                <label className="cookie-toggle-label">
                  <input type="checkbox" className="cookie-toggle-input" checked={false} disabled />
                  <span className="cookie-toggle-slider" />
                </label>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: 16
          }}>
            <button
              onClick={() => setIsCustomizing(false)}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.5)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
            >
              ← Back
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleAcceptNecessary}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.7)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '8px 16px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                Necessary only
              </button>
              <button
                onClick={handleSaveCustom}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'white',
                  background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(226, 62, 87, 0.25)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 16px rgba(226, 62, 87, 0.35)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(226, 62, 87, 0.25)'}
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
