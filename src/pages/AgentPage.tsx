import { useState, useRef, useCallback, useEffect } from 'react';
import {
  runAgentWorkflow,
  AGENT_STEPS,
  type AgentGoal,
  type AgentResult,
} from '../services/ai';
import { isLimitReached, incrementUsage, getRemainingUses, incrementServerUsage, fetchAndCacheLimits } from '../services/limits';
import { useAuth } from '../hooks/useAuth';
import { saveAgentRun, saveOutput, deleteSavedOutput } from '../services/database';
import { useToast } from '../components/Toast';
import DocumentUpload from '../components/DocumentUpload';
import ExportDropdown from '../components/ExportDropdown';
import { compileAgentReport } from '../lib/exportUtils';
import { useCurrentPlan } from '../hooks/useCurrentPlan';
import { dispatchAppNavigate } from '../utils/navigation';
import { captureEvent } from '../lib/analytics';


/* ─── Types ───────────────────────────────────────────────────── */

interface GoalOption {
  id: AgentGoal;
  label: string;
  description: string;
  icon: string;
}

const GOALS: GoalOption[] = [
  { id: 'summarize',       label: 'Summarize this',         icon: '✦', description: 'Distill the key message and main points' },
  { id: 'find_risks',      label: 'Find risks',             icon: '⚠', description: 'Surface red flags, pressure, and suspicious patterns' },
  { id: 'understand_tone', label: 'Understand tone',        icon: '◎', description: 'Detect emotional signals, subtext, and attitude' },
  { id: 'help_reply',      label: 'Help me reply',          icon: '◷', description: 'Get ready-to-send replies tuned to context' },
  { id: 'explain_simply',  label: 'Explain this simply',    icon: '◈', description: 'Translate jargon and complexity into plain language' },
  { id: 'action_steps',    label: 'Prepare action steps',   icon: '◻', description: 'Extract next moves, tasks, and deadlines' },
  { id: 'full_analysis',   label: 'Full agent analysis',    icon: '✧', description: 'Run all modules: tone, intent, risk, reply, actions' },
];

/* ─── Stepper Component ───────────────────────────────────────── */

