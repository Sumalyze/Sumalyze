/**
 * Sumalyze — Workflow Definitions
 * Each workflow config drives the WorkflowsPage cards automatically.
 */

export type WorkflowStatus = 'active' | 'mock' | 'coming_soon';

export interface WorkflowDef {
  id: string;
  name: string;
  targetUser: string;
  description: string;
  inputType: string;
  outputSections: string[];
  examplePrompt: string;
  status: WorkflowStatus;
  icon: string;
  accent: string;
  tags: string[];
}

export const WORKFLOWS: WorkflowDef[] = [
  {
    id: 'email_agent',
    name: 'Email Agent',
    targetUser: 'Anyone dealing with complex or high-stakes emails',
    description: 'Paste any email and get a full read: tone, intent, risks, and 3 ready-to-send reply options in different styles.',
    inputType: 'Email text',
    outputSections: ['Tone analysis', 'Intent detection', 'Risk flags', 'Reply options (x3)', 'What to check before replying'],
    examplePrompt: 'Paste a tricky client email, manager message, or important communication.',
    status: 'mock',
    icon: '✉',
    accent: '#E23E57',
    tags: ['Email', 'Reply', 'Tone'],
  },
  {
    id: 'student_reading',
    name: 'Student Reading Agent',
    targetUser: 'Students, researchers, and knowledge workers',
    description: 'Upload or paste study material, research papers, or long articles. Get a structured brief, key arguments, and a Q&A-ready summary.',
    inputType: 'Study material, article, or paper excerpt',
    outputSections: ['Core thesis', 'Key arguments (bullet points)', 'Important terms', 'Summary brief', 'Study questions'],
    examplePrompt: 'Paste a research paper section, textbook chapter, or long article.',
    status: 'mock',
    icon: '🎓',
    accent: '#818cf8',
    tags: ['Study', 'Research', 'Summary'],
  },
  {
    id: 'contract_review',
    name: 'Contract Review Lite',
    targetUser: 'Founders, freelancers, and anyone reviewing legal documents',
    description: 'Paste a contract section and get plain-English explanations, unusual clause flags, and obligation highlights.',
    inputType: 'Contract clause or section',
    outputSections: ['Plain English explanation', 'Unusual clauses flagged', 'Key obligations', 'Gotcha risks', 'What to ask a lawyer'],
    examplePrompt: 'Paste a specific contract clause, terms section, or NDA paragraph.',
    status: 'coming_soon',
    icon: '⚖',
    accent: '#60a5fa',
    tags: ['Legal', 'Contract', 'Risk'],
  },
  {
    id: 'support_reply',
    name: 'Customer Support Reply Agent',
    targetUser: 'Support teams and customer success managers',
    description: 'Analyze customer complaints and messages. Get urgency level, emotional state, core issue, and a ready-to-send empathetic reply.',
    inputType: 'Customer message or complaint',
    outputSections: ['Urgency level', 'Emotional state', 'Core issue', 'Suggested reply', 'Escalation recommendation'],
    examplePrompt: 'Paste a customer complaint, support ticket, or message from an upset user.',
    status: 'mock',
    icon: '🎧',
    accent: '#34d399',
    tags: ['Support', 'CX', 'Reply'],
  },
  {
    id: 'hr_notes',
    name: 'HR / Candidate Notes Agent',
    targetUser: 'HR teams, recruiters, and hiring managers',
    description: 'Summarize interview notes, candidate communications, and performance feedback into structured, objective briefs.',
    inputType: 'Interview notes or candidate communication',
    outputSections: ['Candidate summary', 'Key strengths observed', 'Concerns or gaps', 'Communication tone', 'Recommendation'],
    examplePrompt: 'Paste raw interview notes, candidate email thread, or performance feedback.',
    status: 'coming_soon',
    icon: '👤',
    accent: '#fbbf24',
    tags: ['HR', 'Recruiting', 'Notes'],
  },
  {
    id: 'sales_message',
    name: 'Sales Message Agent',
    targetUser: 'Sales teams, account executives, and founders',
    description: 'Analyze prospect messages to extract buying signals, objections, and intent. Get a tailored reply that moves the deal forward.',
    inputType: 'Prospect email or message',
    outputSections: ['Buying intent score', 'Objections identified', 'Decision signals', 'Tailored reply', 'Next step recommendation'],
    examplePrompt: 'Paste a prospect reply, inbound message, or deal email thread.',
    status: 'mock',
    icon: '📈',
    accent: '#22d3ee',
    tags: ['Sales', 'BD', 'Deals'],
  },
  {
    id: 'meeting_notes',
    name: 'Meeting Notes Agent',
    targetUser: 'Teams, managers, and anyone who takes meeting notes',
    description: 'Transform raw, messy meeting notes into a structured summary with decisions, owners, action items, and deadlines.',
    inputType: 'Raw meeting notes or transcript',
    outputSections: ['Meeting summary', 'Key decisions', 'Action items + owners', 'Open questions', 'Next steps'],
    examplePrompt: 'Paste raw notes from any meeting — even bullet-point scribbles work.',
    status: 'mock',
    icon: '📋',
    accent: '#a78bfa',
    tags: ['Meetings', 'Productivity', 'Notes'],
  },
  {
    id: 'founder_brief',
    name: 'Founder Decision Brief',
    targetUser: 'Founders, operators, and senior decision-makers',
    description: 'Turn long investor updates, team emails, or strategic documents into a concise decision brief with options and risks highlighted.',
    inputType: 'Email update, strategic doc, or investor message',
    outputSections: ['Situation overview', 'Key decision required', 'Options identified', 'Risks per option', 'Recommended next move'],
    examplePrompt: 'Paste an investor update, board email, or complex strategic document.',
    status: 'coming_soon',
    icon: '🧭',
    accent: '#fb923c',
    tags: ['Strategy', 'Founders', 'Decisions'],
  },
];
