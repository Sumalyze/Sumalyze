// src/pages/NotFoundPage.tsx
import { useEffect, useState } from 'react';

type Page = 'home' | 'privacy' | 'terms' | 'cookies' | 'refund' | 'billing' | 'data-deletion' | 'support' | 'tools' | 'tooldetail' | 'agent' | 'workflows' | 'usecases' | 'history' | 'pricing' | 'login' | 'signup' | 'forgot-password' | 'settings' | 'team-workspace' | 'notfound';

interface NotFoundPageProps {
  onNavigate: (p: Page) => void;
}

export default function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  const [homeHovered, setHomeHovered] = useState(false);
  const [toolsHovered, setToolsHovered] = useState(false);

  useEffect(() => {
    document.title = '404 - Page Not Found | Sumalyze';
    return () => {
      document.title = 'Sumalyze — AI Clarity Workspace';
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a000f',
      color: '#fff',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glowing spots */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(226,62,87,0.12) 0%, transparent 70%)',
        filter: 'blur(40px)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 480, width: '100%' }}>
        <div style={{
          fontSize: 'clamp(80px, 15vw, 120px)',
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.05em',
          background: 'linear-gradient(180deg, #fff 20%, rgba(255,255,255,0.15) 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          marginBottom: 16,
          fontFamily: 'Outfit, sans-serif'
        }}>
          404
        </div>

        <h1 style={{
          fontSize: 'clamp(20px, 4vw, 24px)',
          fontWeight: 500,
          color: 'white',
          margin: '0 0 12px',
          letterSpacing: '-0.02em',
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.5)',
          lineHeight: '22px',
          margin: '0 0 32px',
        }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
        </p>

        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => onNavigate('home')}
            onMouseEnter={() => setHomeHovered(true)}
            onMouseLeave={() => setHomeHovered(false)}
            style={{
              padding: '12px 24px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: homeHovered ? '0 4px 20px rgba(226,62,87,0.45)' : '0 4px 16px rgba(226,62,87,0.25)',
              transform: homeHovered ? 'translateY(-1px)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Go to Homepage
          </button>

          <button
            onClick={() => onNavigate('tools')}
            onMouseEnter={() => setToolsHovered(true)}
            onMouseLeave={() => setToolsHovered(false)}
            style={{
              padding: '12px 24px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              background: toolsHovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
              color: toolsHovered ? 'white' : 'rgba(255,255,255,0.7)',
              border: toolsHovered ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transform: toolsHovered ? 'translateY(-1px)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Explore AI Tools
          </button>
        </div>
      </div>
    </div>
  );
}
