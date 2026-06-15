import { createClient } from '@supabase/supabase-js';
import { rateLimitAnalyze } from './_utils/rateLimit';

// Sumalyze — AI Secure Serverless Analysis Function
// netlify/functions/ai-analyze.ts
// Handled by Netlify esbuild. NOT part of the client Vite bundle.
// Proxied to /api/ai-analyze via netlify.toml

const MAX_INPUT_LENGTH = 5000;
const TIMEOUT_MS = 14000; // 14 seconds timeout for individual providers

interface NLEvent {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string | undefined>;
}

function getHeaderCaseInsensitive(headers: Record<string, string | undefined>, name: string): string | undefined {
  const target = name.toLowerCase();
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === target) {
      return headers[key];
    }
  }
  return undefined;
}
interface NLResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const json = (statusCode: number, data: unknown): NLResponse => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  },
  body: JSON.stringify(data),
});

// ─── Prompts, Normalization & Cleaning Helpers ─────────────────────────────

function cleanJSONText(text: string): string {
  let clean = text.trim();
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```[a-zA-Z]*\s*/, '');
    clean = clean.replace(/\s*```$/, '');
  }
  return clean.trim();
}

function normalizeAIResult(mode: 'tool' | 'agent', data: any): any {
  if (!data || typeof data !== 'object') {
    data = {};
  }
  if (mode === 'tool') {
    return {
      title: String(data.title || 'Analysis Result'),
      summary: String(data.summary || 'No summary available.'),
      keyPoints: Array.isArray(data.keyPoints) ? data.keyPoints.slice(0, 4).map(String) : [],
      tone: String(data.tone || 'Neutral'),
      intent: String(data.intent || 'Unknown'),
      signals: Array.isArray(data.signals) ? data.signals.map(String) : [],
      risks: Array.isArray(data.risks) ? data.risks.map(String) : [],
      suggestedReply: String(data.suggestedReply || '')
    };
  } else {
    const toneAnalysis = data.toneAnalysis || {};
    const emotions = Array.isArray(toneAnalysis.emotions) 
      ? toneAnalysis.emotions.slice(0, 4).map((e: any) => ({
          name: String(e.name || 'neutral'),
          value: typeof e.value === 'number' ? e.value : 100,
          color: String(e.color || '#6B7280')
        }))
      : [{ name: 'neutral', value: 100, color: '#6B7280' }];

    return {
      summary: String(data.summary || 'No summary available.'),
      toneAnalysis: {
        overall: String(toneAnalysis.overall || 'Neutral'),
        emotions: emotions
      },
      intent: String(data.intent || 'Unknown'),
      keySignals: Array.isArray(data.keySignals) ? data.keySignals.slice(0, 6).map(String) : [],
      riskFlags: Array.isArray(data.riskFlags) ? data.riskFlags.map(String) : [],
      importantDetails: Array.isArray(data.importantDetails) ? data.importantDetails.map(String) : [],
      suggestedNextActions: Array.isArray(data.suggestedNextActions) ? data.suggestedNextActions.map(String) : [],
      replyDraft: String(data.replyDraft || ''),
      clarityScore: typeof data.clarityScore === 'number' ? data.clarityScore : 75,
      whatToCheckBeforeReplying: Array.isArray(data.whatToCheckBeforeReplying) ? data.whatToCheckBeforeReplying.map(String) : []
    };
  }
}

const getToolSystemPrompt = (toolId: string) => `You are a text analysis engine for Sumalyze. Analyze the given text specifically for the tool category "${toolId}".

Style Guidelines:
- Tone: Calm, direct, smart, and slightly human. Avoid robotic, generic, or corporate phrases (do NOT say "As an AI language model..." or use filler fluff).
- Length: Keep all text short, concise, and scannable.
- Language: Respond in the language of the input text (e.g., if the text is in English, respond in English; if it is in Serbian, respond in Serbian; if mixed, use the dominant language).

Return ONLY a JSON object matching this exact structure (no explanation, no markdown wrappers, no text before or after the JSON):
{
  "title": "A short, relevant, custom title of the analysis (max 5 words)",
  "summary": "One direct, high-value sentence capturing the core message",
  "keyPoints": ["Key point 1 (max 10 words)", "Key point 2 (max 10 words)", "Key point 3 (max 10 words) - max 4 points total"],
  "tone": "Dominant tone/emotion (e.g., 'Assertive', 'Anxious', 'Warm')",
  "intent": "The primary objective of the text in one short phrase",
  "signals": ["Specific signal 1", "Specific signal 2"],
  "risks": ["Real, practical risk/red flag 1 (no fake alarmism)", "Real, practical risk/red flag 2"],
  "suggestedReply": "A highly practical, polished, short draft response aligned with the tool category (leave empty if not applicable)"
}
Return ONLY valid JSON.`;