function AgentStepper({ steps, currentStep }: { steps: typeof AGENT_STEPS; currentStep: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {steps.map((step, i) => {
        const isDone    = i < currentStep;
        const isRunning = i === currentStep;
        return (
          <div key={step.id} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '10px 14px', borderRadius: 12,
            background: isRunning ? 'rgba(226,62,87,0.07)' : isDone ? 'rgba(52,211,153,0.05)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${isRunning ? 'rgba(226,62,87,0.25)' : isDone ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.05)'}`,
            transition: 'all 0.4s ease',
          }}>
            {/* Step indicator */}
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0, fontSize: 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isRunning ? 'rgba(226,62,87,0.2)' : isDone ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isRunning ? 'rgba(226,62,87,0.4)' : isDone ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: isRunning ? '#ff8fa3' : isDone ? '#34d399' : 'rgba(255,255,255,0.3)',
              animation: isRunning ? 'premiumPulse 1.2s ease-in-out infinite' : 'none',
            }}>
              {isDone ? '✓' : i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: isRunning ? 'white' : isDone ? '#34d399' : 'rgba(255,255,255,0.4)', margin: 0 }}>
                {step.label}
              </p>
              {(isRunning || isDone) && (
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '2px 0 0' }}>{step.description}</p>
              )}
            </div>
            {isRunning && (
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(d => (
                  <div key={d} style={{ width: 4, height: 4, borderRadius: '50%', background: '#E23E57', animation: `premiumPulse 0.8s ${d * 0.2}s ease-in-out infinite` }} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Score Ring ──────────────────────────────────────────────── */

function ScoreRing({ score }: { score: number }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? '#34d399' : score >= 45 ? '#fbbf24' : '#E23E57';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={70} height={70} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={35} cy={35} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={5} fill="none" />
        <circle cx={35} cy={35} r={r} stroke={color} strokeWidth={5} fill="none"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <span style={{ fontSize: 20, fontWeight: 700, color, marginTop: -52 }}>{score}</span>
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Clarity</span>
    </div>
  );
}

/* ─── CopyButton ─────────────────────────────────────────────── */

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  return (
    <button onClick={copy} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: copied ? '#34d399' : 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
      {copied ? '✓ Copied' : '⌘ Copy'}
    </button>
  );
}

function SaveOutputButton({ title, content, type }: { title: string; content: string; type: string }) {
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
        toast.success('Agent output removed from saved items.');
      } else {
        // Save to database
        const { data, error } = await saveOutput(title, content, type);
        if (error) throw error;
        if (data?.id) {
          setSavedId(data.id);
        }
        toast.success('Agent output saved successfully!');
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
    : (isSaved ? (isHovered ? '✕ Unsave' : '✓ Saved') : '💾 Save');

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500,
        border: isSaved
          ? `1px solid ${isHovered ? 'rgba(239,68,68,0.2)' : 'rgba(52,211,153,0.2)'}`
          : '1px solid rgba(255,255,255,0.1)',
        background: isSaved
          ? (isHovered ? 'rgba(239,68,68,0.06)' : 'rgba(52,211,153,0.06)')
          : 'rgba(255,255,255,0.04)',
        color: isSaved
          ? (isHovered ? '#fca5a5' : '#34d399')
          : 'rgba(255,255,255,0.4)',
        cursor: 'pointer',
        transition: 'all 0.2s', fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}

/* ─── Result Card ─────────────────────────────────────────────── */

function ResultCard({ label, accent, icon, children, copyText, saveData }: {
  label: string; accent: string; icon: string; children: React.ReactNode; copyText?: string;
  saveData?: { title: string; content: string; type: string };
}) {
  return (
    <div style={{
      background: `${accent}07`, border: `1px solid ${accent}20`,
      borderRadius: 14, padding: '16px 18px',
      animation: 'fadeUp 0.4s ease both',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: accent }}>{icon}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {saveData && <SaveOutputButton title={saveData.title} content={saveData.content} type={saveData.type} />}
          {copyText && <CopyBtn text={copyText} />}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─── Agent Results Display ───────────────────────────────────── */

function AgentResultsPanel({ result }: { result: AgentResult }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
          <span style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>Agent Analysis Complete</span>
          {result._mock && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: 'rgba(107,114,128,0.15)', color: '#9ca3af', border: '1px solid rgba(107,114,128,0.2)' }}>
              Preview Mode
            </span>
          )}
        </div>
        <ExportDropdown content={compileAgentReport(result)} toolName={`Agent_${result.goal}`} />
      </div>

      {/* Summary + Score row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, alignItems: 'start' }} className="summary-score-row">
        <ResultCard label="Summary" accent="#E23E57" icon="✦" copyText={result.summary} saveData={{ title: 'Agent Summary', content: result.summary, type: 'summary' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: '20px', margin: 0 }}>{result.summary}</p>
        </ResultCard>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px', minWidth: 90 }}>
          <ScoreRing score={result.clarityScore} />
        </div>
      </div>

      {/* Tone + Intent */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        <ResultCard label="Tone" accent="#f472b6" icon="◎">
          <p style={{ fontSize: 13, fontWeight: 500, color: 'white', margin: '0 0 10px' }}>{result.tone.overall}</p>
          {result.tone.emotions.slice(0, 3).map(em => (
            <div key={em.name} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{em.name}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{em.value}%</span>
              </div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                <div style={{ height: '100%', background: em.color, width: `${em.value}%`, borderRadius: 99, transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </ResultCard>

        <ResultCard label="Intent" accent="#818cf8" icon="◈" copyText={result.intent}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: '20px', margin: 0 }}>{result.intent}</p>
        </ResultCard>
      </div>

      {/* Key Signals + Risk Flags */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        <ResultCard label="Key Signals" accent="#22d3ee" icon="◻">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {result.keySignals.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: '#22d3ee', flexShrink: 0, fontSize: 10, marginTop: 3 }}>▸</span>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: '18px' }}>{s}</p>
              </div>
            ))}
          </div>
        </ResultCard>

        <ResultCard label="Risk Flags" accent="#fbbf24" icon="⚠">
          {result.riskFlags.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {result.riskFlags.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: '#fbbf24', flexShrink: 0, fontSize: 10, marginTop: 3 }}>▲</span>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: '18px' }}>{r}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 12, color: '#34d399', margin: 0 }}>✓ No significant risk flags detected</p>
          )}
        </ResultCard>
      </div>

      {/* Action Steps */}
      <ResultCard label="Suggested Action Steps" accent="#34d399" icon="◷" copyText={result.actionSteps.join('\n')} saveData={{ title: 'Agent Action Steps', content: result.actionSteps.join('\n'), type: 'action_steps' }}>
        <ol style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {result.actionSteps.map((step, i) => (
            <li key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: '20px' }}>{step}</li>
          ))}
        </ol>
      </ResultCard>

      {/* Reply Draft */}
      <ResultCard label="Reply Draft" accent="#a78bfa" icon="✉" copyText={result.replyDraft} saveData={{ title: 'Agent Reply Draft', content: result.replyDraft, type: 'reply_draft' }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: '20px', fontStyle: 'italic', margin: 0 }}>
          "{result.replyDraft}"
        </p>
      </ResultCard>

      {/* What to check */}
      <ResultCard label="What to Check Before Replying" accent="#fb923c" icon="✎">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {result.whatToCheckBeforeReplying.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: '#fb923c', flexShrink: 0, fontSize: 13 }}>→</span>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: '18px' }}>{item}</p>
            </div>
          ))}
        </div>
      </ResultCard>
    </div>
  );
}

/* ─── Agent Page ──────────────────────────────────────────────── */

export default function AgentPage({ onSignIn }: { onSignIn: () => void }) {
  const { user } = useAuth();
  const { plan } = useCurrentPlan();
  const isLoggedIn = !!user;
  const limited = isLimitReached('agent', isLoggedIn, plan);
  const remaining = getRemainingUses('agent', isLoggedIn, plan);

  // TODO: Monthly agent limit counter enforcement
  // Starter: 3 agent runs/month, Pro: 50 runs/month, Max: 150 runs/month.
  // Not enforced yet because monthly usage table resets are not active on backend.

  useEffect(() => {
    if (plan === 'free') {
      captureEvent('upgrade_prompt_viewed', {
        feature: 'agent',
        required_plan: 'starter',
        current_plan: 'free',
      });
    }
  }, [plan]);

  const handleUpgradeClick = () => {
    captureEvent('feature_locked_clicked', {
      feature: 'agent',
      required_plan: 'starter',
      current_plan: 'free',
    });
    dispatchAppNavigate('pricing');
  };

  const [text, setText] = useState('');
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [selectedGoal, setSelectedGoal] = useState<AgentGoal>('full_analysis');
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAndCacheLimits();
    }
  }, [isLoggedIn]);

  const abortRef = useRef<AbortController | null>(null);

  if (plan === 'free') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a000f', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 120 }}>
        {/* Hero Background */}
        <div style={{ padding: '100px 20px 40px', background: 'radial-gradient(40% 60% at 50% 0%, rgba(226,62,87,0.08) 0%, transparent 100%)', borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 32, background: 'rgba(226,62,87,0.07)', border: '1px solid rgba(226,62,87,0.2)', marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E23E57', display: 'inline-block', animation: 'premiumPulse 1.5s infinite' }} />
            <span style={{ fontSize: 13, fontWeight: 500, background: 'linear-gradient(90deg, #ff8fa3, #E23E57)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Agent Mode — Multi-step AI Analysis
            </span>
          </div>
        </div>

        <div style={{ maxWidth: 550, margin: '80px auto 0', padding: '48px 36px', textAlign: 'center', background: 'rgba(14,4,22,0.97)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, boxShadow: '0 32px 64px rgba(0,0,0,0.6)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(226,62,87,0.5), transparent)', borderRadius: '24px 24px 0 0' }} />
          <div style={{ fontSize: 40, marginBottom: 20 }}>🔒</div>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: 'white', marginBottom: 12 }}>Agent Mode is locked</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: '22px', margin: '0 0 6px' }}>
            This is available on Starter/Pro/Max.
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 28px' }}>
            Upgrade when you need heavier usage.
          </p>
          <button onClick={handleUpgradeClick} style={{
            padding: '12px 32px', borderRadius: 12, fontSize: 14, fontWeight: 600, border: 'none',
            background: 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)',
            color: 'white', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(226,62,87,0.3)', transition: 'all 0.2s',
            fontFamily: 'inherit',
          }}>
            View pricing
          </button>
        </div>
      </div>
    );
  }

  const SAMPLE_TEXTS = [
    { label: 'Tricky email', text: 'I wanted to follow up on the proposal I sent two weeks ago. I understand you\'re probably very busy, but our timeline is getting quite tight. I\'d hate for this opportunity to pass us both by. Could we maybe jump on a quick call this week?' },
    { label: 'Urgent escalation', text: 'THIS IS CRITICAL. We have users reporting login failures since the last deployment. The CEO is asking for a status update every 30 minutes. I need a complete incident report by 4pm today without fail.' },
    { label: 'Scam attempt', text: 'Congratulations! You have been selected to receive a $5,000 government small business grant. To claim your funds, please send your bank details and a $150 processing fee within 24 hours. This is a limited offer.' },
  ];

  const runAgent = useCallback(async () => {
    if (!text.trim() || text.trim().length < 10 || running || limited) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setRunning(true);
    setResult(null);
    setError(null);
    setCurrentStep(0);

    try {
      const res = await runAgentWorkflow(
        text,
        selectedGoal,
        (stepIdx) => setCurrentStep(stepIdx + 1),
        abortRef.current.signal,
      );
      setResult(res);

      if (isLoggedIn) {
        await incrementServerUsage('increment_agent');
        // Log workflow steps completed (compliance: no thought process references)
        const logSteps = AGENT_STEPS.map(s => ({ label: s.label, status: 'done' }));
        await saveAgentRun(selectedGoal, logSteps, res.summary, 'completed');
      } else {
        incrementUsage('agent', false);
      }
    } catch (e) {
      if (e instanceof Error && e.message !== 'Agent run cancelled') {
        setError(e.message || 'Agent run failed. Please try again.');
      }
    } finally {
      setRunning(false);
      setCurrentStep(-1);
    }
  }, [text, selectedGoal, running, limited]);

  const reset = () => {
    abortRef.current?.abort();
    setRunning(false);
    setResult(null);
    setError(null);
    setCurrentStep(-1);
  };

  const canRun = text.trim().length >= 10 && !running && !limited;

  return (
    <div style={{ minHeight: '100vh', background: '#0a000f', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 120 }}>
      {/* Hero */}
      <div style={{ padding: '100px 20px 60px', background: 'radial-gradient(40% 60% at 50% 0%, rgba(226,62,87,0.08) 0%, transparent 100%)', borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 32, background: 'rgba(226,62,87,0.07)', border: '1px solid rgba(226,62,87,0.2)', marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E23E57', display: 'inline-block', animation: 'premiumPulse 1.5s infinite' }} />
          <span style={{ fontSize: 13, fontWeight: 500, background: 'linear-gradient(90deg, #ff8fa3, #E23E57)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Agent Mode — Multi-step AI Analysis
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(34px, 5vw, 54px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 16px' }}>
          <span style={{ background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Not just analysis.</span>
          {' '}
          <span style={{ background: 'linear-gradient(180deg, #ff8fa3 0%, #E23E57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>An AI workflow.</span>
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(239,237,253,0.6)', maxWidth: 520, margin: '0 auto', lineHeight: '26px' }}>
          Paste text, pick a goal, and watch the Agent run 6 analysis steps — then get structured insights, risks, actions, and a reply draft.
        </p>
        {!isLoggedIn && (
          <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
            {remaining} free agent {remaining === 1 ? 'run' : 'runs'} remaining today ·{' '}
            <button onClick={onSignIn} style={{ background: 'none', border: 'none', color: '#ff8fa3', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', textDecoration: 'underline' }}>
              Sign in for more
            </button>
          </p>
        )}
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }} className="agent-layout">
          <style>{`@media(max-width:780px){.agent-layout{grid-template-columns:1fr!important}}`}</style>

          {/* LEFT: Input Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Sample presets */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Quick Load</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {SAMPLE_TEXTS.map(s => (
                  <button key={s.label} onClick={() => { setText(s.text); setResult(null); setError(null); }} style={{
                    textAlign: 'left', padding: '10px 14px', borderRadius: 10, fontSize: 12, fontWeight: 500,
                    background: text === s.text ? 'rgba(226,62,87,0.08)' : 'rgba(255,255,255,0.02)',
                    border: text === s.text ? '1px solid rgba(226,62,87,0.25)' : '1px solid rgba(255,255,255,0.06)',
                    color: text === s.text ? '#ff8fa3' : 'rgba(255,255,255,0.55)', cursor: 'pointer',
                    transition: 'all 0.2s', fontFamily: 'inherit',
                  }}>
                    📄 {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text input */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Your Text</p>
              
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
                      background: inputType === type ? 'rgba(226,62,87,0.1)' : 'transparent',
                      border: inputType === type ? '1px solid rgba(226,62,87,0.25)' : '1px solid transparent',
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
                    placeholder="Paste any email, message, document, or text you want the Agent to analyze..."
                    style={{
                      width: '100%', height: 200, background: 'rgba(10,0,15,0.6)',
                      border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14,
                      padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.85)',
                      resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                      lineHeight: '20px', boxSizing: 'border-box', transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(226,62,87,0.35)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
                  />
                </div>
              ) : (
                <DocumentUpload
                  accentColor="#E23E57"
                  onTextExtracted={(extractedText) => {
                    setText(extractedText);
                    setError(null);
                  }}
                  onError={(err) => setError(err)}
                />
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{text.length.toLocaleString()} characters</span>
                {text.length > 0 && text.length < 10 && <span style={{ fontSize: 11, color: '#fca5a5' }}>min 10 characters</span>}
              </div>
            </div>

            {/* Goal selector */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Select Goal</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }} className="agent-goals-grid">
                {GOALS.map(goal => (
                  <button key={goal.id} onClick={() => setSelectedGoal(goal.id)} style={{
                    textAlign: 'left', padding: '10px 12px', borderRadius: 10,
                    background: selectedGoal === goal.id ? 'rgba(226,62,87,0.1)' : 'rgba(255,255,255,0.02)',
                    border: selectedGoal === goal.id ? '1px solid rgba(226,62,87,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    color: selectedGoal === goal.id ? 'white' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                    gridColumn: goal.id === 'full_analysis' ? 'span 2' : 'span 1',
                  }}>
                    <span style={{ fontSize: 13, marginRight: 6 }}>{goal.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{goal.label}</span>
                    {selectedGoal === goal.id && (
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '4px 0 0' }}>{goal.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#fca5a5' }}>
                ⚠ {error}
              </div>
            )}

            {/* Limit warning */}
            {limited && (
              <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)', fontSize: 13, color: '#a5b4fc' }}>
                Daily agent limit reached (3 runs/day for guests).{' '}
                <button onClick={onSignIn} style={{ background: 'none', border: 'none', color: '#ff8fa3', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', textDecoration: 'underline' }}>
                  Sign in for more
                </button>
              </div>
            )}

            {/* CTA */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={runAgent} disabled={!canRun}
                style={{
                  flex: 1, padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 500, border: 'none',
                  cursor: canRun ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                  background: canRun ? 'linear-gradient(135deg, #E23E57 0%, #88304E 100%)' : 'rgba(255,255,255,0.05)',
                  color: canRun ? 'white' : 'rgba(255,255,255,0.2)',
                  boxShadow: canRun ? '0 4px 24px rgba(226,62,87,0.35)' : 'none',
                  transition: 'all 0.25s',
                }}>
                {running ? '⏳ Agent Running...' : '✧ Run Agent'}
              </button>
              {(running || result) && (
                <button onClick={reset} style={{ padding: '14px 16px', borderRadius: 12, fontSize: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Stepper or Results */}
          <div>
            {!running && !result && !error && (
              <div style={{ padding: '48px 32px', textAlign: 'center', background: 'rgba(255,255,255,0.012)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20 }}>
                <p style={{ fontSize: 40, marginBottom: 16 }}>✧</p>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: '24px', maxWidth: 280, margin: '0 auto' }}>
                  Paste your text, pick a goal, and run the Agent to see multi-step analysis.
                </p>
              </div>
            )}

            {running && (
              <div style={{ background: 'rgba(255,255,255,0.012)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '28px' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
                  Agent Progress
                </p>
                <AgentStepper steps={AGENT_STEPS} currentStep={currentStep} />
              </div>
            )}

            {result && !running && <AgentResultsPanel result={result} />}
          </div>
        </div>

        {/* Ko-fi */}
        <div style={{ maxWidth: 600, margin: '64px auto 0', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', lineHeight: '22px' }}>
            Agent Mode is MVP free.{' '}
            <a href="https://ko-fi.com/sumalyze" target="_blank" rel="noopener noreferrer" style={{ color: '#ff8fa3', textDecoration: 'none' }}>
              Support Sumalyze on Ko-fi ♥
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
