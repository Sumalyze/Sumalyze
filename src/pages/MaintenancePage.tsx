import { useEffect, useState } from 'react';
import sumalyzeLogo from '../assets/sumalyzelogo.png';

/* ============================================================
   MaintenancePage — Sumalyze branded system reconnect screen
   Shown when VITE_MAINTENANCE_MODE === "true"
   ============================================================ */

export default function MaintenancePage() {
  const [pulse, setPulse] = useState(0);
  const [flowOffset, setFlowOffset] = useState(0);

  // Subtle animated flow along the cable line
  useEffect(() => {
    const id = setInterval(() => {
      setFlowOffset(prev => (prev + 1) % 100);
    }, 40);
    return () => clearInterval(id);
  }, []);

  // Pulse cycle for the connection node glow
  useEffect(() => {
    const id = setInterval(() => {
      setPulse(prev => (prev + 1) % 2);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#0a000f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      color: '#fff',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* ── Background atmosphere ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(226,62,87,0.055) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '120%', height: '50%', pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(113,47,255,0.04) 0%, transparent 70%)',
      }} />

      {/* Floating ambient orb left */}
      <div style={{
        position: 'absolute', top: '18%', left: '8%',
        width: 260, height: 260, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(226,62,87,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'maint-float 7s ease-in-out infinite',
      }} />
      {/* Floating ambient orb right */}
      <div style={{
        position: 'absolute', bottom: '15%', right: '6%',
        width: 200, height: 200, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(113,47,255,0.07) 0%, transparent 70%)',
        filter: 'blur(36px)',
        animation: 'maint-float 9s ease-in-out infinite reverse',
      }} />

      {/* ── Main content wrapper ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        width: '100%', maxWidth: 680, padding: '0 24px',
        textAlign: 'center',
      }}>

        {/* Logo */}
        <div className="animate-reveal" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 52 }}>
          <img src={sumalyzeLogo} alt="Sumalyze" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.85)' }}>
            Sumalyze
          </span>
        </div>

        {/* ── SVG Hero: System Reconnect Visual ── */}
        <div className="animate-reveal delay-100" style={{ marginBottom: 48, width: '100%' }}>
          <ReconnectVisual pulse={pulse} flowOffset={flowOffset} />
        </div>

        {/* Status tag */}
        <div className="animate-reveal delay-200" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24,
          padding: '5px 14px', borderRadius: 99,
          background: 'rgba(226,62,87,0.08)',
          border: '1px solid rgba(226,62,87,0.2)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#E23E57',
            animation: 'maint-blink 1.6s ease-in-out infinite',
            display: 'inline-block', flexShrink: 0,
          }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ff8fa3' }}>
            System Upgrade
          </span>
        </div>

        {/* Heading */}
        <h1 className="animate-reveal delay-300" style={{
          fontSize: 'clamp(36px, 7vw, 60px)',
          fontWeight: 500,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          margin: '0 0 20px',
        }}>
          <span style={{
            background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.75) 100%)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent', WebkitTextFillColor: 'transparent',
          }}>
            Under
          </span>{' '}
          <span style={{
            background: 'linear-gradient(180deg, #ff8fa3 0%, #E23E57 100%)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent', WebkitTextFillColor: 'transparent',
          }}>
            Maintenance
          </span>
        </h1>

        {/* Supporting text */}
        <p className="animate-reveal delay-400" style={{
          fontSize: 'clamp(15px, 2vw, 17px)',
          lineHeight: '1.7',
          color: 'rgba(239,237,253,0.58)',
          maxWidth: 460,
          margin: '0 0 12px',
        }}>
          We're refining Sumalyze for a cleaner, faster experience.<br />
          We'll be back soon.
        </p>

        {/* Micro text */}
        <p className="animate-reveal delay-500" style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.02em',
        }}>
          Thanks for your patience.
        </p>

      </div>

      {/* Keyframes injected inline */}
      <style>{`
        @keyframes maint-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-18px) scale(1.04); }
        }
        @keyframes maint-blink {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        @keyframes maint-node-pulse {
          0%, 100% { r: 7; opacity: 0.7; }
          50%       { r: 9; opacity: 1; }
        }
        @keyframes maint-glow-pulse {
          0%, 100% { opacity: 0.25; }
          50%       { opacity: 0.65; }
        }
        @keyframes maint-dash {
          to { stroke-dashoffset: -30; }
        }
      `}</style>
    </div>
  );
}

