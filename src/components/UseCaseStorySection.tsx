import { useEffect, useRef, useState } from 'react';

const STORY_SECTION_HEIGHT = '300vh';
const SLIDER_MIN = 8;
const SLIDER_MAX = 92;

/* ─────────────────────────────────────────────────────────────
   Before panels — dark, muted, messy
───────────────────────────────────────────────────────────── */
function BeforePanel({ 
  title, 
  meta, 
  lines, 
  accentMeta, 
  compact 
}: { 
  title: string; 
  meta: string; 
  lines: string[]; 
  accentMeta: string; 
  compact: boolean;
}) {
  return (
    <div style={{ 
      position: 'absolute', 
      inset: 0, 
      background: 'rgb(5,2,12)', 
      padding: compact ? '36px 14px 14px' : '46px 20px 20px', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 0 
    }}>
      <div style={{ 
        fontSize: compact ? 9.5 : 10.5, 
        fontWeight: 700, 
        color: 'rgba(255,255,255,0.38)', 
        marginBottom: 3, 
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis',
        letterSpacing: '0.02em'
      }}>
        {title}
      </div>
      <div style={{ 
        fontSize: compact ? 8 : 8.5, 
        fontWeight: 600, 
        color: accentMeta, 
        marginBottom: compact ? 10 : 14,
        letterSpacing: '0.05em',
        textTransform: 'uppercase'
      }}>
        {meta}
      </div>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: compact ? 6 : 8,
        flex: 1,
        overflow: 'hidden'
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{ 
            fontSize: compact ? 9.5 : 10.5, 
            color: 'rgba(255,255,255,0.3)', 
            lineHeight: 1.35,
            fontFamily: 'Inter, system-ui, sans-serif',
            borderLeft: '2px solid rgba(255, 255, 255, 0.05)',
            paddingLeft: 8
          }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   After panels — clean, structured, accent-colored
───────────────────────────────────────────────────────────── */
function AfterPanel({ 
  title, 
  items, 
  footer, 
  accent, 
  compact 
}: { 
  title: string; 
  items: { icon: string; text: string }[]; 
  footer: string; 
  accent: string; 
  compact: boolean;
}) {
  return (
    <div style={{ 
      position: 'absolute', 
      inset: 0, 
      background: 'rgb(8,4,18)', 
      padding: compact ? '36px 14px 14px' : '46px 20px 20px', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 0 
    }}>
      <div style={{ 
        fontSize: compact ? 9.5 : 10.5, 
        fontWeight: 700, 
        color: accent, 
        marginBottom: compact ? 10 : 14, 
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis',
        letterSpacing: '0.03em'
      }}>
        {title}
      </div>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: compact ? 6 : 8,
        flex: 1
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: compact ? 8 : 10,
            padding: compact ? '5px 8px' : '7px 11px', 
            borderRadius: 6,
            background: `${accent}0a`, 
            border: `1px solid ${accent}1c`,
            boxShadow: '0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.01)',
            minWidth: 0,
          }}>
            <span style={{ 
              fontSize: compact ? 10 : 11, 
              color: accent, 
              flexShrink: 0, 
              marginTop: 0.5 
            }}>{item.icon}</span>
            <span style={{ 
              fontSize: compact ? 9.5 : 10.5, 
              color: 'rgba(255,255,255,0.85)', 
              fontWeight: 500, 
              lineHeight: 1.35,
              wordBreak: 'break-word'
            }}>{item.text}</span>
          </div>
        ))}
      </div>
      <div style={{ 
        marginTop: 'auto', 
        fontSize: compact ? 8 : 8.5, 
        color: `${accent}aa`, 
        fontStyle: 'italic', 
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis',
        letterSpacing: '0.01em'
      }}>
        {footer}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Content data
───────────────────────────────────────────────────────────── */
interface PanelData {
  before: { title: string; meta: string; lines: string[]; accentMeta: string };
  after:  { title: string; items: { icon: string; text: string }[]; footer: string };
}

