import { accountBenefits } from '../data/features';

const BENEFIT_ICONS = ['∞', '◷', '⇪', '✦'];
const BENEFIT_ACCENTS = ['#E23E57', '#22d3ee', '#a78bfa', '#34d399'];

export default function AccountBenefits() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12"
          style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.45)' }}>

          {/* Top header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-16 mb-10">
            <div className="flex-1">
              <div className="section-label mb-4">Optional Account</div>
              <h2 className="font-display font-bold text-white tracking-tight"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                More power when<br />you sign in.
              </h2>
            </div>
            <div className="flex-1">
              <p className="text-secondary text-base leading-relaxed">
                Sumalyze is completely free to use without an account. Create one to unlock
                a few extra conveniences — still no cost, no subscription, no paywall.
              </p>
            </div>
          </div>

          <hr className="divider mb-10" />

          {/* Benefits grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {accountBenefits.map((benefit, i) => (
              <div key={benefit.title}
                id={`benefit-${benefit.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.03]"
                style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base"
                  style={{ background: `${BENEFIT_ACCENTS[i]}12`, border: `1px solid ${BENEFIT_ACCENTS[i]}22`, color: BENEFIT_ACCENTS[i] }}>
                  {BENEFIT_ICONS[i]}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 tracking-tight">{benefit.title}</h3>
                  <p className="text-secondary text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <button
              id="account-create-btn"
              className="btn-primary px-8 py-3.5 rounded-2xl text-sm w-full sm:w-auto text-center"
            >
              Create Free Account
            </button>
            <p className="text-muted text-sm">No credit card · No subscription · Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  );
}
