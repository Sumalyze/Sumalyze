export default function AISection() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Ambient */}
      <div className="orb" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(226,62,87,0.07) 0%, transparent 65%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">

        {/* Section 1: Built for clearer communication */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-28">
          {/* Left text */}
          <div>
            <div className="section-label mb-5">Why Sumalyze</div>
            <h2 className="font-display font-bold text-white tracking-tight mb-6"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Built for clearer<br />
              <span className="text-gradient">communication.</span>
            </h2>
            <p className="text-secondary text-lg leading-relaxed mb-8">
              We built Sumalyze because miscommunication costs time, money, and relationships.
              Whether it's a passive-aggressive email, a confusing message, or a complex document —
              Sumalyze translates it into clear, actionable insight.
            </p>
            <div className="space-y-4">
              {[
                { title: 'Surface the unsaid', body: 'Read between the lines to understand what someone really means — not just what they wrote.' },
                { title: 'Respond with confidence', body: 'Get smart reply suggestions tuned to the tone and context of every message.' },
                { title: 'Protect yourself', body: 'Spot manipulation, emotional pressure, and risk signals before they escalate.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="shrink-0 w-1.5 h-1.5 rounded-full mt-2.5" style={{ background: '#E23E57' }} />
                  <div>
                    <p className="text-white font-semibold mb-0.5">{item.title}</p>
                    <p className="text-secondary text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual panel */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8"
            style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.45)' }}>
            <div className="section-label mb-6">Live Example</div>
            <div className="space-y-4">
              {/* Input */}
              <div className="rounded-2xl p-4" style={{ background: 'rgba(49,29,63,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-muted text-[11px] uppercase tracking-widest mb-2">Message received</p>
                <p className="text-white/70 text-sm leading-relaxed italic">
                  "Fine, do it your way. I'm sure it'll work out just fine."
                </p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-px h-6" style={{ background: 'linear-gradient(to bottom, transparent, rgba(226,62,87,0.4))' }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: '#E23E57' }} />
                  <div className="text-[10px] tracking-widest uppercase font-semibold" style={{ color: '#E23E57' }}>Sumalyze</div>
                  <div className="w-2 h-2 rounded-full" style={{ background: '#E23E57' }} />
                  <div className="w-px h-6" style={{ background: 'linear-gradient(to bottom, rgba(226,62,87,0.4), transparent)' }} />
                </div>
              </div>

              {/* Output cards */}
              <div className="grid grid-cols-2 gap-3">
                <InsightChip label="Tone" value="Sarcastic · Dismissive" accent="#f472b6" />
                <InsightChip label="Intent" value="Passive resistance" accent="#818cf8" />
                <InsightChip label="Risk" value="⚠ Conflict signal" accent="#fbbf24" />
                <InsightChip label="Reply" value="De-escalate calmly" accent="#34d399" />
              </div>
            </div>
          </div>
        </div>

        <hr className="divider my-4" />

        {/* Section 2: AI that reads between the lines */}
        <div className="text-center max-w-3xl mx-auto pt-24">
          <div className="section-label mb-5">The Intelligence Layer</div>
          <h2 className="font-display font-bold text-white tracking-tight mb-6"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            AI that reads<br />
            <span className="text-gradient">between the lines.</span>
          </h2>
          <p className="text-secondary text-lg leading-relaxed mb-14">
            Language carries more than words. Sumalyze processes emotional subtext, implicit intent,
            urgency signals, and cultural tone — giving you the full picture before you reply.
          </p>

          {/* 3-column stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-3xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { stat: '10', unit: '+', label: 'AI Modules', sub: 'Tone, intent, risk, reply & more' },
              { stat: '100', unit: '%', label: 'Free Forever', sub: 'No trials, no paywalls' },
              { stat: '<2', unit: 's', label: 'Analysis Time', sub: 'Near-instant results' },
            ].map((item, i) => (
              <div key={i} className="px-8 py-8 text-center" style={{ background: 'rgba(49,29,63,0.5)' }}>
                <div className="flex items-end justify-center gap-0.5 mb-2">
                  <span className="font-display font-bold text-white" style={{ fontSize: '2.5rem', lineHeight: 1, letterSpacing: '-0.04em' }}>{item.stat}</span>
                  <span className="font-bold text-xl pb-1" style={{ color: '#E23E57' }}>{item.unit}</span>
                </div>
                <p className="text-white font-semibold text-sm mb-1">{item.label}</p>
                <p className="text-muted text-xs">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function InsightChip({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl p-3" style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>{label}</p>
      <p className="text-white/65 text-xs leading-relaxed">{value}</p>
    </div>
  );
}
