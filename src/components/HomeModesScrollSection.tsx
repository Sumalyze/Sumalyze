import { useEffect, useRef, useState } from 'react';

const SCROLL_SECTION_HEIGHT = '300vh';

interface PreviewLine {
  type: 'label' | 'bullet' | 'row' | 'badge' | 'text';
  content: string;
  sub?: string;
  accent?: boolean;
}

interface CardData {
  icon: string;
  label: string;
  title: string;
  desc: string;
  color: string;
  tools: string[];
  preview: PreviewLine[];
  cta: string;
  slug: string;
}

const CARDS: CardData[] = [
  {
    icon: '◎',
    label: 'Summarize',
    title: 'Get the point instantly.',
    desc: 'Turn long text into clear, structured takeaways.',
    color: '#ff8fa3',
    tools: ['Summarizer', 'Bullet Brief', 'Email Simplifier'],
    preview: [
      { type: 'label', content: 'Summary' },
      { type: 'bullet', content: 'Core message extracted' },
      { type: 'bullet', content: 'Key context preserved' },
      { type: 'bullet', content: 'Noise removed' },
    ],
    cta: 'Open tool →',
    slug: 'summarizer',
  },
  {
    icon: '⚠',
    label: 'Analyze Tone',
    title: 'Read between the lines.',
    desc: 'Detect tone, urgency, and hidden signals instantly.',
    color: '#818cf8',
    tools: ['Tone Analyzer', 'Signals Detector', 'Intent Detector'],
    preview: [
      { type: 'label', content: 'Tone' },
      { type: 'badge', content: 'Neutral' },
      { type: 'row', content: 'Urgency', sub: 'Medium' },
      { type: 'row', content: 'Risk', sub: 'Low' },
    ],
    cta: 'Open tool →',
    slug: 'tone-analyzer',
  },
  {
    icon: '◷',
    label: 'Extract Action Steps',
    title: 'Know the next move.',
    desc: 'Pull out tasks, deadlines, and follow-ups fast.',
    color: '#34d399',
    tools: ['Task Extractor', 'Reply Helper', 'Contract Explainer'],
    preview: [
      { type: 'label', content: 'Next steps' },
      { type: 'bullet', content: 'Reply by Friday', accent: true },
      { type: 'bullet', content: 'Confirm timeline' },
      { type: 'bullet', content: 'Send draft update' },
    ],
    cta: 'Open tool →',
    slug: 'task-extractor',
  },
  {
    icon: '✧',
    label: 'Clean Up Text',
    title: 'Remove the noise.',
    desc: 'Clean messy writing without losing the meaning.',
    color: '#fbbf24',
    tools: ['Fluff Remover', 'Fact Finder', 'Briefing Creator'],
    preview: [
      { type: 'label', content: 'Cleaned' },
      { type: 'text', content: 'Shorter. Clearer. Easier to send.' },
    ],
    cta: 'Open tool →',
    slug: 'fluff-remover',
  },
  {
    icon: '◳',
    label: 'Save History',
    title: 'Never lose clarity.',
    desc: 'All your past analyses, stored and searchable.',
    color: '#f472b6',
    tools: ['Local Storage', 'Search Index', 'Archiver'],
    preview: [
      { type: 'label', content: 'History' },
      { type: 'row', content: 'Last analysis', sub: '2 min ago' },
      { type: 'row', content: 'Documents', sub: '14 saved' },
      { type: 'row', content: 'Tags', sub: 'work, legal' },
    ],
    cta: 'View history →',
    slug: '',
  },
];

