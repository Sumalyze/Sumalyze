// src/pages/ToolDetailPage.tsx
// Individual tool page — one per slug, e.g. /tools/text-summarizer
// Reuses ToolPanel for all AI + file logic.

import { useEffect } from 'react';
import { getToolBySlug, TOOLS } from '../data/tools';
import { useAuth } from '../hooks/useAuth';
import { fetchAndCacheLimits, GUEST_DAILY_LIMIT } from '../services/limits';
import ToolPanel from '../components/ToolPanel';

interface ToolDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  onSignIn: () => void;
}

export default function ToolDetailPage({ slug, onNavigate, onSignIn }: ToolDetailPageProps) {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const tool = getToolBySlug(slug);

  useEffect(() => {
    if (isLoggedIn) fetchAndCacheLimits();
  }, [isLoggedIn]);

  // Set page title
  useEffect(() => {
    if (tool) {
      document.title = `${tool.name} — Sumalyze AI`;
    } else {
      document.title = 'Tool Not Found — Sumalyze';
    }
    return () => { document.title = 'Sumalyze — AI Clarity Workspace'; };
  }, [tool]);

  // 404 state — tool slug not found
  if (!tool) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a000f', color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px', textAlign: 'center',
      }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
        <h1 style={{ fontSize: 28, fontWeight: 500, color: 'white', marginBottom: 12 }}>Tool not found</h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>
          This tool doesn't exist yet, or the URL might be wrong.
        </p>
        <button
          onClick={() => onNavigate('/tools')}
          style={{
            padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 500,
            background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
            color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          ← Browse all tools
        </button>
      </div>
    );
  }

  // Related tools (same category, not self)
  const related = TOOLS.filter(t => {
    if (t.id === tool.id) return false;
    // Same accent color family = likely related
    return t.accent === tool.accent || TOOLS.indexOf(t) % 4 !== TOOLS.indexOf(tool) % 4;
  }).slice(0, 3);

  return (
    <div style={{
      minHeight: '100vh', background: '#0a000f', color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 120,
    }}>
      {/* Hero header */}
      <div style={{
        paddingTop: 96, paddingBottom: 56, padding: '96px 20px 56px',
        background: `radial-gradient(50% 60% at 50% 0%, ${tool.accent}09 0%, transparent 100%)`,
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <nav style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => onNavigate('/tools')}
              style={{
                fontSize: 13, color: 'rgba(255,255,255,0.4)', background: 'none',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                padding: '4px 0', transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              ← All Tools
            </button>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>/</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>{tool.name}</span>
          </nav>

          {/* Tool badge + icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: `${tool.accent}18`, border: `1px solid ${tool.accent}35`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>
              {tool.icon}
            </div>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '3px 10px', borderRadius: 6,
                background: `${tool.accent}12`, border: `1px solid ${tool.accent}25`,
                marginBottom: 6,
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: tool.accent, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  AI Tool
                </span>
              </div>
            </div>
          </div>

          {/* H1 */}
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 500,
            letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 16px',
            background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.75) 100%)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent', WebkitTextFillColor: 'transparent',
          }}>
            {tool.name}
          </h1>

          {/* Long description */}
          <p style={{
            fontSize: 17, color: 'rgba(239,237,253,0.62)', lineHeight: '28px', margin: '0 0 28px', maxWidth: 640,
          }}>
            {tool.longDescription}
          </p>

          {/* Guest nudge */}
          {!isLoggedIn && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '8px 14px', borderRadius: 10,
              background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.15)',
            }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                Using as guest · {GUEST_DAILY_LIMIT} free uses/day ·
              </span>
              <button onClick={onSignIn} style={{
                fontSize: 12, fontWeight: 600, color: '#a5b4fc',
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Sign in for more →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px 0' }}>

        {/* Use cases */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
            Good for
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {tool.useCases.map((uc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{ color: tool.accent, fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: '20px' }}>{uc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 40 }} />

        {/* The Tool itself */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
            Run Tool
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.015)',
            border: `1px solid ${tool.accent}20`,
            borderRadius: 20, padding: '24px', overflow: 'hidden',
          }}>
            <div style={{ height: 2, background: `linear-gradient(90deg, ${tool.accent}, transparent)`, margin: '-24px -24px 20px' }} />
            <ToolPanel tool={tool} isLoggedIn={isLoggedIn} hideHeader={true} />
          </div>
        </div>

        {/* Related tools */}
        {related.length > 0 && (
          <div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 32 }} />
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              Related Tools
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {related.map(rt => (
                <button
                  key={rt.id}
                  onClick={() => onNavigate(`/tools/${rt.slug}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 16px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${rt.accent}30`; e.currentTarget.style.background = `${rt.accent}06`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                >
                  <span style={{ fontSize: 14 }}>{rt.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{rt.name}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '1px 0 0', lineHeight: '14px' }}>{rt.description.slice(0, 52)}…</p>
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginLeft: 'auto' }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ko-fi */}
        <div style={{ marginTop: 60, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', lineHeight: '20px' }}>
            This tool is free.{' '}
            <a href="https://ko-fi.com/sumalyze" target="_blank" rel="noopener noreferrer" style={{ color: '#ff8fa3', textDecoration: 'none' }}>
              Support Sumalyze on Ko-fi ♥
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
