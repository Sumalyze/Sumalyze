import { useEffect, useRef, useState } from 'react';

const SCROLL_SECTION_HEIGHT = '300vh'; // Easily adjustable constant for scroll speed/depth

interface CardData {
  icon: string;
  label: string;
  title: string;
  desc: string;
  color: string;
  tools: string[];
}

const CARDS: CardData[] = [
  {
    icon: '◎',
    label: 'Summarize',
    title: 'Get the point instantly.',
    desc: 'Distill long documents, articles, or threads into clear, structured bullet points with zero noise.',
    color: '#ff8fa3',
    tools: ['Summarizer', 'Bullet Brief', 'Email Simplifier'],
  },
  {
    icon: '⚠',
    label: 'Analyze tone',
    title: 'Read between the lines.',
    desc: 'Detect passive-aggression, emotional cues, hidden urgency, and risk factors in any communication.',
    color: '#818cf8',
    tools: ['Tone Analyzer', 'Signals Detector', 'Intent Detector'],
  },
  {
    icon: '◷',
    label: 'Extract action steps',
    title: 'Know the next move.',
    desc: 'Automatically isolate tasks, deadlines, follow-ups, and drafts customized to your exact situation.',
    color: '#34d399',
    tools: ['Reply Helper', 'Contract Explainer', 'Task Extractor'],
  },
  {
    icon: '✧',
    label: 'Clean key points',
    title: 'Remove the fluff.',
    desc: 'Isolate essential facts, figures, and dates while stripping out corporate speak and introductory padding.',
    color: '#fbbf24',
    tools: ['Fluff Remover', 'Fact Finder', 'Briefing Creator'],
  },
  {
    icon: '◳',
    label: 'Save history',
    title: 'Never lose clarity.',
    desc: 'Keep track of all parsed documents, filters, and past AI translations in a secure local database.',
    color: '#f472b6',
    tools: ['Local Storage', 'Search Index', 'Archiver'],
  },
];

export default function HomeModesScrollSection({ onNavigate }: { onNavigate: (page: any) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check screen size & reduced motion status
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
          updatePosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    const updatePosition = () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const rect = container.getBoundingClientRect();
      const containerTop = rect.top + window.scrollY;
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Start scrolling when top of container reaches top of viewport
      const start = containerTop;
      // End scrolling when bottom of container reaches bottom of viewport
      const end = containerTop + containerHeight - windowHeight;

      const currentScroll = window.scrollY;
      let progress = 0;

      if (currentScroll > start) {
        progress = (currentScroll - start) / (end - start);
      }
      progress = Math.max(0, Math.min(1, progress));

      // Calculate translation range based on scroll track width and window width
      const maxScrollDistance = track.scrollWidth - window.innerWidth;
      if (maxScrollDistance > 0) {
        track.style.transform = `translateX(-${progress * maxScrollDistance}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initial positioning
    updatePosition();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, reducedMotion]);

  if (isMobile || reducedMotion) {
    /* Mobile/Reduced-motion Layout: Standard touch horizontal scroll list */
    return (
      <section style={{ padding: '40px 20px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: '1.1', letterSpacing: '-0.03em', textAlign: 'center', margin: '0 0 12px', background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' }}>
            One platform. Multiple modes of clarity.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(239,237,253,0.6)', lineHeight: '24px', maxWidth: 520, margin: '0 auto 32px', textAlign: 'center' }}>
            Scroll to explore clarity.
          </p>

          <div style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            paddingBottom: 20,
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}>
            {CARDS.map((card) => (
              <div key={card.label} style={{
                flex: '0 0 280px',
                scrollSnapAlign: 'start',
                background: 'rgba(255,255,255,0.013)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${card.color}, transparent)` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${card.color}15`, border: `1px solid ${card.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{card.icon}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: card.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{card.label}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white' }}>{card.title}</h3>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: '18px', flexGrow: 1 }}>{card.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {card.tools.map(t => (
                    <span key={t} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 5, background: `${card.color}10`, color: card.color, border: `1px solid ${card.color}20` }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('tools')} style={{ padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: 'inherit' }}>
              Browse All Tools →
            </button>
            <button onClick={() => onNavigate('agent')} style={{ padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 500, border: 'none', background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)', color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>
              Try Agent Mode ✧
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* Desktop layout: Sticky section with horizontal scroll linked to vertical scroll */
  return (
    <div ref={containerRef} style={{ height: SCROLL_SECTION_HEIGHT, position: 'relative' }}>
      <div style={{ position: 'sticky', top: '80px', height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '32px', overflow: 'hidden', boxSizing: 'border-box' }}>
        
        {/* Title Context Info */}
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 20px', zIndex: 5 }}>
          <h2 style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500, fontSize: '44px', lineHeight: '1.1', letterSpacing: '-0.03em', background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', margin: '0 0 8px' }}>
            One platform. Multiple modes of clarity.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(239,237,253,0.55)', margin: 0 }}>
            Scroll to explore clarity.
          </p>
        </div>

        {/* Scroll Horizontal Track */}
        <div ref={trackRef} style={{
          display: 'flex',
          gap: 32,
          paddingLeft: 'max(80px, calc((100vw - 1200px) / 2))',
          paddingRight: '25vw',
          willChange: 'transform',
          transition: 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {CARDS.map((card) => (
            <div key={card.label} className="hover-card" style={{
              flex: '0 0 450px',
              height: '400px',
              boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.013)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${card.color}, transparent)` }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${card.color}15`, border: `1px solid ${card.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{card.icon}</div>
                <span style={{ fontSize: 10, fontWeight: 700, color: card.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{card.label}</span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 600, color: 'white', letterSpacing: '-0.01em', margin: 0 }}>{card.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: '22px', flexGrow: 1, margin: 0 }}>{card.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {card.tools.map(t => (
                  <span key={t} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: `${card.color}10`, color: card.color, border: `1px solid ${card.color}20` }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
          
          {/* Last slide placeholder for navigation buttons */}
          <div style={{
            flex: '0 0 450px',
            height: '400px',
            boxSizing: 'border-box',
            borderRadius: 12,
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 16,
            background: 'rgba(255, 255, 255, 0.005)',
            border: '1px dashed rgba(255, 255, 255, 0.05)',
          }}>
            <h4 style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.5)', textAlign: 'center', margin: 0 }}>Ready to unlock efficiency?</h4>
            <button onClick={() => onNavigate('tools')} style={{ width: '100%', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'white', cursor: 'pointer' }}>
              Browse All Tools
            </button>
            <button onClick={() => onNavigate('agent')} style={{ width: '100%', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600, border: 'none', background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)', color: 'white', cursor: 'pointer' }}>
              Try Agent Mode ✧
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
