import { useState, useEffect, useRef } from 'react';
import { analyzeText } from './utils/mockAnalyzer';
import type { AnalysisResult } from './utils/mockAnalyzer';

/* ============================================================
   REFLECT-IDENTICAL STRUCTURE — Sumalyze Branding
   ============================================================ */

export default function App() {
  return (
    <div style={{ background: '#0a000f', color: '#fff', minHeight: '100vh', overflowX: 'hidden', fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>
      <Header />
      <Hero />
      <TrustedBy />
      <ProductSection />
      <SuperpowerSection />
      <ModulesSection />
      <AISectionBlock />
      <UseCasesSection />
      <DonationSection />
      <TestimonialsSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ============================================================
   HEADER — Pill nav centered, logo left, login+cta right
   ============================================================ */
function Header() {
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
      padding: '0 20px',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      background: scrolled ? 'rgba(10,0,15,0.85)' : 'rgba(10,0,15,0.08)',
      transition: 'background 0.3s ease',
    }}>
      <div style={{ maxWidth: 1248, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0', position: 'relative' }}>
        {/* Bottom border gradient */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'radial-gradient(62.87% 100% at 50% 100%, rgba(226,62,87,0.15) 0%, transparent 100%)' }} />

        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'white', zIndex: 2 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
            boxShadow: '0 4px 14px rgba(226,62,87,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 5h12M3 9h8M3 13h10" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
              <circle cx="14" cy="13" r="2" fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.01em' }}>Sumalyze</span>
        </a>

        {/* Center pill nav */}
        <nav style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 999, display: 'flex', padding: '10px 12px',
        }} className="header-nav-desktop">
          {[
            { label: 'Features', href: '#features' },
            { label: 'Demo', href: '#demo' },
            { label: 'Modules', href: '#modules' },
            { label: 'Mission', href: '#mission' },
          ].map(l => (
            <li key={l.label} style={{ listStyle: 'none', margin: '0 12px' }}>
              <a href={l.href} style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}>
                {l.label}
              </a>
            </li>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 2 }}>
          <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontWeight: 500 }}>
            Support Us
          </a>
          <HeaderBtn href="#demo">Try Demo</HeaderBtn>
        </div>
      </div>
    </header>
  );
}

