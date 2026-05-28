/**
 * Sumalyze — AI Service Abstraction Layer
 * ─────────────────────────────────────────────────────────────
 * All AI calls go through this module.
 * - In local dev without an API route: falls back to mock.
 * - In production with OPENAI_API_KEY set on the server: uses real AI.
 * - Never expose OPENAI_API_KEY or SUPABASE_SERVICE_ROLE_KEY to the browser.
 *
 * TODO: When connecting a real backend, replace the mock functions below
 *       with calls to your Netlify Function at /api/analyze or a new
 *       /api/agent endpoint. The response shapes must match these types.
 */

import { analyzeText } from '../utils/mockAnalyzer';
import type { AnalysisResult } from '../utils/mockAnalyzer';

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

// ─── Mock Agent Results ─────────────────────────────────────────

function buildMockAgentResult(text: string, goal: AgentGoal): AgentResult {
  const wordCount = text.trim().split(/\s+/).length;
  const isLong = wordCount > 50;

  return {
    summary: isLong
      ? 'The message contains a mix of urgency and underlying concern. Key topics include project status, timeline expectations, and implicit pressure to deliver faster. The sender wants a concrete response with dates and acknowledgment of the issue.'
      : 'Short message detected. Core request identified: response or action expected soon.',
    tone: {
      overall: 'Concerned',
      emotions: [
        { name: 'concerned',   value: 55, color: '#F59E0B' },
        { name: 'neutral',     value: 25, color: '#6B7280' },
        { name: 'frustrated',  value: 15, color: '#EF4444' },
        { name: 'hopeful',     value: 5,  color: '#3B82F6' },
      ],
    },
    intent: 'Request for status update and implicit pressure to accelerate delivery. Secondary intent: establish accountability.',
    keySignals: [
      'Time pressure implied (deadline language detected)',
      'Accountability framing ("we need to..." pattern)',
      'Soft escalation tone — not yet aggressive',
    ],
    riskFlags: wordCount > 30
      ? ['Urgency may be artificially inflated', 'Vague accountability language could shift responsibility']
      : [],
    actionSteps: [
      'Acknowledge receipt and validate their concern',
      'Provide a specific, realistic timeline (not vague)',
      'Identify and communicate any blockers clearly',
      'Schedule a follow-up checkpoint if timeline is uncertain',
    ],
    replyDraft: 'Thank you for reaching out. I understand the urgency and want to make sure we\'re aligned. I\'m currently reviewing the status and will have a concrete update with timelines by [date]. If there\'s anything blocking progress you\'d like to flag now, I\'m happy to jump on a quick call.',
    clarityScore: 71,
    whatToCheckBeforeReplying: [
      'Do you have a concrete date to offer? Don\'t reply without one.',
      'Is there anything blocking you that they should know about?',
      'Is this the right tone for your relationship with this person?',
      'Does your reply acknowledge their concern, not just the task?',
    ],
    goal,
    _mock: true,
  };
}

// ─── Mock Tool Results ──────────────────────────────────────────

function buildMockToolResult(toolId: string, text: string): ToolResult {
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

  return {
    output: results[toolId] || `Analysis complete for tool: ${toolId}. Paste your text to see real insights.`,
    confidence: 78,
    tags: ['mock', 'preview'],
    _mock: true,
  };
}

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
 * TODO: Replace with POST /api/agent when backend is ready.
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
  const STEP_DELAY_MS = 900;

  for (let i = 0; i < AGENT_STEPS.length; i++) {
    if (signal?.aborted) throw new Error('Agent run cancelled');
    await new Promise(r => setTimeout(r, STEP_DELAY_MS));
    onStep(i);
  }

  // TODO: When real backend is ready, replace mock with:
  // const res = await fetch('/api/agent', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ text, goal }),
  //   signal,
  // });
  // if (!res.ok) throw new Error((await res.json()).error || 'Agent failed');
  // return res.json() as Promise<AgentResult>;

  return buildMockAgentResult(text, goal);
}

/**
 * Run a single tool analysis.
 * TODO: Replace with POST /api/tool when backend is ready.
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
  // Simulate network latency
  await new Promise(r => setTimeout(r, 1400));
  if (signal?.aborted) throw new Error('Tool run cancelled');

  // TODO: When real backend is ready, replace mock with:
  // const res = await fetch('/api/tool', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ toolId, text }),
  //   signal,
  // });
  // if (!res.ok) throw new Error((await res.json()).error || 'Tool failed');
  // return res.json() as Promise<ToolResult>;

  return buildMockToolResult(toolId, text);
}
