import { useState, useRef, useCallback, useEffect } from 'react';
import { TOOLS, type ToolDef } from '../data/tools';
import { runSingleTool, type ToolResult } from '../services/ai';
import { isLimitReached, incrementUsage, getRemainingUses, incrementServerUsage, fetchAndCacheLimits } from '../services/limits';
import { useAuth } from '../hooks/useAuth';
import { saveAnalysisHistory, saveOutput } from '../services/database';
import { useToast } from '../components/Toast';
import DocumentUpload from '../components/DocumentUpload';


/* ─── Shared micro-components ──────────────────────────────────── */

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
      borderRadius: 99, fontSize: 11, fontWeight: 600,
      background: `${color}18`, color, border: `1px solid ${color}30`,
      letterSpacing: '0.04em',
    }}>
      {children}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button onClick={copy} style={{
      padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 500,
      border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
      color: copied ? '#34d399' : 'rgba(255,255,255,0.5)', cursor: 'pointer',
      transition: 'all 0.2s', fontFamily: 'inherit',
    }}>
      {copied ? '✓ Copied' : '⌘ Copy'}
    </button>
  );
}

function SaveOutputButton({ title, content, type }: { title: string; content: string; type: string }) {
  const { user } = useAuth();
  const toast = useToast();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await saveOutput(title, content, type);
      if (error) throw error;
      setSaved(true);
      toast.success('Clarity report saved successfully!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast.error(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <button onClick={handleSave} disabled={saved || saving} style={{
      padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 500,
      border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
      color: saved ? '#34d399' : 'rgba(255,255,255,0.5)', cursor: saved ? 'default' : 'pointer',
      transition: 'all 0.2s', fontFamily: 'inherit',
    }}>
      {saving ? '⏳ Saving...' : saved ? '✓ Saved' : '💾 Save Output'}
    </button>
  );
}

/* ─── Individual Tool Panel ────────────────────────────────────── */