function HeaderBtn({ href, children, onClick }: { href?: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <a href={href} onClick={onClick}
      style={{
        display: 'block', padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#f4f0ff',
        textDecoration: 'none', position: 'relative',
        background: 'linear-gradient(180deg, rgba(60,8,126,0) 0%, rgba(60,8,126,0.32) 100%), rgba(113,47,255,0.12)',
        boxShadow: 'inset 0 0 12px rgba(191,151,255,0.24)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(207,184,255,0.2)',
        cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(180deg, rgba(60,8,126,0) 0%, rgba(60,8,126,0.42) 100%), rgba(113,47,255,0.24)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(180deg, rgba(60,8,126,0) 0%, rgba(60,8,126,0.32) 100%), rgba(113,47,255,0.12)'; }}>
      {children}
    </a>
  );
}

/* ============================================================
   HERO — Badge + huge title + subtitle + CTAs + Black Hole
   ============================================================ */
function Hero() {
  const scrollToDemo = () => {
    const el = document.getElementById('demo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{ paddingTop: 160, position: 'relative', textAlign: 'center' }}>
      {/* Background radial glow */}
      <div style={{ position: 'absolute', top: -173, left: '50%', transform: 'translateX(-50%)', width: 1440, height: 900, background: 'radial-gradient(37.74% 81.78% at 50% 26.56%, rgba(226,62,87,0.07) 0%, rgba(10,0,15,0) 100%)', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
        {/* AI Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, margin: '0 auto 20px', padding: '5px 14px 5px 10px', borderRadius: 32,
          backdropFilter: 'blur(6px)', boxShadow: 'inset 0 -7px 11px rgba(226,62,87,0.12)',
          border: '1px solid rgba(226,62,87,0.25)', background: 'rgba(226,62,87,0.06)' }}>
          <SparkleIcon />
          <span style={{ background: 'linear-gradient(90deg, #ff8fa3 0%, #E23E57 50%, #ff8fa3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: 14, fontWeight: 500 }}>
            AI Communication Intelligence
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500, fontSize: 'clamp(44px, 7vw, 72px)', lineHeight: '1.1', letterSpacing: '-0.03em', margin: '0 0 16px' }}>
          <span style={{ background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', display: 'block' }}>
            Understand any message
          </span>
          <span style={{ background: 'linear-gradient(180deg, #ff8fa3 0%, #E23E57 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', display: 'block' }}>
            in seconds.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: 18, lineHeight: '28px', color: 'rgba(239,237,253,0.7)', margin: '0 auto 40px', maxWidth: 480 }}>
          Summarize text, detect tone, find intent, highlight emotional signals, and reply smarter — free, always.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          <button onClick={scrollToDemo}
            style={{ padding: '12px 24px', borderRadius: 10, fontSize: 15, fontWeight: 500, color: '#f4f0ff', cursor: 'pointer', border: '1px solid rgba(207,184,255,0.2)', background: 'linear-gradient(180deg, rgba(60,8,126,0) 0%, rgba(60,8,126,0.32) 100%), rgba(113,47,255,0.12)', boxShadow: 'inset 0 0 12px rgba(191,151,255,0.24)', backdropFilter: 'blur(8px)' }}>
            Try Demo — free
          </button>
          <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer"
            style={{ padding: '12px 24px', borderRadius: 10, fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)' }}>
            ♥ Support on Ko-fi
          </a>
        </div>

        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 0 }}>
          100% free · No sign-up required · Nonprofit
        </p>
      </div>

      {/* Black Hole Visual */}
      <BlackHole />
    </section>
  );
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2 L9.8 6.5 L14 7 L9.8 7.5 L9 12 L8.2 7.5 L4 7 L8.2 6.5 Z" fill="url(#sg)" />
      <defs>
        <linearGradient id="sg" x1="4" y1="12" x2="14" y2="2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E23E57" />
          <stop offset="1" stopColor="#ff8fa3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width = 808;
    const H = canvas.height = 808;
    const cx = W / 2, cy = H / 2;

    // Stars
    const stars: { x: number; y: number; a: number; speed: number; angle: number }[] = [];
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 220 + Math.random() * 160;
      stars.push({ x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist, a: Math.random(), speed: 0.0005 + Math.random() * 0.001, angle });
    }

    let frame = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw rings
      const rings = [
        { r: 404, opacity: 0.18 },
        { r: 304, opacity: 0.22 },
        { r: 208, opacity: 0.3 },
      ];

      rings.forEach(ring => {
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(226, 62, 87, ${ring.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Ring dots
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 + frame * 0.002;
          const x = cx + Math.cos(a) * ring.r;
          const y = cy + Math.sin(a) * ring.r;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(226, 62, 87, 0.5)`;
          ctx.fill();
        }
      });

      // Center glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160);
      grad.addColorStop(0, 'rgba(226,62,87,0.25)');
      grad.addColorStop(0.4, 'rgba(136,48,78,0.15)');
      grad.addColorStop(1, 'rgba(10,0,15,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 160, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Stars
      stars.forEach(star => {
        star.angle += star.speed;
        star.a = 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.02 + star.speed * 100));
        const dist = Math.sqrt((star.x - cx) ** 2 + (star.y - cy) ** 2);
        star.x = cx + Math.cos(star.angle) * dist;
        star.y = cy + Math.sin(star.angle) * dist;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,150,160,${star.a * 0.6})`;
        ctx.fill();
      });

      frame++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ position: 'relative', height: 580, marginTop: 40, overflow: 'hidden' }}>
      {/* Mask fade */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(50% 50% at 50% 50%, transparent 55%, #0a000f 85%)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to bottom, transparent, #0a000f)', zIndex: 3, pointerEvents: 'none' }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', opacity: 0.85 }} />

      {/* Floating tooltip cards */}
      <FloatingCard top={120} left="calc(50% - 360px)" delay={0}>
        <CardIcon color="#E23E57">✦</CardIcon>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#ff8fa3', marginBottom: 3 }}>Brief</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Instant summary of any text</p>
        </div>
      </FloatingCard>
      <FloatingCard top={200} left="calc(50% + 240px)" delay={0.5}>
        <CardIcon color="#818cf8">◎</CardIcon>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#a5b4fc', marginBottom: 3 }}>Pulse</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Tone & emotion detection</p>
        </div>
      </FloatingCard>
      <FloatingCard top={340} left="calc(50% - 400px)" delay={1}>
        <CardIcon color="#34d399">◈</CardIcon>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#6ee7b7', marginBottom: 3 }}>Intent</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Find the real meaning</p>
        </div>
      </FloatingCard>
      <FloatingCard top={300} left="calc(50% + 280px)" delay={1.5}>
        <CardIcon color="#fbbf24">⚡</CardIcon>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#fde68a', marginBottom: 3 }}>Signals</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Risk & red flag detection</p>
        </div>
      </FloatingCard>
    </div>
  );
}

function FloatingCard({ top, left, delay, children }: { top: number; left: string; delay: number; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'absolute', top, left, zIndex: 5,
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'rgba(10,0,15,0.7)', backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 14px',
      animation: `floatCard 4s ease-in-out ${delay}s infinite`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      {children}
    </div>
  );
}

function CardIcon({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color, flexShrink: 0 }}>
      {children}
    </div>
  );
}

/* ============================================================
   TRUSTED BY — logo strip
   ============================================================ */
function TrustedBy() {
  const items = ['Nonprofit ✦', 'Privacy-first ✦', 'Always free ✦', 'Open mission ✦', 'No paywalls ✦'];
  return (
    <div style={{ padding: '60px 20px 0', textAlign: 'center' }}>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 24, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>
        Our values
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 32px', justifyContent: 'center', maxWidth: 700, margin: '0 auto' }}>
        {items.map(item => (
          <span key={item} style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PRODUCT SECTION — Big feature showcase
   ============================================================ */
function ProductSection() {
  return (
    <section id="features" style={{ padding: '120px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionBadge>How It Works</SectionBadge>
        <SectionTitle>Paste text. Get clarity.</SectionTitle>
        <SectionDesc>Three steps to understand any message — no setup, no account needed.</SectionDesc>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 60 }}>
          <FeatureCard
            num="01"
            title="Paste or Upload"
            desc="Drop in any text — an email, message, document, or any written content you want to understand better."
            accent="#E23E57"
          />
          <FeatureCard
            num="02"
            title="AI Analysis"
            desc="Sumalyze runs 10 AI modules simultaneously — tone, intent, signals, summary, score, reply and more."
            accent="#818cf8"
          />
          <FeatureCard
            num="03"
            title="Act Smarter"
            desc="Get clear insights: what does this text really mean? What should you reply? What risks are hiding?"
            accent="#34d399"
          />
        </div>

        {/* Demo panel */}
        <DemoPanel />
      </div>
    </section>
  );
}

function FeatureCard({ num, title, desc, accent }: { num: string; title: string; desc: string; accent: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16, padding: '28px 24px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${accent}30, transparent)` }} />
      <div style={{ fontSize: 11, fontWeight: 600, color: `${accent}`, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>{num}</div>
      <h3 style={{ fontSize: 20, fontWeight: 500, color: 'white', marginBottom: 10, letterSpacing: '-0.02em' }}>{title}</h3>
      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: '24px' }}>{desc}</p>
    </div>
  );
}

/* ============================================================
   DEMO PANEL
   ============================================================ */
function DemoPanel() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [tab, setTab] = useState<'paste' | 'upload'>('paste');

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1600));
    setResult(analyzeText(text));
    setLoading(false);
  };

  const samples = [
    { label: 'Passive-aggressive', text: "I guess if you're too busy to respond to emails, that's fine. I'll just keep waiting." },
    { label: 'Urgent escalation', text: "This is critical — if we don't resolve this today the client will cancel the contract." },
    { label: 'Scam attempt', text: "Congratulations! You've been selected for a $5,000 grant. Send your bank details and $150 processing fee immediately." },
  ];

  return (
    <div id="demo" style={{ marginTop: 80 }}>
      <SectionBadge>Live Demo</SectionBadge>
      <SectionTitle>Try it right now</SectionTitle>
      <SectionDesc>Paste any message and watch AI decode it in seconds.</SectionDesc>

      {/* Sample chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', margin: '24px 0' }}>
        {samples.map(s => (
          <button key={s.label} onClick={() => { setText(s.text); setTab('paste'); setResult(null); }}
            style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 4, padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {(['paste', 'upload'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '7px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: tab === t ? '1px solid rgba(226,62,87,0.3)' : '1px solid transparent', background: tab === t ? 'rgba(226,62,87,0.1)' : 'transparent', color: tab === t ? '#ff8fa3' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}>
              {t === 'paste' ? '📋 Paste Text' : '📎 Upload File'}
            </button>
          ))}
          {text && (
            <button onClick={() => { setText(''); setResult(null); }} style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>✕ Clear</button>
          )}
        </div>

        <div style={{ padding: '20px' }}>
          {tab === 'paste' ? (
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="Paste an email, message, contract snippet, or any text you want to analyze..."
              style={{ width: '100%', height: 180, background: 'rgba(10,0,15,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 16, fontSize: 14, color: 'rgba(255,255,255,0.8)', resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: '22px', boxSizing: 'border-box' }} />
          ) : (
            <div style={{ height: 180, border: '2px dashed rgba(255,255,255,0.08)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', background: 'rgba(10,0,15,0.4)' }}>
              <span style={{ fontSize: 32 }}>📄</span>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Drop file here or click to browse</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>TXT · PDF · DOCX</p>
            </div>
          )}

          <button onClick={analyze} disabled={loading || !text.trim()}
            style={{ width: '100%', marginTop: 14, padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 500, cursor: loading || !text.trim() ? 'not-allowed' : 'pointer', border: 'none', background: loading || !text.trim() ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)', color: loading || !text.trim() ? 'rgba(255,255,255,0.25)' : 'white', boxShadow: loading || !text.trim() ? 'none' : '0 4px 24px rgba(226,62,87,0.35)', transition: 'all 0.25s' }}>
            {loading ? '⏳ Analyzing...' : '⚡ Analyze with Sumalyze'}
          </button>
        </div>

        {/* Results */}
        {result && <ResultGrid result={result} />}
      </div>
    </div>
  );
}

function ResultGrid({ result }: { result: AnalysisResult }) {
  const cards = [
    { id: 'brief', label: 'Brief', icon: '✦', color: '#E23E57', content: <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: '20px' }}>{result.brief}</p> },
    { id: 'pulse', label: 'Pulse', icon: '◎', color: '#f472b6', content: (
        <div>
          <p style={{ fontSize: 13, color: 'white', fontWeight: 500, marginBottom: 8 }}>{result.pulse.overall}</p>
          {result.pulse.emotions.slice(0, 3).map(em => (
            <div key={em.name} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{em.name}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{em.value}%</span>
              </div>
              <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ height: '100%', borderRadius: 99, background: em.color, width: `${em.value}%`, transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>
      )
    },
    { id: 'intent', label: 'Intent', icon: '◈', color: '#818cf8', content: (
        <div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>{result.intent.primary}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {result.intent.secondary.map((s, i) => <span key={i} style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, background: 'rgba(129,140,248,0.15)', color: '#a5b4fc', border: '1px solid rgba(129,140,248,0.2)' }}>{s}</span>)}
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>{result.intent.confidence}% confidence</p>
        </div>
      )
    },
    { id: 'reply', label: 'Reply', icon: '◷', color: '#34d399', content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {result.reply.options.slice(0, 2).map((opt, i) => (
            <div key={i} style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.15)' }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{opt.style}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: '18px' }}>{opt.text}</p>
            </div>
          ))}
        </div>
      )
    },
    { id: 'signals', label: 'Signals', icon: '⚠', color: '#fbbf24', content: (
        <div>
          <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 600, background: result.signals.level === 'high' ? 'rgba(239,68,68,0.15)' : result.signals.level === 'medium' ? 'rgba(251,191,36,0.15)' : 'rgba(52,211,153,0.15)', color: result.signals.level === 'high' ? '#fca5a5' : result.signals.level === 'medium' ? '#fde68a' : '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{result.signals.level} risk</span>
          <div style={{ marginTop: 10 }}>
            {result.signals.risks.length > 0 ? result.signals.risks.map((r, i) => <p key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>▲ {r}</p>) : <p style={{ fontSize: 12, color: '#6ee7b7' }}>✓ No significant risks</p>}
          </div>
        </div>
      )
    },
    { id: 'score', label: 'Score', icon: '◆', color: '#a78bfa', content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {([['Clarity', result.score.clarity], ['Urgency', result.score.urgency], ['Pro.', result.score.professionalism], ['Polite', result.score.politeness], ['Emot.', result.score.emotionalIntensity], ['Risk', result.score.riskLevel]] as [string,number][]).map(([l, v]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 600, color: 'white', lineHeight: '1', marginBottom: 3 }}>{v}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{l}</p>
            </div>
          ))}
        </div>
      )
    },
    { id: 'extract', label: 'Extract', icon: '◻', color: '#22d3ee', content: (
        <div>
          {result.extract.keyPoints.length > 0 && <div style={{ marginBottom: 8 }}><p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Key Points</p><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{result.extract.keyPoints.slice(0, 3).map((p, i) => <span key={i} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, background: 'rgba(34,211,238,0.1)', color: '#67e8f9' }}>{p}</span>)}</div></div>}
          {result.extract.actionItems.length > 0 && <div><p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Actions</p><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{result.extract.actionItems.slice(0, 2).map((a, i) => <span key={i} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, background: 'rgba(251,146,60,0.1)', color: '#fdba74' }}>{a}</span>)}</div></div>}
        </div>
      )
    },
    { id: 'rewrite', label: 'Rewrite', icon: '↺', color: '#fb923c', content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {result.rewrite.options.map((opt, i) => <div key={i} style={{ padding: '7px 12px', borderRadius: 10, background: 'rgba(251,146,60,0.07)', border: '1px solid rgba(251,146,60,0.15)', fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fb923c', flexShrink: 0 }} />{opt.style}</div>)}
        </div>
      )
    },
  ];

  return (
    <div style={{ padding: '0 20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
        <span style={{ fontSize: 15, fontWeight: 500, color: 'white' }}>Analysis Complete</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>— {cards.length} modules ran</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {cards.map((card, i) => (
          <div key={card.id} id={`result-${card.id}`} style={{
            background: `${card.color}08`, border: `1px solid ${card.color}18`, borderRadius: 16, padding: '16px',
            animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: card.color }}>{card.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: card.color, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{card.label}</span>
            </div>
            {card.content}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SUPERPOWER — Large centered section like Reflect's
   ============================================================ */
function SuperpowerSection() {
  return (
    <section style={{ padding: '120px 20px', textAlign: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(226,62,87,0.06) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
        <SectionBadge>Communication Intelligence</SectionBadge>
        <h2 style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500, fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: '1.1', letterSpacing: '-0.03em', margin: '0 0 20px' }}>
          <span style={{ background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', display: 'block' }}>Give your communication</span>
          <span style={{ background: 'linear-gradient(180deg, #ff8fa3 0%, #E23E57 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', display: 'block' }}>a superpower.</span>
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(239,237,253,0.65)', lineHeight: '28px', maxWidth: 460, margin: '0 auto 48px' }}>
          Sumalyze reads between the lines of every message, email, or document — surfacing what's really being said before you reply.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
          {[
            { val: '10+', label: 'AI Modules', sub: 'Tone, intent, risk & more' },
            { val: '100%', label: 'Free Forever', sub: 'No trials, no paywalls' },
            { val: '<2s', label: 'Analysis Time', sub: 'Near-instant results' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '28px 20px', background: 'rgba(10,0,15,0.5)', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <p style={{ fontSize: 32, fontWeight: 500, color: 'white', letterSpacing: '-0.04em', marginBottom: 6 }}>{s.val}</p>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>{s.label}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   MODULES SECTION — Feature grid
   ============================================================ */
const MODULES = [
  { id: 'brief', name: 'Brief', desc: 'Short, clear summary of any text.', icon: '✦', color: '#E23E57' },
  { id: 'pulse', name: 'Pulse', desc: 'Tone and emotion analysis.', icon: '◎', color: '#f472b6' },
  { id: 'intent', name: 'Intent', desc: "Discover what's really being said.", icon: '◈', color: '#818cf8' },
  { id: 'reply', name: 'Reply', desc: 'Smart reply suggestions.', icon: '◷', color: '#34d399' },
  { id: 'signals', name: 'Signals', desc: 'Risk, red flags, manipulation.', icon: '⚠', color: '#fbbf24' },
  { id: 'score', name: 'Score', desc: 'Communication quality metrics.', icon: '◆', color: '#a78bfa' },
  { id: 'extract', name: 'Extract', desc: 'Key points, tasks, dates.', icon: '◻', color: '#22d3ee' },
  { id: 'rewrite', name: 'Rewrite', desc: 'Transform tone and style.', icon: '↺', color: '#fb923c' },
  { id: 'translate', name: 'Translate', desc: 'Meaning across languages.', icon: '⟳', color: '#4ade80' },
  { id: 'clean', name: 'Clean', desc: 'Fix grammar, improve clarity.', icon: '✓', color: '#60a5fa' },
];

function ModulesSection() {
  return (
    <section id="modules" style={{ padding: '0 20px 120px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionBadge>All Modules</SectionBadge>
        <SectionTitle>Ten tools. One platform.</SectionTitle>
        <SectionDesc>Every lens you need to fully understand any written communication.</SectionDesc>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16, marginTop: 56 }}>
          {MODULES.map((m, i) => (
            <div key={m.id} id={`module-${m.id}`} style={{
              background: `${m.color}07`, border: `1px solid ${m.color}14`, borderRadius: 18, padding: '24px 20px',
              transition: 'all 0.3s ease', cursor: 'default', position: 'relative', overflow: 'hidden',
              animationDelay: `${i * 0.05}s`,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = `${m.color}12`; e.currentTarget.style.borderColor = `${m.color}28`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${m.color}07`; e.currentTarget.style.borderColor = `${m.color}14`; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${m.color}30, transparent)` }} />
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${m.color}15`, border: `1px solid ${m.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 14, color: m.color }}>
                {m.icon}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 6, letterSpacing: '-0.01em' }}>{m.name}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: '20px' }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   AI SECTION — "Never miss intent" etc
   ============================================================ */
function AISectionBlock() {
  return (
    <section style={{ padding: '0 20px 120px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Split section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          <BigFeatureCard
            badge="Built-in intelligence"
            title={<>AI that reads<br /><span style={{ color: '#E23E57' }}>between the lines.</span></>}
            desc="Sumalyze processes emotional subtext, implicit intent, urgency signals, and cultural tone — giving you the full picture before you respond."
            accent="#E23E57"
          />
          <BigFeatureCard
            badge="Instant results"
            title={<>From text<br /><span style={{ color: '#818cf8' }}>to clarity.</span></>}
            desc="No waiting, no setup. Paste any message and get instant multi-dimensional analysis across tone, intent, risk, and communication quality."
            accent="#818cf8"
          />
        </div>

        {/* Wide single card */}
        <div style={{ marginTop: 24, background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(226,62,87,0.3), transparent)' }} />
          <div style={{ maxWidth: 560 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#E23E57', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Free · Nonprofit · Always</div>
            <h3 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 500, color: 'white', letterSpacing: '-0.03em', lineHeight: '1.15', marginBottom: 16 }}>
              Communication intelligence for everyone.
            </h3>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: '26px', marginBottom: 32 }}>
              Sumalyze is a nonprofit project. We believe AI-powered text understanding should be accessible to everyone — free forever, no paywalls, no subscriptions.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="#demo" style={{ padding: '10px 22px', borderRadius: 10, fontSize: 14, fontWeight: 500, color: '#f4f0ff', textDecoration: 'none', background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)', boxShadow: '0 4px 20px rgba(226,62,87,0.3)' }}>
                Try Demo →
              </a>
              <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer" style={{ padding: '10px 22px', borderRadius: 10, fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)' }}>
                ♥ Support Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BigFeatureCard({ badge, title, desc, accent }: { badge: string; title: React.ReactNode; desc: string; accent: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '40px 36px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${accent}30, transparent)` }} />
      <div style={{ fontSize: 11, fontWeight: 600, color: accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>{badge}</div>
      <h3 style={{ fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 500, color: 'white', letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: 16 }}>{title}</h3>
      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: '24px' }}>{desc}</p>
    </div>
  );
}

/* ============================================================
   USE CASES
   ============================================================ */
const USE_CASES = [
  { icon: '📧', title: 'Emails', desc: 'Decode tone and craft better replies to every business email.' },
  { icon: '🎧', title: 'Support', desc: 'Surface urgency and sentiment before a ticket escalates.' },
  { icon: '💼', title: 'Business', desc: 'Understand the intent behind every message and negotiation.' },
  { icon: '🎓', title: 'Academic', desc: 'Summarize research and extract key arguments from papers.' },
  { icon: '👥', title: 'Personal', desc: 'Navigate emotionally charged messages with empathy.' },
  { icon: '🤝', title: 'Deals', desc: 'Detect leverage and hidden signals in negotiations.' },
  { icon: '✍️', title: 'Writing', desc: 'Polish clarity, tone, and professionalism in your own text.' },
  { icon: '🛡️', title: 'Safety', desc: 'Identify manipulation, scams, and suspicious patterns.' },
];

function UseCasesSection() {
  return (
    <section id="use-cases" style={{ padding: '0 20px 120px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionBadge>Use Cases</SectionBadge>
        <SectionTitle>Built for every conversation</SectionTitle>
        <SectionDesc>From boardrooms to DMs — Sumalyze adapts to any kind of written communication.</SectionDesc>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginTop: 52 }}>
          {USE_CASES.map((uc) => (
            <div key={uc.title} id={`use-${uc.title.toLowerCase()}`} style={{
              background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px',
              display: 'flex', alignItems: 'flex-start', gap: 16, transition: 'all 0.25s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(226,62,87,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.018)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
              <div style={{ fontSize: 22, flexShrink: 0 }}>{uc.icon}</div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 6 }}>{uc.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: '20px' }}>{uc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   DONATION / MISSION — Reflect's "pricing" equivalent
   ============================================================ */
function DonationSection() {
  return (
    <section id="mission" style={{ padding: '0 20px 120px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionBadge>Our Mission</SectionBadge>
        <SectionTitle>Free. Forever.</SectionTitle>
        <SectionDesc>Sumalyze is a nonprofit project. No pricing plans. No subscriptions. Just useful tools for everyone.</SectionDesc>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 52 }}>
          {/* Free tier */}
          <div style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '36px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Always Free</div>
            <div style={{ fontSize: 48, fontWeight: 500, color: 'white', letterSpacing: '-0.04em', marginBottom: 8 }}>$0</div>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>No card, no limits, no paywalls.</p>
            {['All 10 AI modules', 'Unlimited analyses', 'No account required', 'Paste & upload', 'All result types'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ color: '#34d399', fontSize: 14 }}>✓</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>{f}</span>
              </div>
            ))}
            <a href="#demo" style={{ display: 'block', marginTop: 28, padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
              Try Demo →
            </a>
          </div>

          {/* Support card */}
          <div style={{ background: 'linear-gradient(145deg, rgba(226,62,87,0.12) 0%, rgba(136,48,78,0.08) 100%)', border: '1px solid rgba(226,62,87,0.25)', borderRadius: 24, padding: '36px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(226,62,87,0.4), transparent)' }} />
            <div style={{ fontSize: 11, fontWeight: 600, color: '#E23E57', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Supporter</div>
            <div style={{ fontSize: 48, fontWeight: 500, color: 'white', letterSpacing: '-0.04em', marginBottom: 8 }}>♥</div>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', marginBottom: 28 }}>Optional Ko-fi donation to keep Sumalyze alive.</p>
            {['Everything in Free', 'Keep the project alive', 'Support open AI tools', 'Badge in our community', 'Our eternal gratitude'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ color: '#E23E57', fontSize: 14 }}>✦</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>{f}</span>
              </div>
            ))}
            <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', marginTop: 28, padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 500, color: 'white', textDecoration: 'none', background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)', boxShadow: '0 4px 24px rgba(226,62,87,0.35)', textAlign: 'center' }}>
              Support on Ko-fi →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TESTIMONIALS
   ============================================================ */
const TESTIMONIALS = [
  { quote: "Sumalyze flagged a manipulation attempt in a client email I was about to ignore. The Signals module saved the entire project.", name: "Marketing Lead", role: "Agency", initials: "ML" },
  { quote: "I use it every morning to triage my inbox. The Brief + Pulse combo alone saves me 30 minutes a day.", name: "Freelancer", role: "Independent", initials: "FR" },
  { quote: "The fact that it's completely free blew my mind. The reply suggestions are genuinely good — like having an editor on call.", name: "Support Manager", role: "SaaS", initials: "SM" },
  { quote: "I used the Intent module to prep for a negotiation. Spotted the leverage the other party was hiding in plain sight.", name: "Founder", role: "Startup", initials: "FO" },
  { quote: "Clean + Rewrite turned my rushed draft into something I was actually proud to send. Took 10 seconds.", name: "Content Writer", role: "Media", initials: "CW" },
  { quote: "As someone who struggles with reading tone in texts, Pulse has genuinely changed how I communicate.", name: "Remote Worker", role: "Tech", initials: "RW" },
];

function TestimonialsSection() {
  return (
    <section style={{ padding: '0 20px 120px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionBadge>Testimonials</SectionBadge>
        <SectionTitle>People love Sumalyze</SectionTitle>
        <SectionDesc>Don't take our word for it — here's what early users say.</SectionDesc>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginTop: 52 }}>
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} id={`testimonial-${idx}`} style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: '24px', flex: 1, fontStyle: 'italic' }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(226,62,87,0.15)', border: '1px solid rgba(226,62,87,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#ff8fa3', flexShrink: 0 }}>{t.initials}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FINAL CTA — Reflect's bottom section
   ============================================================ */
function FinalCTA() {
  return (
    <section style={{ padding: '0 20px 120px', textAlign: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(226,62,87,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
        <SectionBadge>Get Started</SectionBadge>
        <h2 style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500, fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: '1.1', letterSpacing: '-0.03em', margin: '0 0 20px' }}>
          <span style={{ background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', display: 'block' }}>
            Start understanding
          </span>
          <span style={{ background: 'linear-gradient(180deg, #ff8fa3 0%, #E23E57 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', display: 'block' }}>
            every message.
          </span>
        </h2>
        <p style={{ fontSize: 18, color: 'rgba(239,237,253,0.65)', lineHeight: '28px', marginBottom: 40 }}>
          Free forever. No account required. Just paste and analyze.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#demo" style={{ padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 500, color: '#f4f0ff', textDecoration: 'none', background: 'linear-gradient(180deg, rgba(60,8,126,0) 0%, rgba(60,8,126,0.32) 100%), rgba(113,47,255,0.12)', boxShadow: 'inset 0 0 12px rgba(191,151,255,0.24)', border: '1px solid rgba(207,184,255,0.2)', backdropFilter: 'blur(8px)' }}>
            Try Demo — it's free
          </a>
          <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer" style={{ padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
            ♥ Support on Ko-fi
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '48px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M3 5h12M3 9h8M3 13h10" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
                  <circle cx="14" cy="13" r="2" fill="white" />
                </svg>
              </div>
              <span style={{ fontSize: 16, fontWeight: 500, color: 'white' }}>Sumalyze</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', maxWidth: 220, lineHeight: '20px' }}>
              Free nonprofit AI communication intelligence platform.
            </p>
          </div>

          {/* Nav columns */}
          <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap' }}>
            <FooterCol label="Product" links={[{ l: 'Features', h: '#features' }, { l: 'Demo', h: '#demo' }, { l: 'Modules', h: '#modules' }]} />
            <FooterCol label="Mission" links={[{ l: 'Nonprofit', h: '#mission' }, { l: 'Ko-fi', h: 'https://ko-fi.com' }, { l: 'Contact', h: 'mailto:hello@sumalyze.com' }]} />
            <FooterCol label="Legal" links={[{ l: 'Privacy', h: '#' }, { l: 'Terms', h: '#' }]} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>© {new Date().getFullYear()} Sumalyze · Nonprofit AI communication platform</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>Made with ♥ for clearer communication</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ label, links }: { label: string; links: { l: string; h: string }[] }) {
  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>{label}</p>
      {links.map(link => (
        <a key={link.l} href={link.h} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
          {link.l}
        </a>
      ))}
    </div>
  );
}

/* ============================================================
   SHARED COMPONENTS
   ============================================================ */
function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', margin: '0 auto 16px',
      padding: '6px 14px', borderRadius: 32,
      backdropFilter: 'blur(6px)', boxShadow: 'inset 0 -7px 11px rgba(226,62,87,0.08)',
      background: 'rgba(226,62,87,0.06)', border: '1px solid rgba(226,62,87,0.2)',
    }}>
      <span style={{ fontSize: 13, fontWeight: 500, background: 'linear-gradient(90deg, #ff8fa3 0%, #E23E57 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{children}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500, fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: '1.1', letterSpacing: '-0.03em', textAlign: 'center', margin: '0 0 16px', background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' }}>
      {children}
    </h2>
  );
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 17, color: 'rgba(239,237,253,0.6)', lineHeight: '28px', maxWidth: 460, margin: '0 auto', textAlign: 'center' }}>
      {children}
    </p>
  );
}
