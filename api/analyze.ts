// Sumalyze — AI Analysis Serverless Function
// Deployed as Vercel serverless function at /api/analyze
// tsconfig.app.json only covers src/ — this file is compiled by Vercel, not Vite
import type { VercelRequest, VercelResponse } from '@vercel/node';

const MAX_TEXT = 5000;
const MIN_TEXT = 10;
const TIMEOUT_MS = 25_000; // 25s — under Vercel's 30s default limit

// ─── Minimal mock result (used when OPENAI_API_KEY is not set) ─────────────
function buildMockResult(text: string) {
  const len = text.trim().length;
  return {
    brief: 'The message conveys information that requires careful consideration and a thoughtful response.',
    pulse: {
      overall: 'Neutral',
      emotions: [
        { name: 'neutral', value: 55, color: '#6B7280' },
        { name: 'concerned', value: 25, color: '#F59E0B' },
        { name: 'hopeful', value: 20, color: '#3B82F6' },
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
        { style: 'Friendly', text: "Thanks for reaching out! I'll get back to you soon." },
        { style: 'Concise', text: 'Received. Will follow up.' },
      ],
    },
    signals: {
      risks: [],
      warnings: len > 200 ? ['Complex content — review carefully before responding'] : [],
      level: 'low' as const,
    },
    score: {
      clarity: 72,
      urgency: 35,
      professionalism: 78,
      emotionalIntensity: 30,
      riskLevel: 15,
      politeness: 82,
      confidence: 75,
    },
    extract: {
      keyPoints: ['Main topic identified', 'Response expected'],
      actionItems: len > 100 ? ['Review content', 'Prepare response'] : [],
      deadlines: [],
      names: [],
      questions: [],
      decisions: [],
    },
    rewrite: {
      options: [
        { style: 'Clearer', text: text.trim().substring(0, 200) + (text.length > 200 ? '...' : '') },
        { style: 'Professional', text: text.trim().substring(0, 200) + (text.length > 200 ? '...' : '') },
        { style: 'Concise', text: text.trim().substring(0, 80) + (text.length > 80 ? '...' : '') },
      ],
    },
    clean: text.trim(),
    _mock: true,
  };
}

// ─── System prompt ─────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a text analysis engine for Sumalyze. Analyze the given text and return ONLY a JSON object with this exact structure (no explanation, no markdown):

{
  "brief": "One-sentence summary of the message",
  "pulse": {
    "overall": "Dominant emotion word (Neutral/Frustrated/Hopeful/Concerned/Anxious/Joyful/Angry/Sad)",
    "emotions": [
      { "name": "emotion1", "value": 0-100, "color": "#hex" },
      { "name": "emotion2", "value": 0-100, "color": "#hex" },
      { "name": "emotion3", "value": 0-100, "color": "#hex" }
    ]
  },
  "intent": {
    "primary": "Primary intent of the sender",
    "secondary": ["secondary intent 1", "secondary intent 2"],
    "confidence": 0-100
  },
  "reply": {
    "options": [
      { "style": "Professional", "text": "suggested reply" },
      { "style": "Friendly", "text": "suggested reply" },
      { "style": "Concise", "text": "suggested reply" }
    ]
  },
  "signals": {
    "risks": ["risk description if any, else empty array"],
    "warnings": ["warning if any, else empty array"],
    "level": "low|medium|high"
  },
  "score": {
    "clarity": 0-100,
    "urgency": 0-100,
    "professionalism": 0-100,
    "emotionalIntensity": 0-100,
    "riskLevel": 0-100,
    "politeness": 0-100,
    "confidence": 0-100
  },
  "extract": {
    "keyPoints": ["key point 1"],
    "actionItems": ["action 1 if any"],
    "deadlines": [],
    "names": [],
    "questions": [],
    "decisions": []
  },
  "rewrite": {
    "options": [
      { "style": "Clearer", "text": "rewritten version" },
      { "style": "Professional", "text": "rewritten version" },
      { "style": "Concise", "text": "concise version" }
    ]
  },
  "clean": "Grammar-corrected version of the original text"
}

Emotion hex colors: joyful=#10B981, hopeful=#3B82F6, neutral=#6B7280, concerned=#F59E0B, anxious=#F97316, frustrated=#EF4444, angry=#DC2626, sad=#6366F1.
All score values are integers 0-100. Return ONLY valid JSON.`;

// ─── Handler ───────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse and validate input
  const body = req.body as { text?: unknown };
  const text = body?.text;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required and must be a string' });
  }

  const trimmed = text.trim();

  if (trimmed.length < MIN_TEXT) {
    return res.status(400).json({ error: `Text must be at least ${MIN_TEXT} characters` });
  }

  if (trimmed.length > MAX_TEXT) {
    return res.status(400).json({ error: `Text exceeds the maximum of ${MAX_TEXT.toLocaleString()} characters` });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // No API key → return mock (allows deploy without AI key, easy upgrade later)
  if (!apiKey) {
    console.warn('[Sumalyze] OPENAI_API_KEY not set — returning mock analysis');
    return res.status(200).json(buildMockResult(trimmed));
  }

  // Request lock via AbortController + timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
          { role: 'user', content: trimmed },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!aiResponse.ok) {
      const errBody = await aiResponse.json().catch(() => ({})) as { error?: { message?: string } };
      console.error('[Sumalyze] OpenAI error:', aiResponse.status, errBody);

      if (aiResponse.status === 429) {
        return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' });
      }
      if (aiResponse.status === 401) {
        return res.status(502).json({ error: 'AI service configuration error. Please contact support.' });
      }
      return res.status(502).json({ error: 'AI service temporarily unavailable. Please try again.' });
    }

    const data = await aiResponse.json() as { choices?: { message?: { content?: string } }[] };
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error('[Sumalyze] Empty content from OpenAI');
      return res.status(502).json({ error: 'Empty response from AI. Please try again.' });
    }

    let result: unknown;
    try {
      result = JSON.parse(content);
    } catch {
      console.error('[Sumalyze] JSON parse failed. Content snippet:', content.substring(0, 300));
      return res.status(502).json({ error: 'AI response was malformed. Please try again.' });
    }

    return res.status(200).json(result);

  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const isAbort = err instanceof Error && err.name === 'AbortError';
    console.error('[Sumalyze] analyze error:', isAbort ? 'timeout' : err);
    return res.status(isAbort ? 504 : 502).json({
      error: isAbort
        ? 'Analysis timed out. Try a shorter text or try again later.'
        : 'Analysis failed. Please check your connection and try again.',
    });
  }
}