const getAgentSystemPrompt = (goal: string) => `You are an advanced AI agent for Sumalyze. Perform a multi-step clarity analysis on the text with the target goal "${goal}".

Style Guidelines:
- Tone: Calm, objective, insightful, and slightly human. Do not overexplain, do not use corporate fluff, and avoid fake certainty.
- Length: Keep summaries concise and action points highly concrete.
- Language: Respond in the language of the input text (e.g., if the text is in English, respond in English; if it is in Serbian, respond in Serbian; if mixed, use the dominant language).

Return ONLY a JSON object matching this exact structure (no explanation, no markdown wrappers, no text before or after the JSON):
{
  "summary": "A brief, high-level summary of findings and core message (max 3 sentences)",
  "toneAnalysis": {
    "overall": "Practical tone description (e.g., 'Professional with underlying urgency')",
    "emotions": [
      { "name": "Emotion 1", "value": 60, "color": "#HEX" },
      { "name": "Emotion 2", "value": 40, "color": "#HEX" }
    ]
  },
  "intent": "A precise, single-sentence statement of what the sender wants",
  "keySignals": ["Key signal 1", "Key signal 2", "Key signal 3 (max 6 total)"],
  "riskFlags": ["Real risk flag 1", "Real risk flag 2 (only real risks, no alarmism)"],
  "importantDetails": ["Concrete fact 1 from input", "Concrete fact 2 from input"],
  "suggestedNextActions": ["Practical action step 1", "Practical action step 2"],
  "replyDraft": "A polished, ready-to-send draft response (max 3 sentences)",
  "clarityScore": 75,
  "whatToCheckBeforeReplying": ["Specific check 1", "Specific check 2"]
}

Allowed emotions for "toneAnalysis.emotions" (max 4, map values to sum to 100%):
- joyful (#10B981)
- hopeful (#3B82F6)
- neutral (#6B7280)
- concerned (#F59E0B)
- anxious (#F97316)
- frustrated (#EF4444)
- angry (#DC2626)
- sad (#6366F1)

Return ONLY valid JSON.`;


// ─── Local Mock Fallback Generators (Safety Layer) ───────────────────────

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


// ─── API Providers ────────────────────────────────────────────────────────

async function tryGemini(prompt: string, systemInstruction: string, apiKey: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: prompt }] }
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Gemini API returned status ${res.status}`);
    }

    const data = await res.json() as any;
    const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) {
      throw new Error('Gemini API returned empty contents');
    }

    // Attempt parsing to verify valid JSON
    const cleanText = cleanJSONText(jsonText);
    return JSON.parse(cleanText);

  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn('[ai-analyze] Gemini request failed or returned invalid JSON:', err.message);
    return null;
  }
}

async function tryOpenRouter(prompt: string, systemInstruction: string, apiKey: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://sumalyze.space',
        'X-Title': 'Sumalyze'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`OpenRouter API returned status ${res.status}`);
    }

    const data = await res.json() as any;
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('OpenRouter API returned empty contents');
    }

    const cleanText = cleanJSONText(content);
    return JSON.parse(cleanText);

  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn('[ai-analyze] OpenRouter fallback failed or returned invalid JSON:', err.message);
    return null;
  }
}



// ─── Main Handler ──────────────────────────────────────────────────────────

export const handler = async (event: NLEvent): Promise<NLResponse> => {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  // Check if user is logged in (authenticated) to identify user limits
  const authHeader = getHeaderCaseInsensitive(event.headers, 'authorization');
  let userId: string | undefined = undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && token) {
      try {
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
          auth: { persistSession: false },
        });
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
        if (!authError && user) {
          userId = user.id;
        } else if (authError) {
          console.warn('[ai-analyze] Guest token validation failed, falling back to IP rate limit:', authError.message);
        }
      } catch (err: any) {
        console.error('[ai-analyze] Exception validating token with Supabase:', err.message);
      }
    }
  }

  // Centralized Rate Limiter check (for both guests and logged-in users)
  const rateLimitResult = await rateLimitAnalyze(event, userId);
  if (!rateLimitResult.allowed) {
    console.warn(`[ai-analyze] Rate limit reached. User ID: ${userId || 'guest'}`);
    const status = rateLimitResult.statusCode || 429;
    const errorMsg = rateLimitResult.error || 'Rate limit reached. Please wait a moment or sign in to increase your limits.';
    return json(status, { error: errorMsg });
  }


  // Parse Body
  let body: { mode?: unknown; toolId?: unknown; goal?: unknown; inputText?: unknown };
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const { mode, toolId, goal, inputText } = body;

  // Validate inputs
  if (mode !== 'tool' && mode !== 'agent') {
    return json(400, { error: 'mode is required and must be either "tool" or "agent"' });
  }

  if (!inputText || typeof inputText !== 'string' || inputText.trim().length === 0) {
    return json(400, { error: 'inputText is required and cannot be empty' });
  }

  const cleanInput = inputText.trim();
  if (cleanInput.length > MAX_INPUT_LENGTH) {
    return json(400, { error: `inputText exceeds maximum length of ${MAX_INPUT_LENGTH} characters` });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  // Build prompts based on mode
  const systemPrompt = mode === 'tool' 
    ? getToolSystemPrompt(String(toolId || 'summarizer')) 
    : getAgentSystemPrompt(String(goal || 'full_analysis'));

  // 1. Try Gemini
  if (geminiKey) {
    console.log('[ai-analyze] Triggering primary Gemini request...');
    const result = await tryGemini(cleanInput, systemPrompt, geminiKey);
    if (result) {
      return json(200, normalizeAIResult(mode, result));
    }
  }

  // 2. Try OpenRouter Fallback
  if (openrouterKey) {
    console.log('[ai-analyze] Triggering OpenRouter fallback...');
    const result = await tryOpenRouter(cleanInput, systemPrompt, openrouterKey);
    if (result) {
      return json(200, normalizeAIResult(mode, result));
    }
  }

  // 3. Try Mock Fallback (Offline/Safety Layer)
  console.log('[ai-analyze] Both APIs failed or keys are missing. Serving mock fallback.');
  const mockResult = mode === 'tool' 
    ? getMockToolResult(String(toolId || 'summarizer'), cleanInput) 
    : getMockAgentResult(String(goal || 'full_analysis'));

  return json(200, mockResult);
};
