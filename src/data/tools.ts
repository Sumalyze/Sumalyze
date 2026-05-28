/**
 * Sumalyze — Tools Data Config
 * Each tool definition drives the ToolsPage UI automatically.
 */

export interface ToolDef {
  id: string;
  name: string;
  description: string;
  icon: string;           // emoji or symbol
  accent: string;         // hex color
  exampleText: string;    // prefilled preset text
  outputLabel: string;    // label shown on result
  placeholder: string;    // textarea placeholder
  badge?: string;         // optional "Coming Soon" etc.
}

export const TOOLS: ToolDef[] = [
  {
    id: 'summarizer',
    name: 'AI Text Summarizer',
    description: 'Distill any text into a clear, scannable summary. Works on emails, articles, documents, and more.',
    icon: '✦',
    accent: '#E23E57',
    placeholder: 'Paste any text, email, article, or document excerpt...',
    outputLabel: 'Summary',
    exampleText: 'The quarterly report indicates a 12% revenue increase year-over-year, driven primarily by growth in the EMEA region. However, operating costs have risen 18% due to increased headcount and infrastructure investment. The board recommends a strategic review of cost centers in Q2, with particular attention to underperforming product lines in the APAC segment. A full presentation will be scheduled for the leadership team.',
  },
  {
    id: 'tone',
    name: 'Tone Analyzer',
    description: 'Detect the emotional undercurrent of any message. Spot passive aggression, urgency, frustration, or warmth.',
    icon: '◎',
    accent: '#f472b6',
    placeholder: 'Paste a message, email, or text to analyze its tone...',
    outputLabel: 'Tone Analysis',
    exampleText: 'Per my previous email, I had outlined the exact steps required. I\'m sure you\'ve been very busy, but I\'d appreciate if this could be addressed before end of day. Again.',
  },
  {
    id: 'intent',
    name: 'Intent Detector',
    description: 'Cut through the words and find what someone actually wants. Uncover hidden goals, leverage plays, and real asks.',
    icon: '◈',
    accent: '#818cf8',
    placeholder: 'Paste a message or conversation snippet...',
    outputLabel: 'Intent Analysis',
    exampleText: 'I love what you\'ve done with the project. Just thinking out loud, but if there was any flexibility on the timeline, that would be wonderful. No pressure at all, of course!',
  },
  {
    id: 'signals',
    name: 'Risk & Signals Detector',
    description: 'Flag red flags, manipulation patterns, scam attempts, and suspicious urgency before you respond.',
    icon: '⚠',
    accent: '#fbbf24',
    placeholder: 'Paste a suspicious message, email, or offer...',
    outputLabel: 'Signals Report',
    exampleText: 'URGENT: You have been selected for a $5,000 government grant. To unlock your funds, please verify your identity by sending your bank account details and a processing fee of $150 within the next 24 hours. This offer expires at midnight.',
  },
  {
    id: 'reply',
    name: 'Reply Helper',
    description: 'Get multiple ready-to-send reply options in different tones — professional, friendly, firm, or concise.',
    icon: '◷',
    accent: '#34d399',
    placeholder: 'Paste the message you need to reply to...',
    outputLabel: 'Reply Options',
    exampleText: 'Hi, just following up on the proposal I sent last week. I have a meeting with my director tomorrow and it would be great to have some feedback before then. Let me know if you need anything else from me.',
  },
  {
    id: 'bullet_brief',
    name: 'Bullet Brief Generator',
    description: 'Turn walls of text into clean, scannable bullet points. Perfect for briefings, notes, and quick reads.',
    icon: '◻',
    accent: '#22d3ee',
    placeholder: 'Paste a long document, report, or update...',
    outputLabel: 'Bullet Brief',
    exampleText: 'Following the all-hands meeting today, leadership confirmed three major priorities for the second half of the year: first, accelerating the mobile product roadmap, with a target of shipping three new features before September; second, expanding into two new markets in Europe, specifically Germany and the Netherlands; and third, restructuring the customer success team to improve retention rates, which currently sit at 72% below the industry average of 85%.',
  },
  {
    id: 'email_simplify',
    name: 'Email Simplifier',
    description: 'Translate complex, jargon-heavy, or confusing emails into plain, easy-to-understand language.',
    icon: '✉',
    accent: '#fb923c',
    placeholder: 'Paste the complicated email you need to understand...',
    outputLabel: 'Plain Language Version',
    exampleText: 'With reference to our previous correspondence and the aforementioned contractual obligations as stipulated in Clause 7.4(b) of the Master Service Agreement, we hereby notify you of our intent to exercise the right to cure pursuant to the remediation provisions set forth therein, subject to the satisfaction of all preconditions outlined in Schedule C.',
  },
  {
    id: 'doc_brief',
    name: 'Document Brief',
    description: 'Get a structured overview of any document: purpose, key sections, action items, and what you need to know.',
    icon: '📄',
    accent: '#a78bfa',
    placeholder: 'Paste a document, report, proposal, or long text...',
    outputLabel: 'Document Brief',
    exampleText: 'This Strategic Partnership Agreement ("Agreement") is entered into as of January 1, 2026, between Acme Corp and Beta Solutions. The parties agree to collaborate on joint marketing initiatives, share leads within the agreed territory, and maintain exclusivity for a period of 18 months. Revenue sharing will be 60/40 in favor of Acme Corp for all referrals originating from Beta\'s network.',
  },
  {
    id: 'contract_lite',
    name: 'Terms / Contract Explainer',
    description: 'Understand what you\'re agreeing to. Highlights unusual clauses, gotchas, and key obligations in plain English.',
    icon: '⚖',
    accent: '#60a5fa',
    placeholder: 'Paste a contract clause, terms section, or agreement text...',
    outputLabel: 'Plain Language Explanation',
    exampleText: 'By using this service, you grant us a worldwide, perpetual, irrevocable, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display any content you submit. This license continues even after you stop using the service.',
  },
  {
    id: 'meeting_notes',
    name: 'Meeting Notes Summarizer',
    description: 'Convert raw meeting notes or transcripts into a clean summary with decisions, action items, and owners.',
    icon: '📋',
    accent: '#4ade80',
    placeholder: 'Paste raw meeting notes or a transcript...',
    outputLabel: 'Meeting Summary',
    exampleText: 'Sync with Sarah, Tom, and Mike. Discussed Q2 roadmap. Tom says mobile is behind schedule, needs one more engineer. Sarah agreed to pull from the growth team temporarily. Mike will update the roadmap doc by Friday. New launch target: July 15th instead of July 1st. Next sync: Thursday 10am. Sarah to send calendar invite.',
  },
  {
    id: 'post_rewriter',
    name: 'LinkedIn / Post Rewriter',
    description: 'Transform rough notes or drafts into polished LinkedIn posts, social captions, or thread formats.',
    icon: '✍',
    accent: '#f472b6',
    placeholder: 'Paste your rough draft, notes, or idea...',
    outputLabel: 'Rewritten Versions',
    exampleText: 'i built a small tool to analyze emails and it got 500 users in first week. super surprised. its called sumalyze. its free. i didnt expect this. maybe people really do need help understanding messages and tone. going to keep building it.',
  },
];

export const TOOL_CATEGORIES = {
  understand: ['summarizer', 'tone', 'intent'],
  detect:     ['signals', 'contract_lite'],
  act:        ['reply', 'bullet_brief', 'email_simplify', 'doc_brief', 'meeting_notes', 'post_rewriter'],
};
