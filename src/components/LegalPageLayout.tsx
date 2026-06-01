import React, { useEffect } from 'react';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  intro: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({ title, lastUpdated, intro, children }: LegalPageLayoutProps) {
  const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

  // Update document title for SEO
  useEffect(() => {
    document.title = `${title} | Sumalyze`;
    
    // Cleanup to restore default title
    return () => {
      document.title = 'Sumalyze';
    };
  }, [title]);

  return (
    <div style={{
      minHeight: '80vh',
      background: '#0a000f',
      color: 'white',
      fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: '120px 20px 80px',
    }}>
      <div style={{ maxWidth: 850, margin: '0 auto' }}>
        
        {/* Back Link */}
        {!isMaintenance && (
          <button
            onClick={() => {
              window.history.pushState(null, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            style={{
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
              marginBottom: 32,
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
        )}

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 14px',
            borderRadius: 32,
            background: 'rgba(226, 62, 87, 0.06)',
            border: '1px solid rgba(226, 62, 87, 0.2)',
            marginBottom: 16,
          }}>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: 'linear-gradient(90deg, #ff8fa3 0%, #E23E57 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Legal & Support</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: 12,
            fontFamily: 'Outfit, sans-serif'
          }}>
            {title}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.4)' }}>
              Last updated: {lastUpdated}
            </p>
          </div>
          {intro && (
            <p style={{ fontSize: 15, color: 'rgba(255, 255, 255, 0.6)', lineHeight: '24px', marginTop: 16, maxWidth: 720 }}>
              {intro}
            </p>
          )}
        </div>

        {/* Content sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {children}
        </div>

      </div>
    </div>
  );
}

interface LegalSectionProps {
  title: string;
  children: React.ReactNode;
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.015)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: 16,
      padding: '24px 28px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(226, 62, 87, 0.15), transparent)',
      }} />
      <h2 style={{
        fontSize: 18,
        fontWeight: 600,
        color: 'white',
        letterSpacing: '-0.01em',
        marginBottom: 14,
        fontFamily: 'Outfit, sans-serif'
      }}>
        {title}
      </h2>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.55)',
        lineHeight: '22px'
      }}>
        {children}
      </div>
    </div>
  );
}

interface LegalItemProps {
  label: string;
  children: React.ReactNode;
}

export function LegalItem({ label, children }: LegalItemProps) {
  return (
    <div style={{ marginTop: 8 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255, 255, 255, 0.75)', marginBottom: 4 }}>{label}</p>
      <div style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.5)', lineHeight: '22px' }}>{children}</div>
    </div>
  );
}
