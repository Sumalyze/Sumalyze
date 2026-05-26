export interface AnalysisResult {
  brief: string;
  pulse: {
    overall: string;
    emotions: { name: string; value: number; color: string }[];
  };
  intent: {
    primary: string;
    secondary: string[];
    confidence: number;
  };
  reply: {
    options: { style: string; text: string }[];
  };
  signals: {
    risks: string[];
    warnings: string[];
    level: 'low' | 'medium' | 'high';
  };
  score: {
    clarity: number;
    urgency: number;
    professionalism: number;
    emotionalIntensity: number;
    riskLevel: number;
    politeness: number;
    confidence: number;
  };
  extract: {
    keyPoints: string[];
    actionItems: string[];
    deadlines: string[];
    names: string[];
    questions: string[];
    decisions: string[];
  };
  rewrite: {
    options: { style: string; text: string }[];
  };
  clean: string;
}

const emotionColors: Record<string, string> = {
  joyful: '#10B981',
  hopeful: '#3B82F6',
  neutral: '#6B7280',
  concerned: '#F59E0B',
  anxious: '#F97316',
  frustrated: '#EF4444',
  angry: '#DC2626',
  sad: '#6366F1',
  fearful: '#8B5CF6',
  surprised: '#EC4899',
};

const sampleBriefs = [
  "The message conveys a request for urgent action with underlying concern about project timelines.",
  "This is a follow-up communication expressing satisfaction while requesting additional information.",
  "The sender is politely declining an invitation while maintaining professional relationships.",
  "A detailed request for collaboration on an upcoming project with specific requirements.",
  "An apologetic message addressing a misunderstanding with clarity and professionalism.",
];

const sampleIntents = [
  { primary: "Request immediate action or response", secondary: ["Seek confirmation", "Express urgency"], confidence: 87 },
  { primary: "Share important information", secondary: ["Request feedback", "Maintain connection"], confidence: 92 },
  { primary: "Decline politely while preserving relationship", secondary: ["Express gratitude", "Leave door open"], confidence: 85 },
  { primary: "Propose collaboration", secondary: ["Request consideration", "Establish timeline"], confidence: 90 },
  { primary: "Clarify misunderstanding", secondary: ["Apologize", "Rebuild trust"], confidence: 88 },
];

const sampleRisks: { risks: string[]; warnings: string[]; level: 'low' | 'medium' | 'high' }[] = [
  { risks: ["High urgency without clear deadline"], warnings: ["Consider requesting specific timeline"], level: 'medium' },
  { risks: [], warnings: ["Multiple questions may require detailed response"], level: 'low' },
  { risks: [], warnings: [], level: 'low' },
  { risks: ["Passive-aggressive undertones detected"], warnings: ["Ambiguous commitment level"], level: 'medium' },
  { risks: [], warnings: ["Emotional language may need careful response"], level: 'low' },
  { risks: ["Aggressive language detected", "Potential threat identified"], warnings: ["Caution advised when responding"], level: 'high' },
];

const sampleKeyPoints = [
  ["Project deadline approaching", "Budget constraints discussed", "Team alignment needed"],
  ["Meeting scheduled for next week", "Agenda items requested", "Location confirmation pending"],
  ["Proposal under review", "Decision expected soon", "Feedback appreciated"],
  ["Collaboration opportunity", "Resource sharing possible", "Timeline to be determined"],
  ["Issue resolved", "Process improved", "Documentation updated"],
];

