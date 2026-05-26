import { howItWorks } from '../data/features';

const STEP_ACCENTS = ['#E23E57', '#818cf8', '#34d399'];

export default function HowItWorks() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14">
          <div className="section-label mb-4">How It Works</div>
          <h2 className="font-display font-bold text-white tracking-tight"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.03em' }}>
            Three steps to clarity
          </h2>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px"
            style={{ background: 'linear-gradient(90deg, rgba(226,62,87,0.3), rgba(129,140,248,0.3), rgba(52,211,153,0.3))' }} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="text-center">
                {/* Step number circle */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5 font-bold text-lg"
                  style={{
                    background: `${STEP_ACCENTS[i]}15`,
                    border: `1.5px solid ${STEP_ACCENTS[i]}40`,
                    color: STEP_ACCENTS[i],
                  }}>
                  {step.step}
                </div>
                <h3 className="font-semibold text-white mb-2 tracking-tight">{step.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
