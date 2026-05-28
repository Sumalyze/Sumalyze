import { useState } from 'react';
import { WORKFLOWS, type WorkflowDef, type WorkflowStatus } from '../data/workflows';

/* ─── Status Badge ────────────────────────────────────────────── */

function StatusBadge({ status }: { status: WorkflowStatus }) {
  const map: Record<WorkflowStatus, { label: string; color: string; bg: string; border: string }> = {
    active:       { label: 'Active',       color: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.2)' },
    mock:         { label: 'Preview',      color: '#818cf8', bg: 'rgba(129,140,248,0.1)',  border: 'rgba(129,140,248,0.2)' },
    coming_soon:  { label: 'Coming Soon',  color: '#6B7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)' },
  };
  const s = map[status];
  return (
    <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 10, fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}`, letterSpacing: '0.04em' }}>
      {s.label}
    </span>
  );
}

/* ─── Workflow Card ───────────────────────────────────────────── */

function WorkflowCard({ workflow, onActivate }: { workflow: WorkflowDef; onActivate: (id: string) => void }) {
  const isAvailable = workflow.status !== 'coming_soon';

  return (
    <div
      id={`workflow-${workflow.id}`}
      style={{
        background: 'rgba(255,255,255,0.013)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.3s ease',
        opacity: isAvailable ? 1 : 0.6,
        cursor: isAvailable ? 'default' : 'not-allowed',
      }}
      onMouseEnter={e => {
        if (isAvailable) {
          (e.currentTarget as HTMLElement).style.borderColor = `${workflow.accent}35`;
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 20px ${workflow.accent}08`;
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Top accent */}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${workflow.accent}, transparent)` }} />

      <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11, flexShrink: 0, fontSize: 18,
              background: `${workflow.accent}15`, border: `1px solid ${workflow.accent}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {workflow.icon}
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white', margin: 0, letterSpacing: '-0.01em' }}>{workflow.name}</h3>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '2px 0 0' }}>{workflow.targetUser}</p>
            </div>
          </div>
          <StatusBadge status={workflow.status} />
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: '20px', margin: 0 }}>
          {workflow.description}
        </p>

        {/* Output sections */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Output Sections
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {workflow.outputSections.map((s, i) => (
              <span key={i} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: `${workflow.accent}10`, color: workflow.accent, border: `1px solid ${workflow.accent}20` }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {workflow.tags.map(tag => (
            <span key={tag} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA footer */}
      <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {isAvailable ? (
          <button
            onClick={() => onActivate(workflow.id)}
            style={{
              width: '100%', padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 500,
              border: `1px solid ${workflow.accent}35`, background: `${workflow.accent}12`,
              color: workflow.accent, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${workflow.accent}22`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${workflow.accent}12`; }}
          >
            → Open Workflow
          </button>
        ) : (
          <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)', padding: '6px 0' }}>
            Coming soon — stay tuned
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Workflow Detail Modal ───────────────────────────────────── */

function WorkflowDetailModal({ workflow, onClose, onRunAgent }: {
  workflow: WorkflowDef; onClose: () => void; onRunAgent: () => void;
}) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 998, animation: 'fadeUp 0.2s ease' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 999, width: 'calc(100% - 32px)', maxWidth: 520,
        background: 'rgba(14,4,22,0.97)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20, padding: '32px 28px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.8)', animation: 'fadeUp 0.25s ease',
        boxSizing: 'border-box',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${workflow.accent}, transparent)`, borderRadius: '20px 20px 0 0' }} />
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `${workflow.accent}18`, border: `1px solid ${workflow.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{workflow.icon}</div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'white', margin: 0 }}>{workflow.name}</h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>{workflow.targetUser}</p>
          </div>
        </div>

        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: '22px', marginBottom: 20 }}>{workflow.description}</p>

        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Example prompt</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            "{workflow.examplePrompt}"
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Output sections</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {workflow.outputSections.map((s, i) => (
              <span key={i} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 7, background: `${workflow.accent}12`, color: workflow.accent, border: `1px solid ${workflow.accent}22` }}>{s}</span>
            ))}
          </div>
        </div>

        <button onClick={onRunAgent} style={{ width: '100%', padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 500, border: 'none', background: `linear-gradient(135deg, ${workflow.accent} 0%, ${workflow.accent}99 100%)`, color: 'white', cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 20px ${workflow.accent}35` }}>
          → Run this Workflow in Agent Mode
        </button>
      </div>
    </>
  );
}

/* ─── Workflows Page ──────────────────────────────────────────── */

export default function WorkflowsPage({ onNavigateAgent }: { onNavigateAgent: () => void }) {
  const [activeDetail, setActiveDetail] = useState<WorkflowDef | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'coming_soon'>('all');

  const filtered = WORKFLOWS.filter(w => {
    if (filter === 'available') return w.status !== 'coming_soon';
    if (filter === 'coming_soon') return w.status === 'coming_soon';
    return true;
  });

  const handleActivate = (id: string) => {
    const wf = WORKFLOWS.find(w => w.id === id);
    if (wf) setActiveDetail(wf);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a000f', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 120 }}>
      {/* Hero */}
      <div style={{ padding: '100px 20px 60px', background: 'radial-gradient(40% 60% at 50% 0%, rgba(129,140,248,0.07) 0%, transparent 100%)', borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 32, background: 'rgba(129,140,248,0.07)', border: '1px solid rgba(129,140,248,0.2)', marginBottom: 20 }}>
          <span style={{ fontSize: 13, fontWeight: 500, background: 'linear-gradient(90deg, #a5b4fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Workflows
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(34px, 5vw, 54px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 16px' }}>
          <span style={{ background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Purpose-built</span>
          {' '}
          <span style={{ background: 'linear-gradient(180deg, #a5b4fc 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>workflows.</span>
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(239,237,253,0.6)', maxWidth: 520, margin: '0 auto 32px', lineHeight: '26px' }}>
          Pre-configured AI workflows for specific roles and tasks. More focused than tools, more structured than the Agent. Pick one, paste your content, get results.
        </p>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {(['all', 'available', 'coming_soon'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', borderRadius: 99, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              border: filter === f ? '1px solid rgba(129,140,248,0.4)' : '1px solid rgba(255,255,255,0.08)',
              background: filter === f ? 'rgba(129,140,248,0.12)' : 'rgba(255,255,255,0.03)',
              color: filter === f ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.2s',
            }}>
              {f === 'all' ? 'All Workflows' : f === 'available' ? 'Available Now' : 'Coming Soon'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px 0' }}>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
          {[
            { val: WORKFLOWS.filter(w => w.status !== 'coming_soon').length, label: 'Available now' },
            { val: WORKFLOWS.filter(w => w.status === 'coming_soon').length, label: 'Coming soon' },
            { val: WORKFLOWS.length, label: 'Total workflows' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '14px 28px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
              <p style={{ fontSize: 28, fontWeight: 600, color: 'white', margin: 0, letterSpacing: '-0.03em' }}>{s.val}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '4px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Workflow grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filtered.map(wf => (
            <WorkflowCard key={wf.id} workflow={wf} onActivate={handleActivate} />
          ))}
        </div>

        {/* CTA to Agent */}
        <div style={{ marginTop: 60, padding: '32px', background: 'rgba(226,62,87,0.05)', border: '1px solid rgba(226,62,87,0.15)', borderRadius: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: 'white', margin: '0 0 8px' }}>Need something more custom?</p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '0 0 20px' }}>Use Agent Mode to run any text through a fully custom multi-step analysis.</p>
          <button onClick={onNavigateAgent} style={{ padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 500, border: 'none', background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)', color: 'white', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(226,62,87,0.3)' }}>
            → Open Agent Mode
          </button>
        </div>
      </div>

      {/* Detail modal */}
      {activeDetail && (
        <WorkflowDetailModal
          workflow={activeDetail}
          onClose={() => setActiveDetail(null)}
          onRunAgent={() => { setActiveDetail(null); onNavigateAgent(); }}
        />
      )}
    </div>
  );
}
