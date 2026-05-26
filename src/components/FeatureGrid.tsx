import { features } from '../data/features';

const ICON_ACCENTS = [
  '#E23E57', '#f472b6', '#818cf8', '#34d399', '#fbbf24',
  '#a78bfa', '#22d3ee', '#fb923c', '#4ade80', '#60a5fa',
];

export default function FeatureGrid() {
  return (
    <section id="features" className="relative py-28 overflow-hidden">
      {/* Ambient orbs */}
      <div className="orb animate-orb-drift" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(226,62,87,0.07) 0%, transparent 70%)', top: '0%', left: '20%' }} />
      <div className="orb animate-orb-drift-2" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(136,48,78,0.08) 0%, transparent 70%)', bottom: '0%', right: '10%' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">

        {/* Section header */}
        <div className="text-center mb-16 animate-on-scroll visible">
          <div className="section-label mb-4">Intelligence Modules</div>
          <h2 className="font-display font-bold text-white tracking-tight mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}>
            Ten tools, one platform
          </h2>
          <p className="text-secondary text-lg max-w-xl mx-auto">
            Every module designed to give you a different lens on your text — from tone to risk to clarity.
          </p>
        </div>

        {/* Feature grid: 5 col desktop, 2 col mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const accent = ICON_ACCENTS[i % ICON_ACCENTS.length];
            return (
              <div
                key={feature.id}
                id={`feature-${feature.id}`}
                className="feature-card group cursor-default"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}>
                  <Icon size={19} style={{ color: accent }} />
                </div>

                {/* Name */}
                <h3 className="font-display font-semibold text-white text-[15px] mb-1.5 tracking-tight">
                  {feature.name}
                </h3>

                {/* Description */}
                <p className="text-secondary text-[13px] leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className="mt-4 h-px w-0 group-hover:w-full transition-all duration-500 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA hint */}
        <p className="text-center text-muted text-sm mt-10">
          All modules run instantly · No sign-up needed · Forever free
        </p>

      </div>
    </section>
  );
}
