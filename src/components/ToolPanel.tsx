// src/components/ToolPanel.tsx
// Shared reusable panel for running a single Sumalyze AI tool.
// Used by both ToolsPage (grid) and ToolDetailPage (full-page).

import { useState, useRef, useCallback, useEffect } from 'react';
import type { ToolDef } from '../data/tools';
import { runSingleTool, type ToolResult } from '../services/ai';
import { isLimitReached, incrementUsage, getRemainingUses, incrementServerUsage } from '../services/limits';
import { useAuth } from '../hooks/useAuth';
import { saveAnalysisHistory, saveOutput, deleteSavedOutput } from '../services/database';
import { useToast } from './Toast';
import DocumentUpload from './DocumentUpload';
import { captureEvent, getInputLengthBucket, getFileSizeBucket, getDurationBucket } from '../lib/analytics';
import ExportDropdown from './ExportDropdown';
import { useCurrentPlan } from '../hooks/useCurrentPlan';

/* ─── Micro-components ──────────────────────────────────── */

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

export function CopyButton({ text, toolName }: { text: string; toolName?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      captureEvent('export_clicked', {
        format: 'clipboard',
        tool_name: toolName || 'unknown',
        plan: 'free',
      });
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

export function SaveOutputButton({ title, content, type, toolName }: { title: string; content: string; type: string; toolName?: string }) {
  const { user } = useAuth();
  const toast = useToast();
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (savedId) {
        // Unsave/delete from database
        const { error } = await deleteSavedOutput(savedId);
        if (error) throw error;
        setSavedId(null);
        toast.success('Clarity report removed from saved items.');
      } else {
        // Save to database
        const { data, error } = await saveOutput(title, content, type);
        if (error) throw error;
        if (data?.id) {
          setSavedId(data.id);
        }
        captureEvent('export_clicked', {
          format: 'database',
          tool_name: toolName || title,
          plan: 'free',
        });
        toast.success('Clarity report saved successfully!');
      }
    } catch (err: any) {
      toast.error(`Operation failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const isSaved = !!savedId;
  const label = saving
    ? (isSaved ? '⏳ Removing...' : '⏳ Saving...')
    : (isSaved ? (isHovered ? '✕ Unsave' : '✓ Saved') : '💾 Save Output');

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 500,
        border: isSaved
          ? `1px solid ${isHovered ? 'rgba(239,68,68,0.2)' : 'rgba(52,211,153,0.2)'}`
          : '1px solid rgba(255,255,255,0.1)',
        background: isSaved
          ? (isHovered ? 'rgba(239,68,68,0.06)' : 'rgba(52,211,153,0.06)')
          : 'rgba(255,255,255,0.04)',
        color: isSaved
          ? (isHovered ? '#fca5a5' : '#34d399')
          : 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        transition: 'all 0.2s', fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}

/* ─── Main ToolPanel ────────────────────────────────────── */

interface ToolPanelProps {
  tool: ToolDef;
  isLoggedIn: boolean;
  /** If true, hides the header (used in ToolDetailPage where we have a page-level header) */
  hideHeader?: boolean;
  /** Called after a successful run */
  onResult?: (result: ToolResult) => void;
}

export default function ToolPanel({ tool, isLoggedIn, hideHeader = false, onResult }: ToolPanelProps) {
  const [text, setText] = useState('');
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ToolResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileMeta, setUploadedFileMeta] = useState<{ type: string; size: number } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { plan } = useCurrentPlan();
  const limited = isLimitReached('tools', isLoggedIn, plan);
  const remaining = getRemainingUses('tools', isLoggedIn, plan);
  const canRun = text.trim().length >= 10 && !loading && !limited;

  useEffect(() => {
    captureEvent('tool_opened', {
      tool_name: tool.name,
      source_page: window.location.pathname === '/tools' ? 'Tools Directory' : 'Direct Link',
    });
  }, [tool.id, tool.name]);

  const run = useCallback(async () => {
    if (!canRun) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setResult(null);
    setError(null);

    const startTime = performance.now();
    captureEvent('analysis_started', {
      tool_name: tool.name,
      input_length_bucket: getInputLengthBucket(text.length),
      file_type: inputType === 'file' ? uploadedFileMeta?.type : undefined,
      file_size_bucket: inputType === 'file' && uploadedFileMeta?.size !== undefined ? getFileSizeBucket(uploadedFileMeta.size) : undefined,
      is_guest: !isLoggedIn,
      plan: plan,
    });

    try {
      const res = await runSingleTool(tool.id, text, abortRef.current.signal);
      setResult(res);
      onResult?.(res);

      const durationMs = performance.now() - startTime;
      captureEvent('analysis_completed', {
        tool_name: tool.name,
        duration_bucket: getDurationBucket(durationMs),
        success: true,
      });

      if (isLoggedIn) {
        await incrementServerUsage('increment_tool');
        await saveAnalysisHistory(text, tool.id, res);
      } else {
        incrementUsage('tools', false);
      }
    } catch (e) {
      const durationMs = performance.now() - startTime;
      if (e instanceof Error && e.message !== 'Tool run cancelled') {
        setError(e.message || 'Analysis failed. Please try again.');
        captureEvent('analysis_failed', {
          tool_name: tool.name,
          error_type: e.message || 'unknown_error',
          duration_bucket: getDurationBucket(durationMs),
          success: false,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [canRun, text, tool.id, tool.name, isLoggedIn, onResult, inputType, uploadedFileMeta]);

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
    <div
      id={hideHeader ? undefined : `tool-${tool.id}`}
      style={{
        background: hideHeader ? 'transparent' : 'rgba(255,255,255,0.013)',
        border: hideHeader ? 'none' : '1px solid rgba(255,255,255,0.07)',
        borderRadius: hideHeader ? 0 : 20,
        overflow: 'hidden',
        transition: 'border-color 0.3s ease',
      }}
      onMouseEnter={!hideHeader ? e => (e.currentTarget as HTMLElement).style.borderColor = `${tool.accent}30` : undefined}
      onMouseLeave={!hideHeader ? e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)' : undefined}
    >
      {/* Top accent line (only in card mode) */}
      {!hideHeader && (
        <div style={{ height: 2, background: `linear-gradient(90deg, ${tool.accent}, transparent)` }} />
      )}

      {/* Card-mode header */}
      {!hideHeader && (
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
      )}

      {/* Input */}
      <div style={{ padding: hideHeader ? '0' : '16px 24px' }}>
        {/* Load example (in hideHeader mode — shown as top row) */}
        {hideHeader && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <button onClick={loadPreset} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
              border: `1px solid ${tool.accent}30`, background: `${tool.accent}0a`,
              color: tool.accent, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
              Try Example
            </button>
          </div>
        )}

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
                width: '100%', height: 140, background: 'rgba(10,0,15,0.5)',
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
            onTextExtracted={(extractedText, fileName, file) => {
              setText(extractedText);
              setError(null);
              if (file) {
                const ext = fileName?.split('.').pop()?.toLowerCase() || 'unknown';
                setUploadedFileMeta({ type: ext, size: file.size });
              } else {
                setUploadedFileMeta(null);
              }
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
        <div style={{
          margin: hideHeader ? '16px 0 0' : '0 24px 24px',
          padding: '16px', borderRadius: 12,
          background: `${tool.accent}08`, border: `1px solid ${tool.accent}20`,
          animation: 'fadeUp 0.35s ease both',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: tool.accent, boxShadow: `0 0 6px ${tool.accent}` }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: tool.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {tool.outputLabel}
              </span>
              {result._mock && <Badge color="#6B7280">Preview</Badge>}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <SaveOutputButton title={tool.name} content={result.output} type={tool.id} toolName={tool.name} />
              <ExportDropdown content={result.output} toolName={tool.name} />
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: '20px', whiteSpace: 'pre-line', margin: 0 }}>
            {result.output}
          </p>
        </div>
      )}

      {/* Loading shimmer */}
      {loading && (
        <div style={{ margin: hideHeader ? '16px 0 0' : '0 24px 24px' }}>
          {[80, 60, 90].map((w, i) => (
            <div key={i} style={{ height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.04)', marginBottom: 8, width: `${w}%`, animation: 'premiumPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      )}
    </div>
  );
}