const PANEL_DATA: Record<string, PanelData> = {
  Students: {
    before: { 
      title: 'Textbook chapter', 
      meta: '1,200 pages', 
      accentMeta: 'rgba(255,143,163,0.55)', 
      lines: [
        'Cellular respiration is the process by which cells convert glucose into usable energy.',
        'Glycolysis begins in the cytoplasm and produces pyruvate.',
        'The Krebs cycle continues inside the mitochondria.',
        'Electron transport creates most ATP through oxidative phosphorylation.',
        'Key definitions are scattered across multiple sections.'
      ] 
    },
    after:  { 
      title: '1-page study brief', 
      items: [
        { icon: '📌', text: 'Key definitions extracted' },
        { icon: '🧠', text: 'Core ideas grouped' },
        { icon: '🗂', text: 'Flashcards ready' }
      ], 
      footer: 'Study faster, not longer.' 
    },
  },
  Founders: {
    before: { 
      title: 'Contract draft', 
      meta: 'Legal document', 
      accentMeta: 'rgba(129,140,248,0.55)', 
      lines: [
        'Either party may terminate this agreement with written notice.',
        'Liability shall be limited except in cases of gross negligence.',
        'Renewal occurs automatically unless cancelled before the renewal date.',
        'Service credits are the sole remedy for downtime.',
        'Payment terms apply regardless of implementation delays.'
      ] 
    },
    after:  { 
      title: '3 risks found', 
      items: [
        { icon: '⚠️', text: 'Termination clause risk' },
        { icon: '🛡', text: 'Liability cap missing' },
        { icon: '⏱', text: 'Renewal deadline' }
      ], 
      footer: 'Review before Friday.' 
    },
  },
  Creators: {
    before: { 
      title: 'Sponsor messages', 
      meta: 'Mixed feedback', 
      accentMeta: 'rgba(52,211,153,0.55)', 
      lines: [
        'Hey, love your content and maybe we can collaborate next month.',
        'We need two posts, one story, and possibly a short video.',
        'Budget is flexible but we need quick turnaround.',
        'Can you also make it feel natural and not too sponsored?',
        'Let us know your rate and timeline.'
      ] 
    },
    after:  { 
      title: 'Reply ready', 
      items: [
        { icon: '💬', text: 'Tone: Polite' },
        { icon: '🎯', text: 'Core ask extracted' },
        { icon: '🗓', text: 'Timeline clarified' }
      ], 
      footer: 'Send a cleaner reply.' 
    },
  },
  'Busy Teams': {
    before: { 
      title: 'Long thread', 
      meta: '32 messages', 
      accentMeta: 'rgba(167,139,250,0.55)', 
      lines: [
        'Can someone check the pricing page before launch?',
        'Figma assets are still missing from the shared folder.',
        'I think the deadline moved but I cannot find the message.',
        'We also need final copy for the onboarding screen.',
        'Who owns the support page update?'
      ] 
    },
    after:  { 
      title: 'Task list', 
      items: [
        { icon: '💸', text: 'Review pricing' },
        { icon: '📁', text: 'Send assets' },
        { icon: '✅', text: 'Confirm deadline' }
      ], 
      footer: 'Everyone knows the next step.' 
    },
  },
};

/* ─────────────────────────────────────────────────────────────
   BeforeAfterSlider
   TWO-PANEL stationary approach using clip-path
───────────────────────────────────────────────────────────── */
interface SliderProps {
  title: string;
  accent: string;
  reducedMotion: boolean;
  compact?: boolean;
}

