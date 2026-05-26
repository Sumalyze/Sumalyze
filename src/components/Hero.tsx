import { useEffect, useRef } from 'react';

interface HeroProps {
  onTryDemo: () => void;
}

export default function Hero({ onTryDemo }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleMouse = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      el.style.setProperty('--mouse-x', `${x * 100}%`);
      el.style.setProperty('--mouse-y', `${y * 100}%`);
    };
    el.addEventListener('mousemove', handleMouse);
    return () => el.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-mesh"
      aria-label="Hero"
    >
      {/* Ambient orbs */}
      <div className="orb animate-orb-drift"
        style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(226,62,87,0.12) 0%, transparent 70%)', top: '-10%', left: '-10%' }} />
      <div className="orb animate-orb-drift-2"
        style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(136,48,78,0.1) 0%, transparent 70%)', bottom: '5%', right: '-5%' }} />
      <div className="orb animate-float-slow"
        style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(82,37,70,0.18) 0%, transparent 70%)', top: '40%', left: '40%', filter: 'blur(60px)' }} />

      {/* Radial vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 40%, transparent 0%, rgba(49,29,63,0.6) 100%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pt-32 pb-24 text-center">

        {/* Badge */}
        <div className="badge animate-slide-up delay-0 mb-8 mx-auto w-fit">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E23E57', display: 'inline-block' }} />
          Free · Nonprofit · No Paywalls
        </div>

        {/* Headline */}
        <h1 className="animate-slide-up delay-100 font-display font-bold tracking-tight text-white text-balance"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: '1.05', letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
          Understand any message<br />
          <span className="text-gradient">in seconds.</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-slide-up delay-200 text-secondary text-balance max-w-2xl mx-auto leading-relaxed"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', marginBottom: '2.5rem' }}>
          Sumalyze summarizes text, detects tone, finds intent, highlights emotional signals,
          and helps you reply smarter — powered by AI, free forever.
        </p>

        {/* CTA Buttons */}
        <div className="animate-slide-up delay-300 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            id="hero-try-demo"
            onClick={onTryDemo}
            className="btn-primary px-8 py-4 rounded-2xl text-[15px] w-full sm:w-auto flex items-center justify-center gap-2.5 group"
          >
            Try Demo
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-0.5">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <a
            href="https://ko-fi.com"
            target="_blank"
            rel="noopener noreferrer"
            id="hero-kofi"
            className="btn-ghost px-8 py-4 rounded-2xl text-[15px] w-full sm:w-auto flex items-center justify-center gap-2.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="rgba(226,62,87,0.7)" />
            </svg>
            Support on Ko-fi
          </a>
        </div>

        {/* Social proof micro-text */}
        <p className="animate-fade-in delay-700 text-muted text-sm mt-6">
          100% free · No sign-up required · Nonprofit mission
        </p>

        {/* Product Preview Card */}
        <div className="animate-scale-in delay-500 mt-16 sm:mt-20 w-full max-w-2xl mx-auto">
          <HeroPreviewCard />
        </div>

      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(49,29,63,0.8))' }} />
    </section>
  );
}

/* ─── Inline preview card ─────────────────────────────────────── */
function HeroPreviewCard() {
  return (
    <div className="glass-panel rounded-3xl overflow-hidden"
      style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)' }}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5">
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
        <div className="w-3 h-3 rounded-full bg-green-400/50" />
        <div className="flex-1 mx-4">
          <div className="h-5 rounded-md bg-white/5 flex items-center px-3 gap-2 max-w-xs mx-auto">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
              <path d="M4 6h4M6 4v4" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="text-[10px] text-white/20 font-mono">sumalyze.com</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Input area */}
        <div className="rounded-2xl border border-white/06 p-4 mb-4 text-left"
          style={{ background: 'rgba(49,29,63,0.5)', borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-white/35 text-xs uppercase tracking-widest mb-2 font-medium">Input Text</p>
          <p className="text-white/70 text-sm leading-relaxed">
            "I wanted to follow up on our meeting last week. I'm a bit concerned about the timeline — we've been pushing this deadline for months and the team is getting frustrated. We need to have a frank discussion soon."
          </p>
        </div>

        {/* Result cards row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MiniCard
            icon="✦"
            label="Brief"
            value="Escalating concern about delayed project timeline."
            color="rgba(226,62,87,0.15)"
            accent="#E23E57"
          />
          <MiniCard
            icon="◎"
            label="Pulse"
            value="Frustrated · Concerned · Firm"
            color="rgba(244,114,182,0.1)"
            accent="#f472b6"
          />
          <MiniCard
            icon="◈"
            label="Intent"
            value="Request urgent meeting · Escalation signal"
            color="rgba(99,102,241,0.1)"
            accent="#818cf8"
          />
          <MiniCard
            icon="◷"
            label="Score"
            value="Clarity 82 · Urgency 91"
            color="rgba(52,211,153,0.1)"
            accent="#34d399"
          />
        </div>

        {/* Reply suggestion */}
        <div className="mt-3 rounded-xl p-3.5 text-left"
          style={{ background: 'rgba(226,62,87,0.06)', border: '1px solid rgba(226,62,87,0.15)' }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span style={{ color: '#E23E57', fontSize: 11 }}>◆</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#E23E57' }}>AI Reply Suggestion</span>
          </div>
          <p className="text-white/65 text-xs leading-relaxed">
            "Thank you for raising this — I completely understand the team's frustration. Let's schedule a call this week to align on a firm timeline and clear blockers together."
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ icon, label, value, color, accent }: { icon: string; label: string; value: string; color: string; accent: string }) {
  return (
    <div className="rounded-xl p-3 text-left"
      style={{ background: color, border: `1px solid ${accent}25` }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span style={{ color: accent, fontSize: 10 }}>{icon}</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: accent }}>{label}</span>
      </div>
      <p className="text-white/65 text-[11px] leading-relaxed">{value}</p>
    </div>
  );
}
