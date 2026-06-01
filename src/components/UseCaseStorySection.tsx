import { useEffect, useRef, useState } from 'react';

const STORY_SECTION_HEIGHT = '300vh'; // Easily adjustable constant for storytelling scroll duration

interface UseCase {
  title: string;
  icon: string;
  desc: string;
  bullets: string[];
  cta: string;
  accent: string;
  mockup: React.ReactNode;
}

export default function UseCaseStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Define mockups for each segment
  const useCases: UseCase[] = [
    {
      title: 'Students',
      icon: '🎓',
      desc: 'Understand heavy reading lists immediately.',
      bullets: [
        'Analyze long PDFs & textbooks instantly',
        'Extract definitions and core hypotheses',
        'Auto-generate study flashcards & briefs',
      ],
      cta: 'See study workspace',
      accent: '#ff8fa3',
      mockup: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', background: '#0e0517', padding: '30px', boxSizing: 'border-box' }}>
          {/* Graphical Flow: Giant text stack -> Arrow -> Distilled page */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, width: '100%', justifyContent: 'space-around' }}>
            
            {/* Input Stack Representation */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 90, height: 110, border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255,255,255,0.01)', borderRadius: 8, position: 'relative', display: 'flex', flexDirection: 'column', padding: 10, gap: 6 }}>
                {/* Visual lines representation of heavy text */}
                <div style={{ width: '80%', height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
                <div style={{ width: '90%', height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
                <div style={{ width: '70%', height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
                <div style={{ width: '85%', height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
                <div style={{ width: '60%', height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
                {/* Stack shadow pages behind it */}
                <div style={{ position: 'absolute', top: 4, left: 4, width: '100%', height: '100%', border: '1px solid rgba(255, 255, 255, 0.04)', background: 'rgba(255,255,255,0.005)', borderRadius: 8, zIndex: -1 }} />
                <div style={{ position: 'absolute', top: 8, left: 8, width: '100%', height: '100%', border: '1px solid rgba(255, 255, 255, 0.02)', background: 'rgba(255,255,255,0.002)', borderRadius: 8, zIndex: -2 }} />
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>1,200 Pages</span>
            </div>

            {/* Glowing Action Arrow */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 24, color: '#ff8fa3', animation: 'premiumPulse 1.5s infinite' }}>➔</div>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Distill</span>
            </div>

            {/* Output Distilled Brief Representation */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 110, height: 110, border: '1px solid rgba(255, 143, 163, 0.25)', background: 'rgba(255, 143, 163, 0.04)', borderRadius: 12, display: 'flex', flexDirection: 'column', padding: 12, gap: 10, justifyContent: 'center', boxShadow: '0 8px 24px rgba(255, 143, 163, 0.08)' }}>
                {/* 2 Clean Checkmark lines */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff8fa3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#000', fontWeight: 'bold' }}>✓</div>
                  <div style={{ width: 50, height: 4, background: '#fff', borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff8fa3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#000', fontWeight: 'bold' }}>✓</div>
                  <div style={{ width: 40, height: 4, background: '#fff', borderRadius: 2 }} />
                </div>
              </div>
              <span style={{ fontSize: 11, color: '#ff8fa3', fontWeight: 600 }}>1 Page Brief</span>
            </div>

          </div>
        </div>
      )
    },
    {
      title: 'Founders',
      icon: '💼',
      desc: 'Spot contract risks and deadlines.',
      bullets: [
        'Locate silent termination and liability clauses',
        'Extract binding deadlines & follow-ups',
        'Identify negotiation leverage and risks',
      ],
      cta: 'See legal analyzer',
      accent: '#818cf8',
      mockup: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', background: '#070514', padding: '30px', boxSizing: 'border-box' }}>
          {/* Graphical representation: contract document with pop-up risk warning boxes */}
          <div style={{ display: 'flex', gap: 20, width: '100%', alignItems: 'center' }}>
            
            {/* Abstract Contract Layout */}
            <div style={{ flex: 1.1, height: 150, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ width: 50, height: 5, background: 'rgba(255,255,255,0.2)', borderRadius: 2, marginBottom: 4 }} />
              <div style={{ width: '90%', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} />
              <div style={{ width: '85%', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} />
              <div style={{ width: '95%', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} />
              <div style={{ width: '40%', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} />
            </div>

            {/* Glowing Risk Alerts */}
            <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(239, 68, 68, 0.1)' }}>
                <span style={{ fontSize: 14 }}>🚨</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fca5a5', letterSpacing: '0.02em' }}>Termination Clause Risk</span>
              </div>
              <div style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.25)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(251, 191, 36, 0.1)' }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fde68a', letterSpacing: '0.02em' }}>Liability Cap Missing</span>
              </div>
            </div>

          </div>
        </div>
      )
    },
    {
      title: 'Creators',
      icon: '✍️',
      desc: 'Manage sponsor deals and feedback.',
      bullets: [
        'Analyze feedback and sponsor inquiries',
        'Extract core demands and deal timelines',
        'Generate polite professional replies instantly',
      ],
      cta: 'See reply tuner',
      accent: '#34d399',
      mockup: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', background: '#040b12', padding: '30px', boxSizing: 'border-box' }}>
          {/* Graphical representation: abstract feedback balloons to a tone indicator dial */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', alignItems: 'center', gap: 16 }}>
            
            {/* Abstract Bubble Comments */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '40%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: 8, borderRadius: '10px 10px 10px 0', width: '100%' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
                <div style={{ width: '70%', height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: 8, borderRadius: '10px 10px 10px 0', width: '90%' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
                <div style={{ width: '50%', height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
              </div>
            </div>

            {/* Neon Connection */}
            <div style={{ fontSize: 20, color: '#34d399' }}>➔</div>

            {/* Graphical Tone Dial (Metric Circle) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                border: '6px solid rgba(52, 211, 153, 0.08)',
                borderTopColor: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(52, 211, 153, 0.15)',
                position: 'relative'
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Polite</span>
                <span style={{ fontSize: 9, color: '#34d399', position: 'absolute', bottom: 12 }}>92%</span>
              </div>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tone Checked</span>
            </div>

          </div>
        </div>
      )
    },
    {
      title: 'Busy Teams',
      icon: '⚡',
      desc: 'Turn long messages into actions.',
      bullets: [
        'Turn Slack/email storm into task checklists',
        'Extract deadlines and responsible assignees',
        'Strip corporate greeting fluff and summaries',
      ],
      cta: 'See task workspace',
      accent: '#a78bfa',
      mockup: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', background: '#0e0417', padding: '30px', boxSizing: 'border-box' }}>
          {/* Graphical representation: message blocks triage to task checklist with avatars */}
          <div style={{ display: 'flex', gap: 20, width: '100%', alignItems: 'center' }}>
            
            {/* Input Chat Bubbles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              <div style={{ width: '90%', height: 36, background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 8, padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ width: 35, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 1 }} />
                <div style={{ width: '80%', height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 1 }} />
              </div>
              <div style={{ width: '100%', height: 36, background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 8, padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ width: 25, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 1 }} />
                <div style={{ width: '70%', height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 1 }} />
              </div>
            </div>

            {/* Arrow */}
            <div style={{ fontSize: 20, color: '#a78bfa' }}>➔</div>

            {/* Checklist items with assignees */}
            <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(167, 139, 250, 0.05)', border: '1px solid rgba(167, 139, 250, 0.18)', padding: '8px 10px', borderRadius: 8 }}>
                <span style={{ fontSize: 10, color: '#a78bfa', fontWeight: 'bold' }}>✓</span>
                <span style={{ fontSize: 11, color: 'white', fontWeight: 500, flexGrow: 1 }}>Figma Assets</span>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#a78bfa', color: '#000', fontSize: 8, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(167, 139, 250, 0.05)', border: '1px solid rgba(167, 139, 250, 0.18)', padding: '8px 10px', borderRadius: 8 }}>
                <span style={{ fontSize: 10, color: '#a78bfa', fontWeight: 'bold' }}>✓</span>
                <span style={{ fontSize: 11, color: 'white', fontWeight: 500, flexGrow: 1 }}>Review pricing</span>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#a78bfa', color: '#000', fontSize: 8, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>J</div>
              </div>
            </div>

          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const checkMotion = () => {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    checkViewport();
    checkMotion();

    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useEffect(() => {
    if (isMobile || reducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveIndex();
          ticking = false;
        });
        ticking = true;
      }
    };

    const updateActiveIndex = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerTop = rect.top + window.scrollY;
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;

      const start = containerTop;
      const end = containerTop + containerHeight - windowHeight;

      const currentScroll = window.scrollY;
      let progress = 0;

      if (currentScroll > start) {
        progress = (currentScroll - start) / (end - start);
      }
      progress = Math.max(0, Math.min(1, progress));

      // 4 use cases, map 0..1 to 0..3
      const targetIndex = Math.min(3, Math.floor(progress * 4));
      
      // Update state ONLY if the index actually changes (highly optimized)
      setActiveIndex(prev => (prev !== targetIndex ? targetIndex : prev));

      // Update progress bar widths directly in the DOM for smooth scrolling performance
      for (let i = 0; i < 4; i++) {
        const bar = progressRefs.current[i];
        if (!bar) continue;

        const startSeg = i * 0.25;
        const endSeg = (i + 1) * 0.25;
        let fill = 0;

        if (progress >= endSeg) {
          fill = 100;
        } else if (progress <= startSeg) {
          fill = 0;
        } else {
          fill = ((progress - startSeg) / 0.25) * 100;
        }

        const innerBar = bar.firstElementChild as HTMLDivElement;
        if (innerBar) {
          innerBar.style.width = `${fill}%`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveIndex();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, reducedMotion]);

  if (isMobile || reducedMotion) {
    /* Mobile/Reduced-motion Layout: Standard clean stacked visual list */
    return (
      <section style={{ padding: '40px 20px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: '1.1', letterSpacing: '-0.03em', textAlign: 'center', margin: '0 0 12px', background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' }}>
            Built for people who hate long text
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(239,237,253,0.6)', lineHeight: '24px', maxWidth: 640, margin: '0 auto 36px', textAlign: 'center' }}>
            We don't suffer from a lack of information. We suffer from too much text, hidden noise, and unclear next steps. Sumalyze strips the clutter.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {useCases.map((item) => (
              <div key={item.title} style={{
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 20,
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{item.icon}</span>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: 'white', margin: 0 }}>{item.title}</h3>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: '20px', margin: 0 }}>{item.desc}</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '6px 0 12px' }}>
                    {item.bullets.map((bullet, idx) => (
                      <li key={idx} style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: item.accent }}>✓</span> {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Visualizer Mockup Panel */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 12,
                  minHeight: 240,
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {item.mockup}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* Desktop Sticky storytelling visual layout */
  return (
    <div ref={containerRef} style={{ height: STORY_SECTION_HEIGHT, position: 'relative', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <div style={{ position: 'sticky', top: '80px', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 1400, width: '100%', margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1.20fr', gap: '80px', alignItems: 'center' }}>
          
          {/* Left panel: text content */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 12 }}>
              Workspace Use Cases
            </span>
            <h2 style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: '1.15', letterSpacing: '-0.03em', color: 'white', margin: '0 0 24px' }}>
              Built for people who hate long text.
            </h2>
            
            {/* Active content panel */}
            <div style={{ minHeight: 260, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28 }}>{useCases[activeIndex].icon}</span>
                <span style={{ fontSize: 22, fontWeight: 600, color: 'white' }}>{useCases[activeIndex].title}</span>
              </div>
              
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: '26px', margin: 0 }}>
                {useCases[activeIndex].desc}
              </p>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '8px 0' }}>
                {useCases[activeIndex].bullets.map((bullet, idx) => (
                  <li key={idx} style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: useCases[activeIndex].accent, fontWeight: 'bold' }}>✓</span> {bullet}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 12 }}>
                <button style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: useCases[activeIndex].accent,
                  background: `${useCases[activeIndex].accent}12`,
                  border: `1px solid ${useCases[activeIndex].accent}24`,
                  padding: '10px 20px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${useCases[activeIndex].accent}22`; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${useCases[activeIndex].accent}12`; }}>
                  {useCases[activeIndex].cta} →
                </button>
              </div>
            </div>

            {/* Step Indicators / Progress Bars */}
            <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
              {useCases.map((item, idx) => (
                <div 
                  key={idx} 
                  ref={el => { progressRefs.current[idx] = el; }}
                  style={{
                    width: 48,
                    height: 4,
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    width: activeIndex >= idx ? '100%' : '0%',
                    height: '100%',
                    background: item.accent,
                    borderRadius: 2,
                    transition: 'background-color 0.3s ease'
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: illustration / mockups */}
          <div style={{
            position: 'relative',
            height: 480,
            background: 'linear-gradient(135deg, rgba(20, 10, 30, 0.4) 0%, rgba(10, 5, 20, 0.6) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          }}>
            {/* Display the active mockup frame with smooth fade transitions */}
            {useCases.map((item, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: activeIndex === idx ? 1 : 0,
                  visibility: activeIndex === idx ? 'visible' : 'hidden',
                  transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.6s ease',
                }}
              >
                {item.mockup}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
