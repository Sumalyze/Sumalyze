import { useState } from 'react';

/* ─── Data ────────────────────────────────────────────────────── */

interface UseCase {
  icon: string;
  role: string;
  headline: string;
  scenario: string;
  outcome: string;
  tools: string[];
  accent: string;
}

const B2C_CASES: UseCase[] = [
  {
    icon: '🎓',
    role: 'Students',
    headline: 'Tackle a 40-page research paper in minutes',
    scenario: 'You have 3 papers due tomorrow and a 30-page chapter you haven\'t touched. No time to read everything cover-to-cover.',
    outcome: 'Paste the chapter. Get the core thesis, key arguments, important terms, and a Q&A-ready summary. Absorb the essentials in 2 minutes.',
    tools: ['Summarizer', 'Bullet Brief', 'Document Brief'],
    accent: '#818cf8',
  },
  {
    icon: '✍️',
    role: 'Creators',
    headline: 'Turn messy notes into polished content',
    scenario: 'You have rough ideas, voice notes, and braindumps scattered across 5 apps. Your audience wants clean content, not your chaos.',
    outcome: 'Paste your raw thoughts. Get LinkedIn posts, captions, or thread formats — rewritten, structured, and ready to publish.',
    tools: ['Post Rewriter', 'Bullet Brief', 'Tone Analyzer'],
    accent: '#f472b6',
  },
  {
    icon: '💼',
    role: 'Freelancers',
    headline: 'Understand client messages and reply with confidence',
    scenario: 'A client sends a vague or passive-aggressive message. You\'re not sure if they\'re frustrated, changing scope, or about to leave.',
    outcome: 'Paste the message. The Agent reads the tone, decodes the real intent, flags any risks, and gives you 3 reply options to choose from.',
    tools: ['Tone Analyzer', 'Intent Detector', 'Reply Helper'],
    accent: '#34d399',
  },
  {
    icon: '🔍',
    role: 'Job Seekers',
    headline: 'Decode recruiter messages and job offers',
    scenario: 'You got a long job description or a confusing recruiter email. You\'re not sure what they actually want or if the offer is fair.',
    outcome: 'Paste it in. Get a plain-language breakdown, key requirements extracted, and a signal check for red flags before you invest your time.',
    tools: ['Email Simplifier', 'Signals Detector', 'Document Brief'],
    accent: '#22d3ee',
  },
  {
    icon: '📬',
    role: 'Everyday Users',
    headline: 'Finally understand that long, confusing email',
    scenario: 'Your landlord, bank, or insurance company sent a 3-page message full of jargon. You have no idea what they actually want from you.',
    outcome: 'Paste it. Get a plain-English version, the core ask highlighted, and what you need to do next — in under 10 seconds.',
    tools: ['Email Simplifier', 'Summarizer', 'Intent Detector'],
    accent: '#fbbf24',
  },
];

const B2B_CASES: UseCase[] = [
  {
    icon: '🎧',
    role: 'Support Teams',
    headline: 'Triage complaints and draft replies in seconds',
    scenario: 'Your inbox is full of upset customers. Every message needs the right level of empathy and the right action — fast.',
    outcome: 'Paste a customer message. Get urgency level, emotional state, core issue, and a draft reply that hits the right tone — before you type a word.',
    tools: ['Tone Analyzer', 'Intent Detector', 'Reply Helper'],
    accent: '#34d399',
  },
  {
    icon: '📈',
    role: 'Sales Teams',
    headline: 'Extract objections and buying signals from every prospect',
    scenario: 'A prospect sends a lukewarm reply. You can\'t tell if they\'re interested, stalling, or about to ghost you.',
    outcome: 'Paste the message. Get a buying intent score, objections identified, hidden signals surfaced, and a tailored follow-up reply.',
    tools: ['Intent Detector', 'Signals Detector', 'Reply Helper'],
    accent: '#22d3ee',
  },
  {
    icon: '👤',
    role: 'HR & Recruiting',
    headline: 'Summarize candidate notes into objective, structured briefs',
    scenario: 'After a day of interviews, your notes are scattered and subjective. You need clean summaries to make fair, consistent hiring decisions.',
    outcome: 'Paste your raw interview notes. Get a structured candidate brief, key strengths, concerns, communication tone, and a hire/no-hire readiness score.',
    tools: ['Meeting Notes', 'Bullet Brief', 'Tone Analyzer'],
    accent: '#fbbf24',
  },
  {
    icon: '🧭',
    role: 'Founders & Operators',
    headline: 'Turn dense emails and docs into clear decisions',
    scenario: 'Your investor just sent a long, ambiguous update. Your team is waiting for direction. You need to understand the situation and move — fast.',
    outcome: 'Paste the document or email. Get a situation overview, the key decision required, options identified, risks per option, and a recommended next move.',
    tools: ['Document Brief', 'Signals Detector', 'Summarizer'],
    accent: '#f472b6',
  },
  {
    icon: '🏢',
    role: 'Agencies',
    headline: 'Process client feedback without losing the thread',
    scenario: 'A client just sent 5 paragraphs of rambling feedback on your work. Some of it is praise, some is concern, and some is a hidden scope change.',
    outcome: 'Paste the feedback. Instantly separate what\'s actionable from what\'s noise, flag scope changes, and draft a professional acknowledgment.',
    tools: ['Tone Analyzer', 'Signals Detector', 'Reply Helper'],
    accent: '#818cf8',
  },
];

/* ─── Use Case Card ───────────────────────────────────────────── */