function MiniPreview({ lines, color }: { lines: PreviewLine[]; color: string }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.35)',
      border: `1px solid ${color}18`,
      borderRadius: 10,
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      flex: 1,
      minHeight: 100,
    }}>
      {lines.map((line, i) => {
        if (line.type === 'label') return (
          <span key={i} style={{ fontSize: 9, fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.8 }}>
            {line.content}
          </span>
        );
        if (line.type === 'bullet') return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: line.accent ? color : 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, color: line.accent ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)', lineHeight: '16px' }}>{line.content}</span>
          </div>
        );
        if (line.type === 'row') return (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)' }}>{line.content}</span>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{line.sub}</span>
          </div>
        );
        if (line.type === 'badge') return (
          <span key={i} style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 6, background: `${color}20`, color, border: `1px solid ${color}30`, fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>
            {line.content}
          </span>
        );
        if (line.type === 'text') return (
          <span key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: '18px', fontStyle: 'italic' }}>
            {line.content}
          </span>
        );
        return null;
      })}
    </div>
  );
}

function ModeCard({ card, onNavigate, isDesktop }: { card: CardData; onNavigate: (p: any) => void; isDesktop: boolean }) {
  const [hovered, setHovered] = useState(false);

  const cardStyle: React.CSSProperties = {
    flex: isDesktop ? '0 0 380px' : '0 0 300px',
    height: isDesktop ? '420px' : 'auto',
    minHeight: isDesktop ? 'unset' : 340,
    boxSizing: 'border-box',
    background: hovered
      ? `rgba(255,255,255,0.028)`
      : 'rgba(255,255,255,0.013)',
    border: hovered
      ? `1px solid ${card.color}40`
      : '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: '28px 26px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    position: 'relative',
    overflow: 'hidden',
    cursor: 'default',
    transition: 'border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: hovered
      ? `0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px ${card.color}12, 0 0 40px ${card.color}08`
      : '0 2px 16px rgba(0,0,0,0.2)',
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
    scrollSnapAlign: 'start',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${card.color}cc, ${card.color}00)`,
        opacity: hovered ? 1 : 0.6,
        transition: 'opacity 0.35s ease',
      }} />

      {/* Subtle corner glow */}
      <div style={{
        position: 'absolute', top: -40, left: -40,
        width: 140, height: 140,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${card.color}12 0%, transparent 70%)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
      }} />

      {/* Header: icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: `${card.color}18`,
          border: `1px solid ${card.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: card.color,
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}>
          {card.icon}
        </div>
        <span style={{
          fontSize: 9.5, fontWeight: 700, color: card.color,
          textTransform: 'uppercase', letterSpacing: '0.12em',
        }}>
          {card.label}
        </span>
      </div>

      {/* Title + description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontSize: isDesktop ? 20 : 17, fontWeight: 600, color: 'white', letterSpacing: '-0.02em', margin: 0, lineHeight: '1.2' }}>
          {card.title}
        </h3>
        <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', lineHeight: '18px', margin: 0 }}>
          {card.desc}
        </p>
      </div>

      {/* Mini preview box */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
        <MiniPreview lines={card.preview} color={card.color} />
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, position: 'relative', zIndex: 1 }}>
        {card.tools.map(t => (
          <span key={t} style={{
            fontSize: 9.5, padding: '2px 8px', borderRadius: 5,
            background: `${card.color}0e`,
            color: card.color,
            border: `1px solid ${card.color}22`,
            letterSpacing: '0.02em',
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => onNavigate('tools')}
        style={{
          alignSelf: 'flex-start',
          fontSize: 12, fontWeight: 600,
          color: hovered ? card.color : 'rgba(255,255,255,0.4)',
          background: 'transparent', border: 'none',
          cursor: 'pointer', padding: 0,
          fontFamily: 'inherit',
          transition: 'color 0.25s ease',
          position: 'relative', zIndex: 1,
        }}
      >
        {card.cta}
      </button>
    </div>
  );
}

export default function HomeModesScrollSection({ onNavigate }: { onNavigate: (page: any) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 768);
    const checkMotion = () => setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
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

      const start = containerTop;
      const end = containerTop + containerHeight - windowHeight;

      const currentScroll = window.scrollY;
      let progress = 0;
      if (currentScroll > start) {
        progress = (currentScroll - start) / (end - start);
      }
      progress = Math.max(0, Math.min(1, progress));

      const maxScrollDistance = track.scrollWidth - window.innerWidth;
      if (maxScrollDistance > 0) {
        track.style.transform = `translateX(-${progress * maxScrollDistance}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updatePosition();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, reducedMotion]);

  /* ── Section header shared ── */
  const SectionHeader = ({ mobile }: { mobile: boolean }) => (
    <div style={{
      display: 'flex',
      alignItems: mobile ? 'flex-start' : 'flex-end',
      justifyContent: 'space-between',
      flexDirection: mobile ? 'column' : 'row',
      gap: mobile ? 16 : 0,
      maxWidth: 1200,
      margin: '0 auto',
      width: '100%',
      padding: '0 20px',
    }}>
      <div>
        <h2 style={{
          fontWeight: 500,
          fontSize: mobile ? 'clamp(26px,5vw,36px)' : '40px',
          lineHeight: '1.1',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.65) 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 8px',
        }}>
          One platform. Multiple modes of clarity.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(239,237,253,0.5)', margin: 0, lineHeight: '1.5' }}>
          Choose the mode that matches what you need right now.
        </p>
      </div>
      <button
        onClick={() => onNavigate('tools')}
        style={{
          flexShrink: 0,
          fontSize: 13, fontWeight: 500,
          color: 'rgba(255,255,255,0.45)',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: '8px 16px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'color 0.2s, border-color 0.2s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        }}
      >
        Explore all modes →
      </button>
    </div>
  );

  /* ── Mobile layout ── */
  if (isMobile || reducedMotion) {
    return (
      <section style={{ padding: '56px 0 48px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <SectionHeader mobile />

        <div style={{
          marginTop: 28,
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 8,
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          // hide scrollbar
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        } as React.CSSProperties}>
          {CARDS.map(card => (
            <ModeCard key={card.label} card={card} onNavigate={onNavigate} isDesktop={false} />
          ))}
        </div>
      </section>
    );
  }

  /* ── Desktop layout: scroll-driven horizontal ── */
  return (
    <div ref={containerRef} style={{ height: SCROLL_SECTION_HEIGHT, position: 'relative', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{
        position: 'sticky',
        top: '72px',
        height: 'calc(100vh - 72px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '28px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        paddingTop: 12,
      }}>

        <SectionHeader mobile={false} />

        {/* Horizontal scroll track */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: 20,
            paddingLeft: 'max(60px, calc((100vw - 1200px) / 2))',
            paddingRight: '20vw',
            willChange: 'transform',
            transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {CARDS.map(card => (
            <ModeCard key={card.label} card={card} onNavigate={onNavigate} isDesktop />
          ))}

          {/* End card */}
          <div style={{
            flex: '0 0 320px',
            height: '420px',
            boxSizing: 'border-box',
            borderRadius: 16,
            padding: '36px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 20,
            background: 'rgba(255,255,255,0.006)',
            border: '1px dashed rgba(255,255,255,0.07)',
          }}>
            <div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, margin: '0 0 10px' }}>
                11+ tools
              </p>
              <h4 style={{ fontSize: 20, fontWeight: 600, color: 'rgba(255,255,255,0.7)', margin: '0 0 8px', letterSpacing: '-0.01em', lineHeight: '1.2' }}>
                More modes await.
              </h4>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: 0, lineHeight: '1.5' }}>
                Explore the full workspace when you're ready.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
              <button
                onClick={() => onNavigate('tools')}
                style={{
                  width: '100%', padding: '11px', borderRadius: 10, fontSize: 13,
                  fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.75)',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
              >
                Browse All Tools
              </button>
              <button
                onClick={() => onNavigate('agent')}
                style={{
                  width: '100%', padding: '11px', borderRadius: 10, fontSize: 13,
                  fontWeight: 600, border: 'none',
                  background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
                  color: 'white', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Try Agent Mode ✧
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
