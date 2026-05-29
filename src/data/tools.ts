/**
 * Sumalyze — Tools Data Config
 * Each tool definition drives the ToolsPage and ToolDetailPage UIs automatically.
 */

export interface ToolDef {
  id: string;
  slug: string;           // URL slug: /tools/<slug>
  name: string;
  description: string;
  longDescription: string; // Full paragraph for the detail page
  useCases: string[];      // 4-6 concrete use-case examples
  icon: string;            // emoji or symbol
  accent: string;          // hex color
  exampleText: string;     // prefilled preset text
  outputLabel: string;     // label shown on result
  placeholder: string;     // textarea placeholder
  badge?: string;          // optional "Coming Soon" etc.
}

export const TOOLS: ToolDef[] = [
  {
    id: 'summarizer',
    slug: 'text-summarizer',
    name: 'AI Text Summarizer',
    description: 'Distill any text into a clear, scannable summary. Works on emails, articles, documents, and more.',
    longDescription: 'The AI Text Summarizer reads any block of text and returns a sharp, structured summary that captures the core message without the noise. Whether you\'re dealing with a 30-page report, a dense email chain, or a verbose article, this tool strips it down to what actually matters — in seconds.',
    useCases: [
      'Summarizing research papers and academic articles before a meeting',
      'Getting the key points from a long investor update or board report',
      'Condensing a multi-paragraph email thread to one clear paragraph',
      'Distilling product documentation or release notes quickly',
      'Processing news articles or industry reports during research',
      'Creating quick reading digests from uploaded PDF documents',
    ],
    icon: '✦',
    accent: '#E23E57',
    placeholder: 'Paste any text, email, article, or document excerpt...',
    outputLabel: 'Summary',
    exampleText: 'The quarterly report indicates a 12% revenue increase year-over-year, driven primarily by growth in the EMEA region. However, operating costs have risen 18% due to increased headcount and infrastructure investment. The board recommends a strategic review of cost centers in Q2, with particular attention to underperforming product lines in the APAC segment. A full presentation will be scheduled for the leadership team.',
  },
  {
    id: 'tone',
    slug: 'tone-analyzer',
    name: 'Tone Analyzer',
    description: 'Detect the emotional undercurrent of any message. Spot passive aggression, urgency, frustration, or warmth.',
    longDescription: 'The Tone Analyzer goes beyond the words on the page. It reads the emotional subtext — identifying passive aggression, urgency, frustration, warmth, or neutrality. Before you reply to a tricky message, know exactly what emotional current you\'re navigating.',
    useCases: [
      'Analyzing a difficult email from a manager or client before responding',
      'Detecting passive-aggressive language in a workplace message',
      'Understanding the emotional tone of customer feedback or reviews',
      'Gauging urgency levels in partner or vendor communications',
      'Checking if your own draft comes across as intended',
      'Reviewing candidate or applicant messages for professionalism signals',
    ],
    icon: '◎',
    accent: '#f472b6',
    placeholder: 'Paste a message, email, or text to analyze its tone...',
    outputLabel: 'Tone Analysis',
    exampleText: 'Per my previous email, I had outlined the exact steps required. I\'m sure you\'ve been very busy, but I\'d appreciate if this could be addressed before end of day. Again.',
  },
  {
    id: 'intent',
    slug: 'intent-detector',
    name: 'Intent Detector',
    description: 'Cut through the words and find what someone actually wants. Uncover hidden goals, leverage plays, and real asks.',
    longDescription: 'People rarely say exactly what they mean. The Intent Detector analyzes the structure and language of a message to surface the real ask — whether it\'s a negotiation play, a veiled complaint, a request for reassurance, or an attempt to shift responsibility. Understand what\'s really being asked before you react.',
    useCases: [
      'Decoding vague requests from clients or stakeholders',
      'Understanding what a recruiter or hiring manager is really asking',
      'Reading negotiation subtext in vendor or partner messages',
      'Identifying when a colleague is pushing accountability onto you',
      'Spotting upsell or pressure tactics in sales emails',
      'Clarifying the actual goal behind a meeting request',
    ],
    icon: '◈',
    accent: '#818cf8',
    placeholder: 'Paste a message or conversation snippet...',
    outputLabel: 'Intent Analysis',
    exampleText: 'I love what you\'ve done with the project. Just thinking out loud, but if there was any flexibility on the timeline, that would be wonderful. No pressure at all, of course!',
  },
  {
    id: 'signals',
    slug: 'risk-signals-detector',
    name: 'Risk & Signals Detector',
    description: 'Flag red flags, manipulation patterns, scam attempts, and suspicious urgency before you respond.',
    longDescription: 'The Risk & Signals Detector scans any message for warning patterns — scam tactics, artificial urgency, manipulation language, high-pressure asks, and suspicious phrasing. It\'s your first line of defense before clicking a link, signing something, or wiring money.',
    useCases: [
      'Checking an unexpected email for phishing or scam signals',
      'Verifying whether a job offer or partnership email is legitimate',
      'Scanning a contract clause for hidden risk language',
      'Reviewing an urgent payment request before acting',
      'Identifying emotional manipulation in a personal or professional message',
      'Assessing a vendor\'s terms before committing to a deal',
    ],
    icon: '⚠',
    accent: '#fbbf24',
    placeholder: 'Paste a suspicious message, email, or offer...',
    outputLabel: 'Signals Report',
    exampleText: 'URGENT: You have been selected for a $5,000 government grant. To unlock your funds, please verify your identity by sending your bank account details and a processing fee of $150 within the next 24 hours. This offer expires at midnight.',
  },
  {
    id: 'reply',
    slug: 'reply-helper',
    name: 'Reply Helper',
    description: 'Get multiple ready-to-send reply options in different tones — professional, friendly, firm, or concise.',
    longDescription: 'The Reply Helper generates multiple reply options calibrated to different tones and situations — firm, empathetic, direct, or concise. Paste the message you received, and get back ready-to-send drafts you can pick, tweak, or send as-is.',
    useCases: [
      'Drafting a professional response to a difficult client email',
      'Crafting a firm but polite reply to a missed deadline situation',
      'Writing an empathetic response to a frustrated customer complaint',
      'Finding the right words for a sensitive team communication',
      'Replying to a pushy sales or partnership email',
      'Responding to a vague or confusing request with clarity',
    ],
    icon: '◷',
    accent: '#34d399',
    placeholder: 'Paste the message you need to reply to...',
    outputLabel: 'Reply Options',
    exampleText: 'Hi, just following up on the proposal I sent last week. I have a meeting with my director tomorrow and it would be great to have some feedback before then. Let me know if you need anything else from me.',
  },
  {
    id: 'bullet_brief',
    slug: 'bullet-brief',
    name: 'Bullet Brief Generator',
    description: 'Turn walls of text into clean, scannable bullet points. Perfect for briefings, notes, and quick reads.',
    longDescription: 'The Bullet Brief Generator transforms dense blocks of text into tight, scannable bullet points. Perfect for creating executive briefings, meeting prep notes, quick-read digests, or structured summaries that people can actually absorb in 30 seconds.',
    useCases: [
      'Converting a long meeting agenda into a quick pre-read briefing',
      'Condensing a status update email into a structured bullet list',
      'Creating a quick-read version of a report for leadership',
      'Turning raw research notes into scannable key points',
      'Building a bullet summary of an article for social sharing',
      'Distilling a long Slack thread or document into action items',
    ],
    icon: '◻',
    accent: '#22d3ee',
    placeholder: 'Paste a long document, report, or update...',
    outputLabel: 'Bullet Brief',
    exampleText: 'Following the all-hands meeting today, leadership confirmed three major priorities for the second half of the year: first, accelerating the mobile product roadmap, with a target of shipping three new features before September; second, expanding into two new markets in Europe, specifically Germany and the Netherlands; and third, restructuring the customer success team to improve retention rates, which currently sit at 72% below the industry average of 85%.',
  },
  {
    id: 'email_simplify',
    slug: 'email-simplifier',
    name: 'Email Simplifier',
    description: 'Translate complex, jargon-heavy, or confusing emails into plain, easy-to-understand language.',
    longDescription: 'The Email Simplifier translates corporate jargon, legal language, and verbose writing into plain English. Stop re-reading the same paragraph three times. Paste the confusing email and get back what it actually says.',
    useCases: [
      'Decoding a dense legal or HR email into plain language',
      'Understanding a corporate communications update full of buzzwords',
      'Translating a complicated vendor or supplier message',
      'Making sense of a technical email from engineering or IT',
      'Simplifying a policy change notice before sharing with your team',
      'Deciphering formal complaint or escalation emails',
    ],
    icon: '✉',
    accent: '#fb923c',
    placeholder: 'Paste the complicated email you need to understand...',
    outputLabel: 'Plain Language Version',
    exampleText: 'With reference to our previous correspondence and the aforementioned contractual obligations as stipulated in Clause 7.4(b) of the Master Service Agreement, we hereby notify you of our intent to exercise the right to cure pursuant to the remediation provisions set forth therein, subject to the satisfaction of all preconditions outlined in Schedule C.',
  },
  {
    id: 'doc_brief',
    slug: 'document-brief',
    name: 'Document Brief',
    description: 'Get a structured overview of any document: purpose, key sections, action items, and what you need to know.',
    longDescription: 'The Document Brief tool reads any long document — reports, proposals, agreements, or research — and returns a structured snapshot: the purpose, key sections, critical information, and action items you need to act on. Stop reading from page 1 every time.',
    useCases: [
      'Getting a fast overview of a multi-page proposal before a meeting',
      'Understanding what you need to do after reading a report',
      'Briefing yourself on a lengthy partner or client document',
      'Extracting key sections from a strategic plan or roadmap',
      'Creating an executive summary from a long research document',
      'Reviewing a submitted application or report before a decision',
    ],
    icon: '📄',
    accent: '#a78bfa',
    placeholder: 'Paste a document, report, proposal, or long text...',
    outputLabel: 'Document Brief',
    exampleText: 'This Strategic Partnership Agreement ("Agreement") is entered into as of January 1, 2026, between Acme Corp and Beta Solutions. The parties agree to collaborate on joint marketing initiatives, share leads within the agreed territory, and maintain exclusivity for a period of 18 months. Revenue sharing will be 60/40 in favor of Acme Corp for all referrals originating from Beta\'s network.',
  },
  {
    id: 'contract_lite',
    slug: 'terms-contract-explainer',
    name: 'Terms / Contract Explainer',
    description: 'Understand what you\'re agreeing to. Highlights unusual clauses, gotchas, and key obligations in plain English.',
    longDescription: 'The Terms & Contract Explainer reads legal language and contract clauses and translates them into plain English. It flags unusual obligations, perpetual licenses, liability limitations, auto-renewal traps, and other gotchas that most people miss. Know what you\'re signing before you sign.',
    useCases: [
      'Understanding a SaaS terms of service before subscribing',
      'Reviewing a freelance or consulting contract before signing',
      'Checking a content license agreement for unexpected rights grants',
      'Flagging auto-renewal or cancellation clauses in a service agreement',
      'Reviewing an NDA or non-compete clause in plain English',
      'Checking an employment contract for unusual obligations',
    ],
    icon: '⚖',
    accent: '#60a5fa',
    placeholder: 'Paste a contract clause, terms section, or agreement text...',
    outputLabel: 'Plain Language Explanation',
    exampleText: 'By using this service, you grant us a worldwide, perpetual, irrevocable, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display any content you submit. This license continues even after you stop using the service.',
  },
  {
    id: 'meeting_notes',
    slug: 'meeting-notes',
    name: 'Meeting Notes Summarizer',
    description: 'Convert raw meeting notes or transcripts into a clean summary with decisions, action items, and owners.',
    longDescription: 'The Meeting Notes Summarizer converts raw, unstructured notes or call transcripts into a clean, structured summary. It pulls out what was decided, what actions were agreed, who owns what, and what needs to happen next — saving you from digging back through notes every time.',
    useCases: [
      'Turning rough notes from a client call into a structured follow-up',
      'Cleaning up a transcript from a Zoom or Teams meeting',
      'Creating a post-meeting summary to share with attendees',
      'Extracting action items and owners from a planning session',
      'Summarizing a one-on-one discussion for your records',
      'Converting audio transcript text into a shareable recap',
    ],
    icon: '📋',
    accent: '#4ade80',
    placeholder: 'Paste raw meeting notes or a transcript...',
    outputLabel: 'Meeting Summary',
    exampleText: 'Sync with Sarah, Tom, and Mike. Discussed Q2 roadmap. Tom says mobile is behind schedule, needs one more engineer. Sarah agreed to pull from the growth team temporarily. Mike will update the roadmap doc by Friday. New launch target: July 15th instead of July 1st. Next sync: Thursday 10am. Sarah to send calendar invite.',
  },
  {
    id: 'post_rewriter',
    slug: 'linkedin-post-rewriter',
    name: 'LinkedIn / Post Rewriter',
    description: 'Transform rough notes or drafts into polished LinkedIn posts, social captions, or thread formats.',
    longDescription: 'The LinkedIn / Post Rewriter takes your rough draft, brain dump, or raw idea and transforms it into a polished, shareable post — formatted for LinkedIn, social captions, or short-form thread formats. Multiple versions, different tones, ready to post.',
    useCases: [
      'Turning a casual idea into a polished LinkedIn post',
      'Rewriting a wall-of-text post into a clean, readable format',
      'Creating multiple tone variants of the same post for A/B testing',
      'Adapting a blog post excerpt into a short-form social caption',
      'Turning meeting learnings or wins into a shareable story',
      'Transforming rough speaker notes into a conference post',
    ],
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

/** Map from URL slug → tool id */
export const SLUG_TO_TOOL: Record<string, string> = Object.fromEntries(
  TOOLS.map(t => [t.slug, t.id])
);

/** Map from tool id → ToolDef */
export const TOOL_BY_ID: Record<string, ToolDef> = Object.fromEntries(
  TOOLS.map(t => [t.id, t])
);

/** Map from slug → ToolDef */
export function getToolBySlug(slug: string): ToolDef | undefined {
  const id = SLUG_TO_TOOL[slug];
  return id ? TOOL_BY_ID[id] : undefined;
}
