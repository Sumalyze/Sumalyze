/**
 * Sumalyze — AI Service Abstraction Layer
 * ─────────────────────────────────────────────────────────────
 * All AI calls go through this module.
 * - In production: calls the Netlify serverless function at /api/ai-analyze.
 * - /api/ai-analyze uses Gemini (primary) → OpenRouter (fallback) → mock.
 * - Mock functions below are kept as the final safety fallback layer.
 * - Never expose GEMINI_API_KEY, OPENROUTER_API_KEY, or
 *   SUPABASE_SERVICE_ROLE_KEY to the browser; all are server-side only.
 */

import { analyzeText } from '../utils/mockAnalyzer';
import type { AnalysisResult } from '../utils/mockAnalyzer';
import { supabase } from '../lib/supabase';


// ─── Types ─────────────────────────────────────────────────────

export type AgentGoal =
  | 'summarize'
  | 'find_risks'
  | 'understand_tone'
  | 'help_reply'
  | 'explain_simply'
  | 'action_steps'
  | 'full_analysis';

export interface AgentStep {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'running' | 'done';
}

export interface AgentResult {
  summary: string;
  tone: {
    overall: string;
    emotions: { name: string; value: number; color: string }[];
  };
  intent: string;
  keySignals: string[];
  riskFlags: string[];
  actionSteps: string[];
  replyDraft: string;
  clarityScore: number;
  whatToCheckBeforeReplying: string[];
  goal: AgentGoal;
  _mock?: boolean;
}

export interface ToolResult {
  output: string;
  confidence?: number;
  tags?: string[];
  _mock?: boolean;
}

// ─── Agent Steps Config ─────────────────────────────────────────

export const AGENT_STEPS: AgentStep[] = [
  { id: 'read',    label: 'Reading text',         description: 'Parsing structure and vocabulary', status: 'pending' },
  { id: 'extract', label: 'Extracting key points', description: 'Identifying core ideas and data', status: 'pending' },
  { id: 'tone',    label: 'Detecting tone',        description: 'Mapping emotional signals and subtext', status: 'pending' },
  { id: 'risk',    label: 'Checking risks',        description: 'Scanning for red flags and pressure patterns', status: 'pending' },
  { id: 'actions', label: 'Preparing next actions',description: 'Building a prioritized action plan', status: 'pending' },
  { id: 'draft',   label: 'Drafting response',     description: 'Generating contextual reply options', status: 'pending' },
];

// ─── Public API ─────────────────────────────────────────────────

/**
 * Run full text analysis (used by existing DemoPanel).
 * This is already wired to /api/analyze in DemoPanel — kept here for reference.
 */
export function runFullAnalysis(text: string): AnalysisResult {
  return analyzeText(text);
}

/**
 * Run an agent workflow with animated step simulation.
 * POSTs to /api/ai-analyze (mode: 'agent') via the Netlify serverless function.
 * Steps are simulated in parallel with the real API call for premium UX.
 *
 * @param text    - The input text to analyze
 * @param goal    - The selected agent goal
 * @param onStep  - Callback fired as each step completes (for animated UI)
 * @param signal  - AbortController signal for timeout
 */
export async function runAgentWorkflow(
  text: string,
  goal: AgentGoal,
  onStep: (stepIndex: number) => void,
  signal?: AbortSignal
): Promise<AgentResult> {
  // Get active session if any to bypass client rate limiting
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  // Start the serverless API analysis in the background
  const apiPromise = fetch('/api/ai-analyze', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      mode: 'agent',
      goal,
      inputText: text,
    }),
    signal,
  });

  const STEP_DELAY_MS = 700;

  // Run stepper simulation in parallel for the premium visual progression
  for (let i = 0; i < AGENT_STEPS.length; i++) {
    if (signal?.aborted) throw new Error('Agent run cancelled');
    await new Promise(r => setTimeout(r, STEP_DELAY_MS));
    onStep(i);
  }

  // Await serverless AI completion
  const res = await apiPromise;
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Agent analysis failed.');
  }

  const data = await res.json();

  // Normalize serverless JSON response structure for the UI
  const emotionsMapped = data.toneAnalysis?.emotions || [
    { name: 'neutral', value: 100, color: '#6B7280' },
  ];

  return {
    summary: data.summary,
    tone: {
      overall: data.toneAnalysis?.overall || String(data.toneAnalysis || 'Neutral'),
      emotions: emotionsMapped,
    },
    intent: data.intent,
    keySignals: data.keySignals || [],
    riskFlags: data.riskFlags || [],
    actionSteps: data.suggestedNextActions || [],
    replyDraft: data.replyDraft,
    clarityScore: typeof data.clarityScore === 'number' ? data.clarityScore : 75,
    whatToCheckBeforeReplying: data.whatToCheckBeforeReplying || [],
    goal: goal,
    _mock: !!data._mock,
  };
}

/**
 * Run a single tool analysis.
 *
 * @param toolId - The tool identifier (e.g. 'summarizer', 'tone')
 * @param text   - The input text
 * @param signal - AbortController signal
 */
export async function runSingleTool(
  toolId: string,
  text: string,
  signal?: AbortSignal
): Promise<ToolResult> {
  // Get active session if any to bypass client rate limiting
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const res = await fetch('/api/ai-analyze', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      mode: 'tool',
      toolId,
      inputText: text,
    }),
    signal,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Tool analysis failed.');
  }

  const data = await res.json();

  // Format rich tool JSON response into structured pre-line text output
  const keyPointsStr = data.keyPoints && data.keyPoints.length > 0
    ? `\n\n**Key Points:**\n` + data.keyPoints.map((p: string) => `• ${p}`).join('\n')
    : '';

  const signalsStr = data.signals && data.signals.length > 0
    ? `\n\n**Signals:** ${data.signals.join(', ')}`
    : '';

  const risksStr = data.risks && data.risks.length > 0
    ? `\n\n**Risks:** ${data.risks.join(', ')}`
    : '';

  const replyStr = data.suggestedReply 
    ? `\n\n**Suggested Reply:**\n${data.suggestedReply}`
    : '';

  const outputString = `### ${data.title || 'Analysis Result'}\n\n**Summary:** ${data.summary}${keyPointsStr}\n\n**Tone:** ${data.tone}\n\n**Intent:** ${data.intent}${signalsStr}${risksStr}${replyStr}`;

  return {
    output: outputString,
    confidence: data._mock ? 78 : 95,
    tags: data.signals || ['analysis'],
    _mock: !!data._mock,
  };
}
