const TESTIMONIALS = [
  {
    quote: "Finally an AI tool that actually tells me what a message is *really* saying. Used it on a tense client email and the reply suggestion saved the relationship.",
    author: "Marketing lead",
    role: "Agency",
    initials: "ML",
    accent: '#E23E57',
  },
  {
    quote: "The Signals module flagged a potential scam I almost fell for. This thing is genuinely impressive and the fact it's free is wild.",
    author: "Freelance designer",
    role: "Independent",
    initials: "FD",
    accent: '#818cf8',
  },
  {
    quote: "We use Sumalyze in our customer support team to triage tickets by urgency and emotion. It's cut our response time significantly.",
    author: "Support manager",
    role: "SaaS company",
    initials: "SM",
    accent: '#34d399',
  },
];

export default function Nonprofit() {
  return (
    <>
      {/* Social proof / testimonials */}
      <section className="relative py-24 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <div className="section-label mb-4">What People Say</div>
            <h2 className="font-display font-bold text-white tracking-tight"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.03em' }}>
              Trusted by communicators
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                id={`testimonial-${i}`}
                className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Quote marks */}
                <div className="text-3xl leading-none font-serif" style={{ color: t.accent, opacity: 0.6 }}>"</div>
                <p className="text-secondary text-sm leading-relaxed flex-1">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: `${t.accent}20`, color: t.accent, border: `1px solid ${t.accent}30` }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium leading-none mb-0.5">{t.author}</p>
                    <p className="text-muted text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nonprofit / Ko-fi donation */}
      <section id="nonprofit" className="relative py-24 overflow-hidden">
        {/* Center glow */}
        <div className="orb animate-glow-pulse" style={{ width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(226,62,87,0.09) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8">
          <div className="glass-panel rounded-[2rem] p-10 sm:p-16 text-center"
            style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)' }}>

            {/* Heart icon */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-float"
              style={{ background: 'linear-gradient(135deg, rgba(226,62,87,0.25) 0%, rgba(136,48,78,0.3) 100%)', border: '1px solid rgba(226,62,87,0.3)', boxShadow: '0 4px 24px rgba(226,62,87,0.2)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E23E57" />
              </svg>
            </div>

            <div className="section-label mb-5">Our Mission</div>

            <h2 className="font-display font-bold text-white tracking-tight mb-6"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}>
              Free for everyone.<br />
              <span className="text-gradient">Always.</span>
            </h2>

            <p className="text-secondary text-lg leading-relaxed mb-4 max-w-2xl mx-auto">
              Sumalyze is an independent project. We believe AI-powered communication tools should
              be accessible to everyone — not locked behind subscriptions or enterprise paywalls.
            </p>
            <p className="text-muted text-base leading-relaxed mb-10 max-w-xl mx-auto">
              If Sumalyze has helped you, consider supporting the project on Ko-fi.
              Every contribution helps us keep the servers running and the product improving.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 mb-10">
              {[
                { val: '100%', label: 'Free forever' },
                { val: '$0', label: 'No subscriptions' },
                { val: '10+', label: 'AI modules' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-display font-bold text-white" style={{ fontSize: '2rem', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.val}</div>
                  <div className="text-muted text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                id="nonprofit-kofi-btn"
                href="https://ko-fi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-8 py-4 rounded-2xl text-[15px] flex items-center justify-center gap-2.5 group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white" />
                </svg>
                Support on Ko-fi
              </a>
              <a
                href="#demo"
                className="btn-ghost px-8 py-4 rounded-2xl text-[15px] flex items-center justify-center"
              >
                Try it free →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
