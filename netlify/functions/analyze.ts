// Sumalyze — AI Analysis Netlify Function
// netlify/functions/analyze.ts
// Compiled by Netlify esbuild. NOT part of Vite bundle.
// Accessible at /.netlify/functions/analyze, proxied from /api/analyze via netlify.toml

const MAX_TEXT = 5000;
const MIN_TEXT = 10;
const TIMEOUT_MS = 25_000;

// ─── Inline types (avoids @netlify/functions dependency) ──────────────────
interface NLEvent {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string | undefined>;
}
interface NLResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const json = (statusCode: number, data: unknown): NLResponse => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

// ─── Mock result (fallback when OPENAI_API_KEY is not set) ─────────────────
function buildMockResult(text: string) {
  const len = text.trim().length;
  return {
    brief: 'The message conveys information that requires careful consideration and a thoughtful response.',
    pulse: {
      overall: 'Neutral',
      emotions: [
        { name: 'neutral',   value: 55, color: '#6B7280' },
        { name: 'concerned', value: 25, color: '#F59E0B' },
        { name: 'hopeful',   value: 20, color: '#3B82F6' },
      ],
    },
    intent: {
      primary: 'Share information and request a response',
      secondary: ['Seek clarification', 'Establish context'],
      confidence: 78,
    },
    reply: {
      options: [
        { style: 'Professional', text: 'Thank you for your message. I will review it carefully and respond shortly.' },
        { style: 'Friendly',     text: "Thanks for reaching out! I'll get back to you soon." },
        { style: 'Concise',      text: 'Received. Will follow up.' },
      ],
    },
    signals: {
      risks: [],
      warnings: len > 200 ? ['Complex content — review carefully before responding'] : [],
      level: 'low',
    },
    score: { clarity: 72, urgency: 35, professionalism: 78, emotionalIntensity: 30, riskLevel: 15, politeness: 82, confidence: 75 },
    extract: {
      keyPoints: ['Main topic identified', 'Response expected'],
      actionItems: len > 100 ? ['Review content', 'Prepare response'] : [],
      deadlines: [], names: [], questions: [], decisions: [],
    },
    rewrite: {
      options: [
        { style: 'Clearer',      text: text.trim().substring(0, 200) + (text.length > 200 ? '...' : '') },
        { style: 'Professional', text: text.trim().substring(0, 200) + (text.length > 200 ? '...' : '') },
        { style: 'Concise',      text: text.trim().substring(0, 80)  + (text.length > 80  ? '...' : '') },
      ],
    },
    clean: text.trim(),
    _mock: true,
  };
}

// ─── OpenAI system prompt ──────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a text analysis engine for Sumalyze. Analyze the given text and return ONLY a JSON object with this exact structure (no explanation, no markdown):

{
  "brief": "One-sentence summary",
  "pulse": { "overall": "Dominant emotion", "emotions": [{ "name": "emotion", "value": 0-100, "color": "#hex" }] },
  "intent": { "primary": "Primary intent", "secondary": ["intent2"], "confidence": 0-100 },
  "reply": { "options": [{ "style": "Professional", "text": "..." }, { "style": "Friendly", "text": "..." }, { "style": "Concise", "text": "..." }] },
  "signals": { "risks": [], "warnings": [], "level": "low|medium|high" },
  "score": { "clarity": 0-100, "urgency": 0-100, "professionalism": 0-100, "emotionalIntensity": 0-100, "riskLevel": 0-100, "politeness": 0-100, "confidence": 0-100 },
  "extract": { "keyPoints": [], "actionItems": [], "deadlines": [], "names": [], "questions": [], "decisions": [] },
  "rewrite": { "options": [{ "style": "Clearer", "text": "..." }, { "style": "Professional", "text": "..." }, { "style": "Concise", "text": "..." }] },
  "clean": "Grammar-corrected version"
}

Emotion colors: joyful=#10B981, hopeful=#3B82F6, neutral=#6B7280, concerned=#F59E0B, anxious=#F97316, frustrated=#EF4444, angry=#DC2626, sad=#6366F1.
Return ONLY valid JSON, no markdown fences.`;

// ─── Main handler ──────────────────────────────────────────────────────────
export const handler = async (event: NLEvent): Promise<NLResponse> => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  // Parse body
  let body: { text?: unknown };
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const text = body.text;
  if (!text || typeof text !== 'string') {
    return json(400, { error: 'text is required and must be a string' });
  }

  const trimmed = text.trim();
  if (trimmed.length < MIN_TEXT) {
    return json(400, { error: `Text must be at least ${MIN_TEXT} characters` });
  }
  if (trimmed.length > MAX_TEXT) {
    return json(400, { error: `Text exceeds the maximum of ${MAX_TEXT.toLocaleString()} characters` });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // No API key → safe mock fallback
  if (!apiKey) {
    console.warn('[Sumalyze] OPENAI_API_KEY not set — returning mock analysis');
    return json(200, buildMockResult(trimmed));
  }

  // Call OpenAI with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1800,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: trimmed },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!aiRes.ok) {
      const errBody = await aiRes.json().catch(() => ({})) as { error?: { message?: string } };
      console.error('[Sumalyze] OpenAI error:', aiRes.status, errBody);
      if (aiRes.status === 429) return json(429, { error: 'Rate limit reached. Please wait a moment and try again.' });
      if (aiRes.status === 401) return json(502, { error: 'AI service configuration error. Please contact support.' });
      return json(502, { error: 'AI service temporarily unavailable. Please try again.' });
    }

    const data = await aiRes.json() as { choices?: { message?: { content?: string } }[] };
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error('[Sumalyze] Empty content from OpenAI');
      return json(502, { error: 'Empty response from AI. Please try again.' });
    }

    let result: unknown;
    try {
      result = JSON.parse(content);
    } catch {
      console.error('[Sumalyze] JSON parse failed:', content.substring(0, 200));
      return json(502, { error: 'AI response was malformed. Please try again.' });
    }

    return json(200, result);

  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const isAbort = err instanceof Error && err.name === 'AbortError';
    console.error('[Sumalyze] analyze error:', isAbort ? 'timeout' : err);
    return json(
      isAbort ? 504 : 502,
      { error: isAbort ? 'Analysis timed out. Try a shorter text.' : 'Analysis failed. Please check your connection and try again.' },
    );
  }
};