/* ── Reconnect SVG illustration ── */
function ReconnectVisual({ pulse, flowOffset }: { pulse: number; flowOffset: number }) {
  const W = 320;
  const H = 200;

  // Cable path: left socket → midpoint → right socket
  const path = `M 42,${H / 2} C 110,${H / 2} 110,${H / 2 - 28} ${W / 2},${H / 2 - 28} C ${W - 110},${H / 2 - 28} ${W - 110},${H / 2} ${W - 42},${H / 2}`;

  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      width: '100%',
      maxWidth: 360,
    }}>
      {/* Glow halo behind the center node */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -58%)',
        width: 120, height: 120, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(226,62,87,0.18) 0%, transparent 70%)',
        filter: 'blur(18px)',
        animation: 'maint-glow-pulse 2.2s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="auto"
        style={{ display: 'block', overflow: 'visible', position: 'relative', zIndex: 1 }}
      >
        <defs>
          {/* Cable gradient */}
          <linearGradient id="cableGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="50%" stopColor="rgba(226,62,87,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
          </linearGradient>

          {/* Flow particle gradient */}
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,143,163,0)" />
            <stop offset="50%" stopColor="rgba(255,143,163,0.8)" />
            <stop offset="100%" stopColor="rgba(255,143,163,0)" />
          </linearGradient>

          {/* Outer socket body gradient */}
          <linearGradient id="socketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>

          {/* Center node glow filter */}
          <filter id="nodeGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Cable shadow filter */}
          <filter id="cableShadow" x="-10%" y="-100%" width="120%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Left socket body ── */}
        <rect x="8" y={H / 2 - 18} width="34" height="36" rx="6"
          fill="url(#socketGrad)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* Socket pin holes */}
        <rect x="15" y={H / 2 - 8} width="4" height="16" rx="2" fill="rgba(0,0,0,0.5)" />
        <rect x="23" y={H / 2 - 8} width="4" height="16" rx="2" fill="rgba(0,0,0,0.5)" />
        <rect x="31" y={H / 2 - 8} width="4" height="16" rx="2" fill="rgba(0,0,0,0.5)" />
        {/* Subtle indicator LED */}
        <circle cx="21" cy={H / 2 - 14} r="2.5"
          fill={pulse === 1 ? '#E23E57' : 'rgba(226,62,87,0.25)'}
          style={{ transition: 'fill 1s ease' }} />

        {/* ── Right socket body ── */}
        <rect x={W - 42} y={H / 2 - 18} width="34" height="36" rx="6"
          fill="url(#socketGrad)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <rect x={W - 35} y={H / 2 - 8} width="4" height="16" rx="2" fill="rgba(0,0,0,0.5)" />
        <rect x={W - 27} y={H / 2 - 8} width="4" height="16" rx="2" fill="rgba(0,0,0,0.5)" />
        <rect x={W - 19} y={H / 2 - 8} width="4" height="16" rx="2" fill="rgba(0,0,0,0.5)" />
        <circle cx={W - 21} cy={H / 2 - 14} r="2.5"
          fill={pulse === 0 ? '#E23E57' : 'rgba(226,62,87,0.25)'}
          style={{ transition: 'fill 1s ease' }} />

        {/* ── Cable track (background glow trace) ── */}
        <path d={path} fill="none"
          stroke="rgba(226,62,87,0.06)" strokeWidth="8" strokeLinecap="round" />

        {/* ── Cable main line ── */}
        <path d={path} fill="none"
          stroke="url(#cableGrad)" strokeWidth="2" strokeLinecap="round"
          filter="url(#cableShadow)" />

        {/* ── Animated flow dots along cable ── */}
        <path d={path} fill="none"
          stroke="url(#flowGrad)" strokeWidth="2" strokeLinecap="round"
          strokeDasharray="20 80"
          strokeDashoffset={-flowOffset}
          opacity="0.7" />
        {/* Second stagger layer */}
        <path d={path} fill="none"
          stroke="rgba(255,143,163,0.3)" strokeWidth="1.5" strokeLinecap="round"
          strokeDasharray="8 92"
          strokeDashoffset={-(flowOffset + 45)}
          opacity="0.5" />

        {/* ── Center node ── */}
        {/* Outer ring */}
        <circle cx={W / 2} cy={H / 2 - 28} r="20"
          fill="rgba(226,62,87,0.05)"
          stroke="rgba(226,62,87,0.18)" strokeWidth="1" />
        {/* Inner ring */}
        <circle cx={W / 2} cy={H / 2 - 28} r="13"
          fill="rgba(226,62,87,0.08)"
          stroke="rgba(226,62,87,0.25)" strokeWidth="1" />
        {/* Core dot with glow */}
        <circle cx={W / 2} cy={H / 2 - 28} r="6"
          fill="#E23E57"
          filter="url(#nodeGlow)"
          style={{ animation: 'maint-node-pulse 2.2s ease-in-out infinite' }} />

        {/* ── Tick marks on the cable corners (tuning aesthetic) ── */}
        {[0.25, 0.5, 0.75].map((t, i) => {
          // Approximate points along the arc for visual tick markers
          const x = 42 + (W - 84) * t;
          const y = H / 2 - (t === 0.5 ? 28 : 14);
          return (
            <g key={i} opacity={i === 1 ? 0.5 : 0.2}>
              <line x1={x} y1={y - 5} x2={x} y2={y + 5}
                stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            </g>
          );
        })}

        {/* ── Corner data labels ── */}
        <text x="18" y={H / 2 + 28} fontSize="8"
          fill="rgba(255,255,255,0.2)" textAnchor="middle" fontFamily="monospace">
          PORT_A
        </text>
        <text x={W - 18} y={H / 2 + 28} fontSize="8"
          fill="rgba(255,255,255,0.2)" textAnchor="middle" fontFamily="monospace">
          PORT_B
        </text>
        <text x={W / 2} y={H / 2 - 48} fontSize="8"
          fill="rgba(226,62,87,0.45)" textAnchor="middle" fontFamily="monospace">
          RECONNECTING...
        </text>
      </svg>
    </div>
  );
}