function BeforeAfterSlider({ title, accent, reducedMotion, compact = false }: SliderProps) {
  const [pct, setPct] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const data = PANEL_DATA[title];

  const clamp = (v: number) => Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, v));

  const getPct = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return 50;
    const { left, width } = el.getBoundingClientRect();
    return clamp(((clientX - left) / width) * 100);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.focus();
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    setDragging(true);
    setHintVisible(false);
    setPct(getPct(e.clientX));
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setPct(getPct(e.clientX));
  };

  const onPointerUp = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); setPct(p => clamp(p - 5)); setHintVisible(false); }
    if (e.key === 'ArrowRight') { e.preventDefault(); setPct(p => clamp(p + 5)); setHintVisible(false); }
  };

  const t = (reducedMotion || dragging) ? 'none' : 'left 0.15s ease-out, clip-path 0.15s ease-out';

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label="Compare before and after"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={SLIDER_MIN}
      aria-valuemax={SLIDER_MAX}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={() => setHintVisible(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', cursor: dragging ? 'ew-resize' : 'col-resize', userSelect: 'none', touchAction: 'none', outline: 'none' }}
    >
      {/* ── LEFT: Before panel (stationary, clip-path) ── */}
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - pct}% 0 0)`, transition: t }}>
        <BeforePanel {...data.before} compact={compact} />
      </div>

      {/* ── RIGHT: After panel (stationary, clip-path) ── */}
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${pct}%)`, transition: t }}>
        <AfterPanel {...data.after} accent={accent} compact={compact} />
      </div>

      {/* ── Divider line ── */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0,
        left: `${pct}%`, transform: 'translateX(-50%)',
        width: 1.5,
        background: 'rgba(255,255,255,0.55)',
        pointerEvents: 'none', zIndex: 10,
        transition: t,
      }} />

      {/* ── Handle (visual only) ── */}
      <div
        style={{
          position: 'absolute', top: '50%', left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: 30, height: 30, borderRadius: '50%',
          background: 'rgb(5,2,12)',
          border: `2px solid ${accent}`,
          boxShadow: dragging ? `0 0 0 5px ${accent}45` : `0 0 0 3px ${accent}25, 0 2px 8px rgba(0,0,0,0.7)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'ew-resize', zIndex: 20, outline: 'none',
          transition: t,
        }}
      >
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M3.5 4H1M1 4L3 1.5M1 4L3 6.5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.5 4H11M11 4L9 1.5M11 4L9 6.5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* ── Labels — z-index 30, always readable ── */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 30, pointerEvents: 'none' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 4, background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'block' }} />
          <span style={{ fontSize: 8.5, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Before</span>
        </div>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.22)', paddingLeft: 3, marginTop: 2 }}>Messy input</div>
      </div>

      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 30, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 4, background: 'rgba(0,0,0,0.75)', border: `1px solid ${accent}45` }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: accent, display: 'block' }} />
          <span style={{ fontSize: 8.5, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>After</span>
        </div>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.22)', paddingRight: 3, marginTop: 2 }}>Clear output</div>
      </div>

      {/* ── Hint ── */}
      {hintVisible && (
        <div style={{
          position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
          zIndex: 30, pointerEvents: 'none',
          background: 'rgba(4,1,12,0.82)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 5, padding: '3px 10px',
          fontSize: 9, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap',
        }}>
          Drag to compare
        </div>
      )}
    </div>
  );
}



/* ─────────────────────────────────────────────────────────────
   UseCase data
───────────────────────────────────────────────────────────── */
interface UseCase {
  title: string;
  icon: string;
  desc: string;
  bullets: string[];
  cta: string;
  accent: string;
}

const USE_CASES: UseCase[] = [
  { title: 'Students',    icon: '🎓', accent: '#ff8fa3', cta: 'See study workspace', desc: 'Understand heavy reading lists immediately.', bullets: ['Analyze long PDFs & textbooks instantly', 'Extract definitions and core hypotheses', 'Auto-generate study flashcards & briefs'] },
  { title: 'Founders',   icon: '💼', accent: '#818cf8', cta: 'See legal analyzer',   desc: 'Spot contract risks before you sign.',       bullets: ['Locate silent termination and liability clauses', 'Extract binding deadlines & follow-ups', 'Identify negotiation leverage and risks'] },
  { title: 'Creators',   icon: '✍️', accent: '#34d399', cta: 'See reply tuner',      desc: 'Manage sponsor deals and feedback.',          bullets: ['Analyze feedback and sponsor inquiries', 'Extract core demands and deal timelines', 'Generate polite professional replies instantly'] },
  { title: 'Busy Teams', icon: '⚡', accent: '#a78bfa', cta: 'See task workspace',   desc: 'Turn long messages into actions.',            bullets: ['Turn Slack/email storm into task checklists', 'Extract deadlines and responsible assignees', 'Strip corporate greeting fluff and summaries'] },
];

/* ─────────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────────── */
export default function UseCaseStorySection() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const progressRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile,    setIsMobile]    = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sliderKey,   setSliderKey]   = useState(0);
  const prevActiveRef = useRef(activeIndex);

  // Reset slider on use-case change
  useEffect(() => {
    if (prevActiveRef.current !== activeIndex) {
      prevActiveRef.current = activeIndex;
      setSliderKey(k => k + 1);
    }
  }, [activeIndex]);

  useEffect(() => {
    const checkVP = () => setIsMobile(window.innerWidth < 768);
    const checkRM = () => setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    checkVP(); checkRM();
    window.addEventListener('resize', checkVP, { passive: true });
    return () => window.removeEventListener('resize', checkVP);
  }, []);

  useEffect(() => {
    if (isMobile || reducedMotion) return;
    let ticking = false;

    const update = () => {
      const c = containerRef.current;
      if (!c) return;
      const { top } = c.getBoundingClientRect();
      const cTop   = top + window.scrollY;
      const cH     = c.getBoundingClientRect().height;
      const wH     = window.innerHeight;
      let prog = window.scrollY > cTop ? (window.scrollY - cTop) / (cH - wH) : 0;
      prog = Math.max(0, Math.min(1, prog));
      const idx = Math.min(3, Math.floor(prog * 4));
      setActiveIndex(prev => prev !== idx ? idx : prev);
      for (let i = 0; i < 4; i++) {
        const bar = progressRefs.current[i];
        if (!bar) continue;
        const s = i * 0.25, e = (i + 1) * 0.25;
        let fill = prog >= e ? 100 : prog > s ? ((prog - s) / 0.25) * 100 : 0;
        (bar.firstElementChild as HTMLDivElement | null)?.style && ((bar.firstElementChild as HTMLDivElement).style.width = `${fill}%`);
      }
    };

    const onScroll = () => { if (!ticking) { requestAnimationFrame(() => { update(); ticking = false; }); ticking = true; } };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile, reducedMotion]);

  const cur = USE_CASES[activeIndex];

  /* ── Mobile ── */
  if (isMobile || reducedMotion) {
    return (
      <section style={{ padding: '48px 20px 40px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontWeight: 500, fontSize: 'clamp(24px,5vw,34px)', lineHeight: '1.1', letterSpacing: '-0.03em', textAlign: 'center', margin: '0 0 10px', background: 'linear-gradient(180deg,#fff 0%,rgba(255,255,255,0.65) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' }}>
            Built for people who hate long text.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(239,237,253,0.5)', lineHeight: '22px', maxWidth: 480, margin: '0 auto 28px', textAlign: 'center' }}>
            Strip the clutter. Keep what matters.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {USE_CASES.map(item => (
              <div key={item.title} style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white', margin: 0 }}>{item.title}</h3>
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 5, margin: 0 }}>
                  {item.bullets.map((b, i) => (
                    <li key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ color: item.accent, fontWeight: 700 }}>✓</span> {b}
                    </li>
                  ))}
                </ul>
                <div style={{ height: 260, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', position: 'relative' }}>
                  <BeforeAfterSlider key={item.title} title={item.title} accent={item.accent} reducedMotion={reducedMotion} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Desktop ── */
  return (
    <div ref={containerRef} style={{ height: STORY_SECTION_HEIGHT, position: 'relative', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ position: 'sticky', top: '72px', height: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 1280, width: '100%', margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '64px', alignItems: 'center' }}>

          {/* Left text */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 12 }}>
              Workspace Use Cases
            </span>
            <h2 style={{ fontWeight: 500, fontSize: 'clamp(26px,3vw,40px)', lineHeight: '1.15', letterSpacing: '-0.03em', color: 'white', margin: '0 0 28px' }}>
              Built for people who hate long text.
            </h2>
            <div style={{ minHeight: 240, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{cur.icon}</span>
                <span style={{ fontSize: 19, fontWeight: 600, color: 'white' }}>{cur.title}</span>
              </div>
              <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.52)', lineHeight: '23px', margin: 0 }}>{cur.desc}</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 9, margin: '4px 0' }}>
                {cur.bullets.map((b, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: cur.accent, fontWeight: 700 }}>✓</span> {b}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 6 }}>
                <button
                  style={{ fontSize: 13, fontWeight: 600, color: cur.accent, background: `${cur.accent}12`, border: `1px solid ${cur.accent}24`, padding: '9px 18px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${cur.accent}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${cur.accent}12`; }}
                >
                  {cur.cta} →
                </button>
              </div>
            </div>
            {/* Progress bars */}
            <div style={{ display: 'flex', gap: 10, marginTop: 40 }}>
              {USE_CASES.map((item, idx) => (
                <div key={idx} ref={el => { progressRefs.current[idx] = el; }} style={{ width: 44, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: activeIndex >= idx ? '100%' : '0%', height: '100%', background: item.accent, borderRadius: 2, transition: 'background-color 0.3s' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: slider box */}
          <div style={{
            position: 'relative', height: 440,
            border: `1px solid rgba(255,255,255,0.08)`,
            borderRadius: 14, overflow: 'hidden',
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${cur.accent}0e`,
            transition: 'box-shadow 0.5s ease',
          }}>
            {/* Top accent bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 5, pointerEvents: 'none', background: `linear-gradient(90deg,${cur.accent}bb,${cur.accent}00)`, transition: 'background 0.5s' }} />

            {/* Fade between use-cases */}
            {USE_CASES.map((item, idx) => (
              <div key={idx} style={{
                position: 'absolute', inset: 0,
                opacity: activeIndex === idx ? 1 : 0,
                visibility: activeIndex === idx ? 'visible' : 'hidden',
                transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1), visibility 0.45s',
              }}>
                <BeforeAfterSlider key={`${idx}-${sliderKey}`} title={item.title} accent={item.accent} reducedMotion={reducedMotion} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
