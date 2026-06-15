// src/lib/plans.ts

export interface PlanLimits {
  analysesPerMonth?: number;
  analysesPerDay: number;
  agentRunsPerMonth: number;
  fileUploadMaxMB: number;
  historyCount: number;
  exports: string[];
  freeTrialDays?: number;
  features: string[];
}

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  description: string;
  limits: PlanLimits;
  cta: string;
  isPopular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceAnnually: 0,
    description: 'For quick summaries and basic understanding.',
    cta: 'Start free',
    limits: {
      analysesPerDay: 15,
      agentRunsPerMonth: 0,
      fileUploadMaxMB: 2,
      historyCount: 5,
      exports: ['Copy', 'TXT', 'Markdown'],
      features: [
        '15 analyses/day limit',
        'No Agent Mode access',
        'File upload max 2 MB',
        'Last 5 analyses history logs',
        'Exports: Copy, TXT, Markdown'
      ]
    }
  },
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 3.99,
    priceAnnually: 38.99,
    description: 'For students, light readers, and casual users.',
    cta: 'Get Starter',
    limits: {
      analysesPerMonth: 100,
      analysesPerDay: 10,
      agentRunsPerMonth: 3,
      fileUploadMaxMB: 10,
      historyCount: 50,
      freeTrialDays: 3,
      exports: ['Copy', 'TXT', 'Markdown', 'Basic PDF'],
      features: [
        '100 analyses/month',
        'Max 10 analyses/day',
        '3 Agent Mode runs/month',
        'File upload max 10 MB',
        '50 analyses history logs',
        'PDF basic export',
        '3-day free trial'
      ]
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 7.99,
    priceAnnually: 78.99,
    description: 'For professionals who use Sumalyze seriously.',
    cta: 'Get Pro',
    isPopular: true,
    limits: {
      analysesPerMonth: 500,
      analysesPerDay: 30,
      agentRunsPerMonth: 50,
      fileUploadMaxMB: 25,
      historyCount: 200,
      exports: ['Copy', 'TXT', 'Markdown', 'PDF', 'DOCX'],
      features: [
        '500 analyses/month',
        'Max 30 analyses/day',
        '50 Agent Mode runs/month',
        'File upload max 25 MB',
        '200 analyses history logs',
        'PDF + DOCX export',
        'Priority processing queue',
        'Supporters on Ko-fi receive 7 days Pro'
      ]
    }
  },
  {
    id: 'max',
    name: 'Max',
    priceMonthly: 15.99,
    priceAnnually: 158.99,
    description: 'For heavy users wanting a daily premium clarity workspace.',
    cta: 'Get Max',
    limits: {
      analysesPerMonth: 1500,
      analysesPerDay: 80,
      agentRunsPerMonth: 150,
      fileUploadMaxMB: 50,
      historyCount: 500,
      freeTrialDays: 3,
      exports: ['Copy', 'TXT', 'Markdown', 'PDF', 'DOCX', 'All Formats'],
      features: [
        '1500 analyses/month',
        'Max 80 analyses/day',
        '150 Agent Mode runs/month',
        'File upload max 50 MB',
        '500 analyses history logs',
        'All exports included',
        'Priority email support',
        '3-day free trial'
      ]
    }
  }
];

export const TEAM_PLAN = {
  id: 'team',
  name: 'Team Workspace',
  priceDescription: 'Custom / Waitlist',
  description: 'Shared workspaces, member roles, and aggregated billing.',
  cta: 'Join Team Waitlist',
  features: [
    'Team workspace planned',
    'Shared workspace history logs',
    'Shared exports & templates',
    'Member roles & permissions',
    'Custom usage limits & pooling',
    'Priority onboarding assistance'
  ]
};

// Central feature gating helpers (Paddle/user sync ready)
export function canUseAgent(plan: string): boolean {
  const p = plan.toLowerCase();
  return p !== 'free';
}

export function getAnalysisLimit(plan: string): number {
  const p = plan.toLowerCase();
  if (p === 'starter') return 100;
  if (p === 'pro') return 500;
  if (p === 'max') return 1500;
  return 3; // Free limit (conceptualized as daily limit since Free does not have monthly quota)
}

export function getDailyLimit(plan: string): number {
  const p = plan.toLowerCase();
  if (p === 'starter') return 10;
  if (p === 'pro') return 30;
  if (p === 'max') return 80;
  return 15; // free
}

export function getFileUploadLimitMB(plan: string): number {
  const p = plan.toLowerCase();
  if (p === 'starter') return 10;
  if (p === 'pro') return 25;
  if (p === 'max') return 50;
  return 2; // free
}

export function getHistoryLimit(plan: string): number {
  const p = plan.toLowerCase();
  if (p === 'starter') return 50;
  if (p === 'pro') return 200;
  if (p === 'max') return 500;
  return 5; // free
}

export function getExportAccess(plan: string): string[] {
  const p = plan.toLowerCase();
  if (p === 'starter') return ['Copy', 'TXT', 'Markdown', 'Basic PDF'];
  if (p === 'pro') return ['Copy', 'TXT', 'Markdown', 'PDF', 'DOCX'];
  if (p === 'max') return ['Copy', 'TXT', 'Markdown', 'PDF', 'DOCX', 'All Formats'];
  return ['Copy', 'TXT', 'Markdown']; // free
}
