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
  let apiPromise: Promise<Response | null> | null = null;
  let fetchError: any = null;
  try {
    apiPromise = fetch('/api/ai-analyze', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        mode: 'agent',
        goal,
        inputText: text,
      }),
      signal,
    }).catch(err => {
      fetchError = err;
      return null;
    });
  } catch (err: any) {
    fetchError = err;
  }

  const STEP_DELAY_MS = 700;

  // Run stepper simulation in parallel for the premium visual progression
  for (let i = 0; i < AGENT_STEPS.length; i++) {
    if (signal?.aborted) throw new Error('Agent run cancelled');
    await new Promise(r => setTimeout(r, STEP_DELAY_MS));
    onStep(i);
  }

  let data: any;
  let isFallback = false;

  if (fetchError) {
    if (fetchError.name === 'AbortError' || fetchError.message === 'Agent run cancelled') {
      throw fetchError;
    }
    console.warn(`[ai-analyze] Failed to initiate API request: ${fetchError.message || fetchError}. Falling back to client-side mock analysis.`);
    data = getMockAgentResult(goal);
    isFallback = true;
  } else if (apiPromise) {
    try {
      const res = await apiPromise;
      if (!res) {
        if (fetchError && (fetchError.name === 'AbortError' || fetchError.message === 'Agent run cancelled')) {
          throw fetchError;
        }
        console.warn(`[ai-analyze] Network error during agent analysis: ${fetchError?.message || fetchError}. Falling back to client-side mock analysis.`);
        data = getMockAgentResult(goal);
        isFallback = true;
      } else if (!res.ok) {
        if (res.status === 404 || res.status === 502 || res.status === 503) {
          console.warn(`[ai-analyze] Agent API returned status ${res.status}. Falling back to client-side mock analysis.`);
          data = getMockAgentResult(goal);
          isFallback = true;
        } else {
          const errorBody = await res.json().catch(() => ({}));
          throw new Error(errorBody.error || 'Agent analysis failed.');
        }
      } else {
        data = await res.json();
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message === 'Agent run cancelled') {
        throw err;
      }
      if (err.message && (err.message.includes('analysis failed') || err.message.includes('Analysis failed'))) {
        throw err;
      }
      console.warn(`[ai-analyze] Error during agent analysis: ${err.message || err}. Falling back to client-side mock analysis.`);
      data = getMockAgentResult(goal);
      isFallback = true;
    }
  } else {
    data = getMockAgentResult(goal);
    isFallback = true;
  }

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
    _mock: isFallback ? true : !!data._mock,
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

  let data: any;
  let isFallback = false;

  try {
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
      if (res.status === 404 || res.status === 502 || res.status === 503) {
        console.warn(`[ai-analyze] Tool API returned status ${res.status}. Falling back to client-side mock analysis.`);
        data = getMockToolResult(toolId, text);
        isFallback = true;
      } else {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Tool analysis failed.');
      }
    } else {
      data = await res.json();
    }
  } catch (err: any) {
    if (err.name === 'AbortError' || err.message === 'Tool run cancelled') {
      throw err;
    }
    if (err.message && (err.message.includes('analysis failed') || err.message.includes('Analysis failed'))) {
      throw err;
    }
    console.warn(`[ai-analyze] Network error during tool analysis: ${err.message || err}. Falling back to client-side mock analysis.`);
    data = getMockToolResult(toolId, text);
    isFallback = true;
  }

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
    confidence: isFallback || data._mock ? 78 : 95,
    tags: data.signals || ['analysis'],
    _mock: isFallback ? true : !!data._mock,
  };
}

// ─── Local Mock Fallback Helpers ─────────────────────────────────────────

function getMockToolResult(toolId: string, text: string) {
  const results: Record<string, string> = {
    summarizer:     'This text discusses a time-sensitive situation where the sender is requesting action and establishing accountability. The core message is: respond quickly with a concrete plan.',
    tone:           'Tone: Moderately concerned with professional firmness. Emotional intensity: 6/10. Urgency signals: medium. Politeness level: 7/10.',
    intent:         'Primary intent: request an update or response. Secondary intent: establish that the ball is in your court. Confidence: 84%.',
    signals:        'Risk level: LOW-MEDIUM. Signals detected: urgency framing, implicit deadline, accountability language. No manipulation or scam patterns detected.',
    reply:          'Professional: "Thank you for your message. I\'m reviewing this and will have a full update by [date]."\nFriendly: "Hey! On it — I\'ll get back to you by [day]. Thanks for the nudge!"\nConcise: "Received. Will follow up by [date]."',
    bullet_brief:   '• Core topic: [topic identified]\n• Key request: response / action expected\n• Urgency: medium\n• Tone: professional concern\n• Action needed: reply with timeline + acknowledgment',
    email_simplify: 'In plain terms: They want to know what\'s happening and when. They\'re concerned but still professional. Reply with a clear date and a short status update.',
    doc_brief:      'Document type: correspondence / message. Length: short-medium. Key sections: context, request, implicit deadline. Recommended action: respond within 24h with a concrete status.',
    contract_lite:  'No legal text detected. For contract analysis, paste the specific clause or section you need explained.',
    meeting_notes:  'Meeting notes summary: [paste meeting notes to analyze]. Key decisions: TBD. Action items: TBD. Follow-ups: TBD.',
    post_rewriter:  'LinkedIn version: "Excited to share an update on [topic]. Here\'s what we\'re working on and what comes next..."\nCaption version: "Big things happening 👀 More soon."\nThread version: "1/ Here\'s what\'s happening with [topic]..."',
  };

  const outputText = results[toolId] || `Analysis complete for tool: ${toolId}.`;
  return {
    title: toolId.charAt(0).toUpperCase() + toolId.slice(1) + ' Analysis',
    summary: 'Mock analysis generated due to offline APIs.',
    keyPoints: ['No active AI keys configured or servers timed out', 'Showing safety fallback preview'],
    tone: 'Neutral',
    intent: 'Fallback preview mode',
    signals: ['Mock preview'],
    risks: [],
    suggestedReply: outputText,
    _mock: true
  };
}

function getMockAgentResult(goal: string) {
  return {
    summary: 'The message contains a mix of urgency and underlying concern. Key topics include project status, timeline expectations, and implicit pressure to deliver faster. (Mock Fallback Result)',
    toneAnalysis: {
      overall: 'Concerned',
      emotions: [
        { name: 'concerned',   value: 55, color: '#F59E0B' },
        { name: 'neutral',     value: 25, color: '#6B7280' },
        { name: 'frustrated',  value: 15, color: '#EF4444' },
        { name: 'hopeful',     value: 5,  color: '#3B82F6' },
      ],
    },
    intent: 'Request for status update and implicit pressure to accelerate delivery.',
    keySignals: [
      'Time pressure implied (deadline language)',
      'Accountability framing ("we need to..." pattern)'
    ],
    riskFlags: ['Urgency may be artificially inflated'],
    importantDetails: ['Request for status report', 'Incidental timeline pressure'],
    suggestedNextActions: [
      'Acknowledge receipt and validate their concern',
      'Provide a specific, realistic timeline',
    ],
    replyDraft: 'Thank you for reaching out. I understand the urgency and want to make sure we\'re aligned. I\'m currently reviewing the status and will have a concrete update with timelines by [date].',
    clarityScore: 71,
    whatToCheckBeforeReplying: [
      'Do you have a concrete date to offer? Don\'t reply without one.',
      'Is this the right tone for your relationship?'
    ],
    _mock: true
  };
}
