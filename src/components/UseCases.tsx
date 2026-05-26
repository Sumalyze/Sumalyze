import {
  Mail, Headphones, Briefcase, GraduationCap,
  Users, Handshake, PenTool, Shield,
} from 'lucide-react';

const USE_CASES = [
  { icon: Mail, label: 'Professional Emails', desc: 'Understand tone, detect pressure, and craft confident replies to business communications.', accent: '#60a5fa' },
  { icon: Headphones, label: 'Customer Support', desc: 'Surface frustration, urgency, and unmet expectations before they escalate.', accent: '#34d399' },
  { icon: Briefcase, label: 'Business Messages', desc: 'Decode the intent behind every Slack, Teams, or Messenger thread.', accent: '#a78bfa' },
  { icon: GraduationCap, label: 'Academic Text', desc: 'Summarize papers, extract key arguments, and understand dense research.', accent: '#fbbf24' },
  { icon: Users, label: 'Personal Conversations', desc: 'Navigate sensitive messages with empathy and emotional awareness.', accent: '#f472b6' },
  { icon: Handshake, label: 'Negotiations', desc: 'Spot leverage, detect bluffs, and craft strategic counter-messages.', accent: '#22d3ee' },
  { icon: PenTool, label: 'Content & Writing', desc: 'Polish your own writing for clarity, tone, and professionalism.', accent: '#fb923c' },
  { icon: Shield, label: 'Scam Detection', desc: 'Identify manipulation, red flags, and suspicious communication patterns.', accent: '#E23E57' },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="relative py-28 overflow-hidden">
      {/* Ambient */}
      <div className="orb animate-float-slow" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(82,37,70,0.2) 0%, transparent 70%)', top: '20%', right: '-10%' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-label mb-4">Use Cases</div>
          <h2 className="font-display font-bold text-white tracking-tight mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}>
            Built for every conversation
          </h2>
          <p className="text-secondary text-lg max-w-xl mx-auto">
            From boardrooms to DMs — Sumalyze adapts to every kind of communication.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {USE_CASES.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.label}
                id={`use-case-${uc.label.toLowerCase().replace(/\s+/g, '-')}`}
                className="use-case-card group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${uc.accent}12`, border: `1px solid ${uc.accent}22` }}>
                    <Icon size={18} style={{ color: uc.accent }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm mb-1.5 tracking-tight">{uc.label}</h3>
                    <p className="text-secondary text-xs leading-relaxed">{uc.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