function generateRandomScore(base: number, variance: number = 15): number {
  const score = base + (Math.random() - 0.5) * variance * 2;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function generateResponseOptions(text: string): { style: string; text: string }[] {
  const wordCount = text.split(/\s+/).length;
  const isLong = wordCount > 50;

  const replies = [
    { style: "Professional", text: isLong ? "Thank you for the detailed message. I've reviewed the content and will provide a comprehensive response shortly." : "Thank you for reaching out. I'll review this and get back to you." },
    { style: "Friendly", text: isLong ? "Thanks so much for sharing this! Really appreciate you keeping me in the loop. Let me think it over and I'll follow up soon." : "Thanks for the message! I'll take a look and respond soon." },
    { style: "Concise", text: isLong ? "Received. Will review and respond with next steps." : "Got it, will follow up shortly." },
    { style: "Detailed", text: isLong ? "Thank you for your message. I've noted the key points and will prepare a thorough response addressing each item. You can expect my reply within the next 24 hours." : "Thank you. I've received your message and will provide a complete response shortly." },
  ];

  return replies;
}

function generateRewriteOptions(text: string): { style: string; text: string }[] {
  const cleaned = text.trim().toLowerCase();
  const rewriteOptions = [
    {
      style: "Clearer",
      text: cleaned.length > 100 ? cleaned.substring(0, 100) + "..." : cleaned,
    },
    {
      style: "Professional",
      text: cleaned.length > 100 ? cleaned.substring(0, 100) + "..." : cleaned,
    },
    {
      style: "Friendlier",
      text: cleaned.length > 100 ? cleaned.substring(0, 100) + "..." : cleaned,
    },
    {
      style: "Concise",
      text: cleaned.length > 50 ? cleaned.substring(0, 50) + "..." : cleaned,
    },
  ];

  return rewriteOptions;
}

export function analyzeText(text: string): AnalysisResult {
  if (!text || text.trim().length === 0) {
    throw new Error("Please provide text to analyze");
  }

  const textLength = text.trim().length;
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

  const briefIndex = Math.floor(Math.random() * sampleBriefs.length);
  const riskIndex = Math.floor(Math.random() * sampleRisks.length);

  const emotions = [
    { name: "neutral", value: generateRandomScore(45, 20), color: emotionColors.neutral },
    { name: "hopeful", value: generateRandomScore(25, 15), color: emotionColors.hopeful },
    { name: "concerned", value: generateRandomScore(20, 15), color: emotionColors.concerned },
    { name: "urgent", value: generateRandomScore(15, 10), color: emotionColors.anxious },
  ];

  emotions.sort((a, b) => b.value - a.value);

  const intent = sampleIntents[briefIndex];
  const risks = sampleRisks[riskIndex];
  const keyPoints = sampleKeyPoints[briefIndex];

  const analysisResult: AnalysisResult = {
    brief: sampleBriefs[briefIndex],
    pulse: {
      overall: emotions[0].name.charAt(0).toUpperCase() + emotions[0].name.slice(1),
      emotions: emotions.slice(0, 4),
    },
    intent: {
      ...intent,
      confidence: generateRandomScore(intent.confidence, 8),
    },
    reply: {
      options: generateResponseOptions(text),
    },
    signals: {
      ...risks,
      risks: textLength > 100 ? risks.risks : [],
      warnings: textLength > 50 ? risks.warnings : [],
    },
    score: {
      clarity: generateRandomScore(75, 12),
      urgency: generateRandomScore(45, 20),
      professionalism: generateRandomScore(80, 10),
      emotionalIntensity: generateRandomScore(40, 18),
      riskLevel: risks.level === 'high' ? generateRandomScore(75, 10) : risks.level === 'medium' ? generateRandomScore(45, 10) : generateRandomScore(15, 10),
      politeness: generateRandomScore(85, 10),
      confidence: generateRandomScore(82, 8),
    },
    extract: {
      keyPoints: wordCount > 20 ? keyPoints : keyPoints.slice(0, 1),
      actionItems: wordCount > 50 ? ["Review content", "Schedule follow-up", "Prepare response"] : [],
      deadlines: wordCount > 100 ? ["End of week", "Next meeting"] : [],
      names: [],
      questions: wordCount > 30 ? ["What is the timeline?", "Who is responsible?"] : [],
      decisions: wordCount > 75 ? ["Approach confirmed", "Budget allocated"] : [],
    },
    rewrite: {
      options: generateRewriteOptions(text),
    },
    clean: text.trim(),
  };

  return analysisResult;
}

export function detectLanguage(text: string): string {
  const serbianChars = /[šđčćžŠĐČĆŽ]/;
  if (serbianChars.test(text)) {
    return "Serbian";
  }
  return "English";
}