function UseCaseCard({ uc }: { uc: UseCase }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.013)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20, overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${uc.accent}30`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      <div style={{ height: 2, background: `linear-gradient(90deg, ${uc.accent}, transparent)` }} />
      <div style={{ padding: '22px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `${uc.accent}15`, border: `1px solid ${uc.accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
            {uc.icon}
          </div>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, color: uc.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{uc.role}</span>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white', margin: '4px 0 0', lineHeight: '20px', letterSpacing: '-0.01em' }}>{uc.headline}</h3>
          </div>
        </div>

        {/* Scenario */}
        <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 5px' }}>The situation</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: '18px', margin: 0, fontStyle: 'italic' }}>"{uc.scenario}"</p>
        </div>

        {/* Outcome (expandable) */}
        {!expanded ? (
          <button onClick={() => setExpanded(true)} style={{ background: 'none', border: 'none', color: uc.accent, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0, fontWeight: 500 }}>
            → See how Sumalyze helps ↓
          </button>
        ) : (
          <>
            <div style={{ padding: '10px 12px', borderRadius: 10, background: `${uc.accent}08`, border: `1px solid ${uc.accent}18`, marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: uc.accent, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 5px' }}>What you get</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: '18px', margin: 0 }}>{uc.outcome}</p>
            </div>
            <button onClick={() => setExpanded(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
              ↑ Collapse
            </button>
          </>
        )}

        {/* Tools */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 14 }}>
          {uc.tools.map(t => (
            <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: `${uc.accent}10`, color: uc.accent, border: `1px solid ${uc.accent}20` }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Use Cases Page ──────────────────────────────────────────── */

export default function UseCasesPage({ onNavigateTools, onNavigateAgent }: { onNavigateTools: () => void; onNavigateAgent: () => void }) {
  const [audience, setAudience] = useState<'b2c' | 'b2b'>('b2c');

  const cases = audience === 'b2c' ? B2C_CASES : B2B_CASES;

  return (
    <div style={{ minHeight: '100vh', background: '#0a000f', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 120 }}>
      {/* Hero */}
      <div style={{ padding: '100px 20px 60px', background: 'radial-gradient(40% 60% at 50% 0%, rgba(52,211,153,0.06) 0%, transparent 100%)', borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 32, background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)', marginBottom: 20 }}>
          <span style={{ fontSize: 13, fontWeight: 500, background: 'linear-gradient(90deg, #6ee7b7, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Use Cases
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(34px, 5vw, 54px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 16px' }}>
          <span style={{ background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Built for people</span>
          {' '}
          <span style={{ background: 'linear-gradient(180deg, #6ee7b7 0%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>and teams.</span>
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(239,237,253,0.6)', maxWidth: 520, margin: '0 auto 32px', lineHeight: '26px' }}>
          Whether you're a student drowning in readings or a sales team buried in emails, Sumalyze turns messy text into clear next steps.
        </p>

        {/* B2C / B2B toggle */}
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 4, gap: 4 }}>
          {(['b2c', 'b2b'] as const).map(a => (
            <button key={a} onClick={() => setAudience(a)} style={{
              padding: '10px 28px', borderRadius: 9, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              background: audience === a ? 'rgba(52,211,153,0.15)' : 'transparent',
              border: audience === a ? '1px solid rgba(52,211,153,0.3)' : '1px solid transparent',
              color: audience === a ? '#34d399' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.25s',
            }}>
              {a === 'b2c' ? '👤 For Individuals' : '🏢 For Teams'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px 0' }}>
        {/* Context blurb */}
        <div style={{ maxWidth: 600, margin: '0 auto 40px', textAlign: 'center' }}>
          {audience === 'b2c' ? (
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: '24px' }}>
              For students, creators, freelancers, job seekers, and anyone dealing with confusing or overwhelming text every day.
            </p>
          ) : (
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: '24px' }}>
              For support teams, sales, HR, founders, and agencies that need to process large volumes of communication quickly and accurately.
            </p>
          )}
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {cases.map(uc => <UseCaseCard key={uc.role} uc={uc} />)}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <div style={{ padding: '28px', background: 'rgba(226,62,87,0.06)', border: '1px solid rgba(226,62,87,0.15)', borderRadius: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 20, marginBottom: 8 }}>⚡</p>
            <p style={{ fontSize: 16, fontWeight: 500, color: 'white', margin: '0 0 8px' }}>Start with a single tool</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 20px', lineHeight: '20px' }}>11 focused AI tools, each one built for a specific job. No setup required.</p>
            <button onClick={onNavigateTools} style={{ padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 500, border: 'none', background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)', color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>
              Browse Tools →
            </button>
          </div>
          <div style={{ padding: '28px', background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.15)', borderRadius: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 20, marginBottom: 8 }}>✧</p>
            <p style={{ fontSize: 16, fontWeight: 500, color: 'white', margin: '0 0 8px' }}>Or go deep with Agent Mode</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 20px', lineHeight: '20px' }}>Paste any text and run a full 6-step analysis workflow in one click.</p>
            <button onClick={onNavigateAgent} style={{ padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 500, border: 'none', background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)', color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>
              Try Agent Mode →
            </button>
          </div>
        </div>

        {/* Support */}
        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', lineHeight: '22px' }}>
            All of this is MVP free. If Sumalyze saves you time,{' '}
            <a href="https://ko-fi.com/sumalyze" target="_blank" rel="noopener noreferrer" style={{ color: '#ff8fa3', textDecoration: 'none' }}>
              consider supporting us on Ko-fi ♥
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