function ToolPanel({ tool, isLoggedIn }: { tool: ToolDef; isLoggedIn: boolean }) {
  const [text, setText] = useState('');
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ToolResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const limited = isLimitReached('tools', isLoggedIn);
  const remaining = getRemainingUses('tools', isLoggedIn);
  const canRun = text.trim().length >= 10 && !loading && !limited;

  const run = useCallback(async () => {
    if (!canRun) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await runSingleTool(tool.id, text, abortRef.current.signal);
      setResult(res);
      
      if (isLoggedIn) {
        await incrementServerUsage('increment_tool');
        await saveAnalysisHistory(text, tool.id, res);
      } else {
        incrementUsage('tools', false);
      }
    } catch (e) {
      if (e instanceof Error && e.message !== 'Tool run cancelled') {
        setError(e.message || 'Analysis failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [canRun, text, tool.id, isLoggedIn]);

  const loadPreset = () => {
    setText(tool.exampleText);
    setResult(null);
    setError(null);
  };

  const clear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  return (
    <div id={`tool-${tool.id}`} style={{
      background: 'rgba(255,255,255,0.013)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20, overflow: 'hidden',
      transition: 'border-color 0.3s ease',
    }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${tool.accent}30`}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      {/* Top accent line */}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${tool.accent}, transparent)` }} />

      {/* Header */}
      <div style={{ padding: '20px 24px 0' }}>
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
          <button onClick={loadPreset} style={{
            padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 500,
            border: `1px solid ${tool.accent}30`, background: `${tool.accent}0a`,
            color: tool.accent, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
            transition: 'all 0.2s', flexShrink: 0,
          }}>
            Load Example
          </button>
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: '16px 24px' }}>
        {/* Input tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 3, marginBottom: 12 }}>
          {(['text', 'file'] as const).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => { setInputType(type); setError(null); }}
              style={{
                flex: 1, padding: '6px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s',
                background: inputType === type ? `${tool.accent}12` : 'transparent',
                border: inputType === type ? `1px solid ${tool.accent}25` : '1px solid transparent',
                color: inputType === type ? 'white' : 'rgba(255,255,255,0.4)',
                fontFamily: 'inherit',
              }}
            >
              {type === 'text' ? '📋 Enter Text' : '📎 Upload Document'}
            </button>
          ))}
        </div>

        {inputType === 'text' ? (
          <div style={{ position: 'relative' }}>
            <textarea
              value={text}
              onChange={e => { setText(e.target.value); setError(null); }}
              placeholder={tool.placeholder}
              style={{
                width: '100%', height: 120, background: 'rgba(10,0,15,0.5)',
                border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12,
                padding: '12px 14px', fontSize: 13, color: 'rgba(255,255,255,0.8)',
                resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                lineHeight: '20px', boxSizing: 'border-box', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = `${tool.accent}40`}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
            />
            <span style={{ position: 'absolute', bottom: 8, right: 10, fontSize: 10, color: text.length < 10 && text.length > 0 ? '#fca5a5' : 'rgba(255,255,255,0.2)' }}>
              {text.length} chars
            </span>
          </div>
        ) : (
          <DocumentUpload
            accentColor={tool.accent}
            onTextExtracted={(extractedText) => {
              setText(extractedText);
              setError(null);
            }}
            onError={(err) => setError(err)}
          />
        )}

        {/* Error */}
        {error && (
          <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 12, color: '#fca5a5' }}>
            ⚠ {error}
          </div>
        )}

        {/* Limit warning */}
        {limited && (
          <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)', fontSize: 12, color: '#a5b4fc' }}>
            Daily tool limit reached. Sign in for more free uses.
          </div>
        )}

        {/* Action row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
          <button onClick={run} disabled={!canRun}
            style={{
              flex: 1, padding: '11px', borderRadius: 10, fontSize: 13, fontWeight: 500,
              cursor: canRun ? 'pointer' : 'not-allowed', border: 'none', fontFamily: 'inherit',
              background: canRun ? `linear-gradient(135deg, ${tool.accent} 0%, ${tool.accent}99 100%)` : 'rgba(255,255,255,0.05)',
              color: canRun ? 'white' : 'rgba(255,255,255,0.2)',
              boxShadow: canRun ? `0 4px 16px ${tool.accent}30` : 'none',
              transition: 'all 0.25s',
            }}>
            {loading ? '⏳ Analyzing...' : `⚡ Run ${tool.name}`}
          </button>
          {text && (
            <button onClick={clear} style={{ padding: '11px 14px', borderRadius: 10, fontSize: 13, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: 'inherit' }}>
              ✕
            </button>
          )}
        </div>
        {!isLoggedIn && !limited && (
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 6, textAlign: 'center' }}>
            {remaining} free {remaining === 1 ? 'use' : 'uses'} remaining today
          </p>
        )}
      </div>

      {/* Result */}
      {result && (
        <div style={{ margin: '0 24px 24px', padding: '16px', borderRadius: 12, background: `${tool.accent}08`, border: `1px solid ${tool.accent}20`, animation: 'fadeUp 0.35s ease both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: tool.accent, boxShadow: `0 0 6px ${tool.accent}` }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: tool.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {tool.outputLabel}
              </span>
              {result._mock && <Badge color="#6B7280">Preview</Badge>}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <SaveOutputButton title={tool.name} content={result.output} type={tool.id} />
              <CopyButton text={result.output} />
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: '20px', whiteSpace: 'pre-line', margin: 0 }}>
            {result.output}
          </p>
        </div>
      )}

      {/* Loading shimmer */}
      {loading && (
        <div style={{ margin: '0 24px 24px' }}>
          {[80, 60, 90].map((w, i) => (
            <div key={i} style={{ height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.04)', marginBottom: 8, width: `${w}%`, animation: 'premiumPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Tools Page ───────────────────────────────────────────────── */

const CATEGORY_LABELS: Record<string, { label: string; desc: string; icon: string }> = {
  understand: { label: 'Understand', icon: '◎', desc: 'What does it mean?' },
  detect:     { label: 'Detect',     icon: '⚠', desc: 'What are the risks?' },
  act:        { label: 'Act',        icon: '◷', desc: 'What should I do next?' },
};

const CATEGORIES = ['understand', 'detect', 'act'] as const;

export default function ToolsPage({ onSignIn }: { onSignIn: () => void }) {
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
    const cat = CATEGORIES.find(c => {
      const mapping: Record<string, string[]> = {
        understand: ['summarizer', 'tone', 'intent'],
        detect: ['signals', 'contract_lite'],
        act: ['reply', 'bullet_brief', 'email_simplify', 'doc_brief', 'meeting_notes', 'post_rewriter'],
      };
      return mapping[c]?.includes(t.id);
    });
    return cat === activeCategory;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a000f', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 120 }}>
      {/* Hero header */}
      <div style={{ paddingTop: 100, paddingBottom: 60, padding: '100px 20px 60px', background: 'radial-gradient(40% 60% at 50% 0%, rgba(226,62,87,0.07) 0%, transparent 100%)', borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 32, background: 'rgba(226,62,87,0.07)', border: '1px solid rgba(226,62,87,0.2)', marginBottom: 20 }}>
          <span style={{ fontSize: 13, fontWeight: 500, background: 'linear-gradient(90deg, #ff8fa3, #E23E57)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            11 AI Tools
          </span>
        </div>
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
          11 focused AI tools for understanding text, detecting risks, and deciding what to do next. Each one wired to your input — no fluff.
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
              Using tools as guest · <strong style={{ color: 'white' }}>15 free tool uses per day</strong> · Sign in for more
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
              <ToolPanel key={tool.id} tool={tool} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Ko-fi nudge */}
      <div style={{ maxWidth: 600, margin: '64px auto 0', padding: '0 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', lineHeight: '22px' }}>
          All tools are MVP free. If Sumalyze helps you,{' '}
          <a href="https://ko-fi.com/sumalyze" target="_blank" rel="noopener noreferrer" style={{ color: '#ff8fa3', textDecoration: 'none' }}>
            support us on Ko-fi ♥
          </a>
        </p>
      </div>
    </div>
  );
}
