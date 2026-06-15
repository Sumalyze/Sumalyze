import { useState, useEffect } from 'react';
import { TOOLS, type ToolDef } from '../data/tools';
import { fetchAndCacheLimits, GUEST_DAILY_LIMIT } from '../services/limits';
import { useAuth } from '../hooks/useAuth';
import ToolPanel from '../components/ToolPanel';

/* ─── Category config ──────────────────────────────────── */

const CATEGORY_LABELS: Record<string, { label: string; desc: string; icon: string }> = {
  understand: { label: 'Understand', icon: '◎', desc: 'What does it mean?' },
  detect:     { label: 'Detect',     icon: '⚠', desc: 'What are the risks?' },
  act:        { label: 'Act',        icon: '◷', desc: 'What should I do next?' },
};

const CATEGORIES = ['understand', 'detect', 'act'] as const;

const CATEGORY_MAP: Record<string, string[]> = {
  understand: ['summarizer', 'tone', 'intent'],
  detect:     ['signals', 'contract_lite'],
  act:        ['reply', 'bullet_brief', 'email_simplify', 'doc_brief', 'meeting_notes', 'post_rewriter'],
};

/* ─── Tool card wrapper ─────────────────────────────────── */

function ToolCard({ tool, isLoggedIn, onViewPage }: { tool: ToolDef; isLoggedIn: boolean; onViewPage: (slug: string) => void }) {
  return (
    <div id={`tool-${tool.id}`} style={{
      background: 'rgba(255,255,255,0.013)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'border-color 0.3s ease',
    }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${tool.accent}30`}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      {/* Top accent line */}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${tool.accent}, transparent)` }} />

      {/* Header */}
      <div style={{ padding: '20px 24px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: `${tool.accent}18`, border: `1px solid ${tool.accent}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>
              {tool.icon}
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', margin: 0, letterSpacing: '-0.01em' }}>{tool.name}</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0', lineHeight: '16px' }}>{tool.description}</p>
            </div>
          </div>
          <button onClick={() => onViewPage(tool.slug)} style={{
            padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 500,
            border: `1px solid ${tool.accent}25`, background: `${tool.accent}08`,
            color: tool.accent, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
            transition: 'all 0.2s', flexShrink: 0,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = `${tool.accent}18`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${tool.accent}08`; }}
          >
            Details →
          </button>
        </div>
      </div>

      {/* Panel (card mode) */}
      <div style={{ flex: 1 }}>
        <ToolPanel tool={tool} isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}

/* ─── Tools Page ───────────────────────────────────────── */

export default function ToolsPage({
  onSignIn,
  onNavigateTool,
}: {
  onSignIn: () => void;
  onNavigateTool: (slug: string) => void;
}) {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      fetchAndCacheLimits();
    }
  }, [isLoggedIn]);

  const filtered = TOOLS.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeCategory === 'all') return true;
    return CATEGORY_MAP[activeCategory]?.includes(t.id);
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a000f', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 120 }}>
      {/* Hero header */}
      <div style={{ paddingTop: 100, paddingBottom: 60, padding: '100px 20px 60px', background: 'radial-gradient(40% 60% at 50% 0%, rgba(226,62,87,0.07) 0%, transparent 100%)', borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 16px' }}>
          <span style={{ background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Pick a tool.
          </span>
          {' '}
          <span style={{ background: 'linear-gradient(180deg, #ff8fa3 0%, #E23E57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Get the point.
          </span>
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(239,237,253,0.6)', maxWidth: 480, margin: '0 auto 32px', lineHeight: '26px' }}>
          Focused AI tools for understanding text, detecting risks, and deciding what to do next. Each one wired to your input.
        </p>

        {/* Category filter + search */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 700, margin: '0 auto' }}>
          <button onClick={() => setActiveCategory('all')} style={{
            padding: '8px 16px', borderRadius: 99, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            border: activeCategory === 'all' ? '1px solid rgba(226,62,87,0.35)' : '1px solid rgba(255,255,255,0.08)',
            background: activeCategory === 'all' ? 'rgba(226,62,87,0.12)' : 'rgba(255,255,255,0.03)',
            color: activeCategory === 'all' ? '#ff8fa3' : 'rgba(255,255,255,0.5)',
            transition: 'all 0.2s',
          }}>
            All Tools
          </button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)} style={{
              padding: '8px 16px', borderRadius: 99, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              border: activeCategory === c ? '1px solid rgba(226,62,87,0.35)' : '1px solid rgba(255,255,255,0.08)',
              background: activeCategory === c ? 'rgba(226,62,87,0.12)' : 'rgba(255,255,255,0.03)',
              color: activeCategory === c ? '#ff8fa3' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.2s',
            }}>
              {CATEGORY_LABELS[c].icon} {CATEGORY_LABELS[c].label}
            </button>
          ))}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tools..."
            style={{
              padding: '8px 14px', borderRadius: 99, fontSize: 13, background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none',
              fontFamily: 'inherit', width: 160,
            }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px 0' }}>
        {/* Sign-in nudge for guests */}
        {!isLoggedIn && (
          <div style={{ marginBottom: 32, padding: '14px 20px', borderRadius: 12, background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              Using tools as guest · <strong style={{ color: 'white' }}>{GUEST_DAILY_LIMIT} free tool uses per day</strong> · Sign in for more
            </p>
            <button onClick={onSignIn} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: 'none', background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)', color: 'white', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(226,62,87,0.3)' }}>
              Sign In Free
            </button>
          </div>
        )}

        {/* Tool grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
            <p style={{ fontSize: 16 }}>No tools match "{search}"</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 20 }}>
            {filtered.map(tool => (
              <ToolCard key={tool.id} tool={tool} isLoggedIn={isLoggedIn} onViewPage={onNavigateTool} />
            ))}
          </div>
        )}
      </div>

      {/* Relocated Core Tone Section */}
      <InteractiveToneSection />

      {/* Relocated Bento Grid Modules Section */}
      <BentoModulesSection />

      {/* Bottom Support nudge */}
      <div style={{ maxWidth: 600, margin: '80px auto 0', padding: '0 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', lineHeight: '22px' }}>
          All tools are free. If Sumalyze helps you,{' '}
          <a href="https://ko-fi.com/sumalyze" target="_blank" rel="noopener noreferrer" style={{ color: '#ff8fa3', textDecoration: 'none' }}>
            support us on Ko-fi ♥
          </a>
        </p>
      </div>
    </div>
  );
}

/* ─── Shared Section Layout Components ────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: '1.2', letterSpacing: '-0.02em', textAlign: 'center', margin: '0 0 16px', background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' }}>
      {children}
    </h2>
  );
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 16, color: 'rgba(239,237,253,0.6)', lineHeight: '26px', maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
      {children}
    </p>
  );
}

/* ─── Relocated Tone Preset Demonstration Section ───────────────── */

function InteractiveToneSection() {
  const toneDemos = [
    {
      label: "The Vague Request",
      original: "Hey, we need that thing we talked about done soon. Let me know when it's ready.",
      analysis: "High uncertainty (70% vagueness). Key context (what 'thing' is, when 'soon' is) is completely missing.",
      intent: "They want progress but haven't specified the scope, placing the burden of clarification on you.",
      reply: "Hi there! Just to confirm, are we referring to the homepage redesign draft? If so, I can have that ready by Friday 2 PM. Let me know if you need it sooner!"
    },
    {
      label: "Passive-Aggressive Email",
      original: "Per my previous email, the deadline was yesterday. I suppose you were occupied with other things.",
      analysis: "Defensive tone (80% passive-aggressive). High emotional intensity.",
      intent: "Blame attribution. Establishing a leverage position due to a missed deadline.",
      reply: "Hi! Apologies for the delay on this. I'm finalizing it now and will have it in your inbox by 3 PM today. Thank you for your patience."
    },
    {
      label: "Urgent Escalation",
      original: "WE HAVE A CRISIS. The server is throwing 500 errors and users can't log in. FIX THIS NOW.",
      analysis: "High panic (95% urgency). Polite levels are near 0%. Needs immediate triage.",
      intent: "Emergency support demand. Critical blocker preventing core business operations.",
      reply: "Hi team, I am investigating this immediately. I've located the server error and am deploying a hotfix now. Expected status resolution: 15 minutes."
    }
  ];

  const [activeToneIdx, setActiveToneIdx] = useState(0);
  const activeTone = toneDemos[activeToneIdx];

  return (
    <section id="tone-presets" style={{ padding: '120px 20px 40px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionTitle>Understand tone before you reply</SectionTitle>
        <SectionDesc>AI reads the hidden subtext of chaotic messages and helps you draft de-escalating, professional replies instantly.</SectionDesc>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginTop: 48 }} className="tone-grid-layout">
          <style>{`
            @media(max-width: 768px) {
              .tone-grid-layout {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
          
          {/* Tone Selector buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {toneDemos.map((td, idx) => (
              <button key={td.label} onClick={() => setActiveToneIdx(idx)}
                style={{
                  textAlign: 'left', padding: '16px', borderRadius: 12,
                  background: activeToneIdx === idx ? 'rgba(226,62,87,0.08)' : 'rgba(255,255,255,0.02)',
                  border: activeToneIdx === idx ? '1px solid rgba(226,62,87,0.25)' : '1px solid rgba(255,255,255,0.06)',
                  color: activeToneIdx === idx ? 'white' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column', gap: 4,
                  fontFamily: 'inherit',
                }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{td.label}</span>
                <span style={{ fontSize: 11, color: activeToneIdx === idx ? '#ff8fa3' : 'rgba(255,255,255,0.3)' }}>Click to analyze subtext</span>
              </button>
            ))}
          </div>

          {/* Tone Display Board */}
          <div className="hover-card" style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20, padding: '28px',
            display: 'flex', flexDirection: 'column', gap: 20,
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(226, 62, 87, 0.2), transparent)' }} />
            
            {/* The Original Text Block */}
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Chaotic Message Received</span>
              <div style={{ marginTop: 8, padding: '14px 18px', borderRadius: 12, background: 'rgba(10,0,15,0.4)', border: '1px solid rgba(255,255,255,0.05)', fontSize: 14, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', lineHeight: '1.6' }}>
                "{activeTone.original}"
              </div>
            </div>

            {/* Split Decoded Result */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="tone-inner-grid">
              <style>{`
                @media(max-width: 540px) {
                  .tone-inner-grid {
                    grid-template-columns: 1fr !important;
                  }
                }
              `}</style>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>◎ Pulse Tone Analysis</span>
                <p style={{ marginTop: 6, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>{activeTone.analysis}</p>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>◈ Decrypted Intent</span>
                <p style={{ marginTop: 6, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>{activeTone.intent}</p>
              </div>
            </div>

            {/* Recommended Reply Draft */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em' }}>◷ Suggested Reply Draft</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.15)', padding: '12px 16px', borderRadius: 10 }}>
                {activeTone.reply}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Bento Grid Modules Section ─────────────────────────────────── */

function BentoModulesSection() {
  return (
    <section id="modules" style={{ padding: '80px 20px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionTitle>Ten tools. One workspace.</SectionTitle>
        <SectionDesc>We run ten specialized analysis models simultaneously to inspect your text from every angle.</SectionDesc>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16, marginTop: 48 }} className="bento-container">
          <style>{`
            @media(max-width: 1024px) {
              .bento-container {
                grid-template-columns: repeat(6, 1fr) !important;
              }
              .bento-col-8, .bento-col-4, .bento-col-6, .bento-col-3 {
                grid-column: span 6 !important;
              }
            }
            @media(max-width: 640px) {
              .bento-container {
                grid-template-columns: 1fr !important;
              }
              .bento-col-8, .bento-col-4, .bento-col-6, .bento-col-3 {
                grid-column: span 1 !important;
              }
            }
          `}</style>

          {/* 1. BRIEF MODULE (Col span 8) */}
          <div className="bento-card bento-col-8" style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 220 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#E23E57' }}>✦</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#E23E57', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Brief</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: 'white', marginBottom: 8 }}>Summarize anything in seconds</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: '1.6', maxWidth: 450 }}>
                Condense long, verbose documents into essential takeaways. Save hours of reading without losing critical insights.
              </p>
            </div>
            
            {/* Visual simulation */}
            <div style={{ display: 'flex', gap: 16, marginTop: 20, alignItems: 'center', background: 'rgba(10,0,15,0.4)', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ flex: 1, fontSize: 11, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna...
              </div>
              <span style={{ color: '#E23E57', fontSize: 14 }}>➔</span>
              <div style={{ flex: 1, fontSize: 11, color: '#ff8fa3', fontWeight: 500 }}>
                ✓ Distilled to one actionable, core conclusion.
              </div>
            </div>
          </div>

          {/* 2. PULSE MODULE (Col span 4) */}
          <div className="bento-card bento-col-4" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#f472b6' }}>◎</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pulse</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: 'white', marginBottom: 8 }}>Tone & Emotion</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: '1.6' }}>
                Uncover emotional signals such as hostility, frustration, or fear.
              </p>
            </div>

            {/* Visual simulation: Mini bar chart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16 }}>
              {[
                { name: 'Urgency', val: 85, col: '#f472b6' },
                { name: 'Politeness', val: 30, col: '#818cf8' }
              ].map(em => (
                <div key={em.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 2 }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{em.name}</span>
                    <span style={{ color: em.col }}>{em.val}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <div style={{ height: '100%', background: em.col, width: `${em.val}%`, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. SIGNALS MODULE (Col span 4) */}
          <div className="bento-card bento-col-4" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#fbbf24' }}>⚠</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Signals</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: 'white', marginBottom: 8 }}>Risk & Red Flags</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: '1.6' }}>
                Instantly flag scam attempts, manipulation, or hidden threats.
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', padding: '6px 10px', borderRadius: 8, marginTop: 14 }}>
              <span style={{ fontSize: 12 }}>🚨</span>
              <span style={{ fontSize: 11, color: '#fde68a', fontWeight: 500 }}>Suspicious Urgency Detected</span>
            </div>
          </div>

          {/* 4. REPLY MODULE (Col span 8) */}
          <div className="bento-card bento-col-8" style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#34d399' }}>◷</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reply</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: 'white', marginBottom: 8 }}>Smart Draft suggestions</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: '1.6', maxWidth: 450 }}>
                Get custom response recommendations optimized for tone (e.g. empathetic, firm, cooperative) to resolve conflicts and move projects forward.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }} className="bento-replies-flex">
              <div style={{ flex: 1, padding: '8px 12px', background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                <span style={{ display: 'block', fontSize: 9, fontWeight: 600, color: '#6ee7b7', marginBottom: 3 }}>FIRM REPLY</span>
                "We require deadline adherence or project cancellation..."
              </div>
              <div style={{ flex: 1, padding: '8px 12px', background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.15)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                <span style={{ display: 'block', fontSize: 9, fontWeight: 600, color: '#a5b4fc', marginBottom: 3 }}>COOPERATIVE REPLY</span>
                "Let's sync up immediately to resolve blocker issues..."
              </div>
            </div>
          </div>

          {/* 5. SCORE (Col span 3) */}
          <div className="bento-card bento-col-3" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 180 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#a78bfa' }}>◆</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Score</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: 'white', marginBottom: 6 }}>Metrics Score</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>
                Grade clarity, politeness, and professional levels.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: 'white' }}>9.2</span>
                <span style={{ display: 'block', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>Clarity</span>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: 'white' }}>1.5</span>
                <span style={{ display: 'block', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>Risk</span>
              </div>
            </div>
          </div>

          {/* 6. INTENT (Col span 3) */}
          <div className="bento-card bento-col-3" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#818cf8' }}>◈</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Intent</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: 'white', marginBottom: 6 }}>Hidden Meaning</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>
                Find the underlying message beneath the fluff.
              </p>
            </div>
            <div style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', padding: '4px 8px', borderRadius: 6, fontSize: 11, color: '#a5b4fc', textAlign: 'center', marginTop: 14 }}>
              Intent: Negotiate Price ◈
            </div>
          </div>

          {/* 7. EXTRACT (Col span 3) */}
          <div className="bento-card bento-col-3" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#22d3ee' }}>◻</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Extract</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: 'white', marginBottom: 6 }}>Tasks & Dates</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>
                Pull action items and deadlines out automatically.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 14 }}>
              <span style={{ fontSize: 10, padding: '2px 6px', background: 'rgba(34,211,238,0.1)', color: '#67e8f9', borderRadius: 4 }}>✓ Review Draft</span>
              <span style={{ fontSize: 10, padding: '2px 6px', background: 'rgba(251,146,60,0.1)', color: '#fdba74', borderRadius: 4 }}>📅 Friday 2pm</span>
            </div>
          </div>

          {/* 8. REWRITE (Col span 3) */}
          <div className="bento-card bento-col-3" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#fb923c' }}>↺</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Rewrite</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: 'white', marginBottom: 6 }}>Style Redraft</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>
                Transform your draft into custom professional styles.
              </p>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 14, fontStyle: 'italic' }}>
              Casual ➔ Professional
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

