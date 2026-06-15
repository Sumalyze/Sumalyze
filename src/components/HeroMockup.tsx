import { useState, useEffect } from 'react';

export default function HeroMockup() {
  const [pulseActive, setPulseActive] = useState(0);
  const [loadingStep, setLoadingStep] = useState<'initializing' | 'reading' | 'done'>('initializing');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      setLoadingStep('done');
      return;
    }

    // Fast loading hook visual sequence
    const initTimer = setTimeout(() => {
      setLoadingStep('reading');
    }, 600);

    const doneTimer = setTimeout(() => {
      setLoadingStep('done');
    }, 1200);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    if (loadingStep !== 'done') return;

    const interval = setInterval(() => {
      setPulseActive(prev => (prev + 1) % 3);
    }, 6300);
    return () => clearInterval(interval);
  }, [loadingStep]);

  return (
    <div className="animate-reveal delay-300 restore-fonts" style={{
      position: 'relative',
      maxWidth: 620,
      width: '100%',
      margin: '0 auto',
      background: loadingStep !== 'done' ? '#0b0112' : 'linear-gradient(135deg, rgba(20, 10, 30, 0.4) 0%, rgba(10, 5, 20, 0.6) 100%)',
      border: '1px solid rgba(226, 62, 87, 0.18)',
      borderRadius: 16,
      boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 0 20px rgba(226, 62, 87, 0.08)',
      overflow: 'hidden',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      transition: 'background 0.3s ease',
    }}>
      {/* Window Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
        </div>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>sumalyze_workspace_v1.2</span>
        <div style={{ width: 38 }} />
      </div>

      {/* Workspace Content Panel */}
      <div style={{ display: 'flex', minHeight: 280, position: 'relative' }} className="workspace-flex-layout">
        <style>{`
          @media(max-width: 540px) {
            .workspace-flex-layout {
              flex-direction: column !important;
            }
            .workspace-left-pane {
              border-right: none !important;
              border-bottom: 1px solid rgba(255,255,255,0.06) !important;
            }
          }
        `}</style>

        {loadingStep !== 'done' ? (
          /* Loading visual hook overlay */
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#0b0112',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            zIndex: 10,
            transition: 'opacity 0.3s ease',
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '2px solid rgba(226, 62, 87, 0.1)',
              borderTopColor: '#ff8fa3',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        ) : null}

        {/* Left Side: Mock Text Editor */}
        <div className="workspace-left-pane" style={{ flex: 1.2, padding: 18, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 600 }}>Input Document</span>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#E23E57', animation: reducedMotion ? 'none' : 'premiumPulse 1.5s infinite' }} />
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', fontFamily: 'monospace' }}>
            <p style={{ margin: '0 0 10px 0', padding: '4px', borderRadius: 4, background: pulseActive === 0 ? 'rgba(226, 62, 87, 0.12)' : 'transparent', transition: 'background 0.5s ease' }}>
              <span style={{ color: pulseActive === 0 ? '#ff8fa3' : 'inherit' }}>"I guess if you're too busy, that is fine. I'll wait."</span>
            </p>
            <p style={{ margin: '0 0 10px 0', padding: '4px', borderRadius: 4, background: pulseActive === 1 ? 'rgba(129, 140, 248, 0.12)' : 'transparent', transition: 'background 0.5s ease' }}>
              <span style={{ color: pulseActive === 1 ? '#a5b4fc' : 'inherit' }}>"We need final deliverables by Friday noon."</span>
            </p>
            <p style={{ margin: 0, padding: '4px', borderRadius: 4, background: pulseActive === 2 ? 'rgba(52, 211, 153, 0.12)' : 'transparent', transition: 'background 0.5s ease' }}>
              <span style={{ color: pulseActive === 2 ? '#6ee7b7' : 'inherit' }}>"Let's call to iron out launch details. Thanks, Sarah."</span>
            </p>
            <span className="cursor-blink" />
          </div>
        </div>

        {/* Right Side: Analysis Engine */}
        <div style={{ flex: 1, padding: 18, background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 600 }}>AI Intelligence</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'center' }}>
            
            {/* Summary Card */}
            <div style={{
              background: 'rgba(226, 62, 87, 0.04)',
              border: '1px solid rgba(226, 62, 87, 0.15)',
              borderRadius: 8, padding: '10px 14px',
              transform: pulseActive === 0 ? 'scale(1.03)' : 'scale(1)',
              opacity: pulseActive === 0 ? 1 : 0.4,
              transition: 'all 0.5s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: '#ff8fa3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Summary</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Distilled</span>
              </div>
              <p style={{ fontSize: 11, fontWeight: 500, color: 'white', margin: 0 }}>Confirm project launch and deadline.</p>
            </div>

            {/* Tone Card */}
            <div style={{
              background: 'rgba(129, 140, 248, 0.04)',
              border: '1px solid rgba(129, 140, 248, 0.15)',
              borderRadius: 8, padding: '10px 14px',
              transform: pulseActive === 1 ? 'scale(1.03)' : 'scale(1)',
              opacity: pulseActive === 1 ? 1 : 0.4,
              transition: 'all 0.5s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: '#a5b4fc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tone & Signals</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Analyzed</span>
              </div>
              <p style={{ fontSize: 11, fontWeight: 500, color: 'white', margin: 0 }}>Passive-Aggressive · Urgent 🚨</p>
            </div>

            {/* Action Steps Card */}
            <div style={{
              background: 'rgba(52, 211, 153, 0.04)',
              border: '1px solid rgba(52, 211, 153, 0.15)',
              borderRadius: 8, padding: '10px 14px',
              transform: pulseActive === 2 ? 'scale(1.03)' : 'scale(1)',
              opacity: pulseActive === 2 ? 1 : 0.4,
              transition: 'all 0.5s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: '#6ee7b7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action Steps</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Extracted</span>
              </div>
              <p style={{ fontSize: 11, fontWeight: 500, color: 'white', margin: 0, lineHeight: 1.4 }}>
                • Friday noon deadline<br/>
                • Set launch call
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
