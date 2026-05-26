import {
  Sparkles,
  Heart,
  Target,
  MessageSquare,
  AlertTriangle,
  BarChart3,
  ListChecks,
  RefreshCw,
  Languages,
  CheckCircle,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface Feature {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const features: Feature[] = [
  {
    id: 'brief',
    name: 'Brief',
    description: 'Short summary capturing the essence of your text.',
    icon: Sparkles,
  },
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Tone and emotion analysis for deeper understanding.',
    icon: Heart,
  },
  {
    id: 'intent',
    name: 'Intent',
    description: 'Discover what the sender actually wants.',
    icon: Target,
  },
  {
    id: 'reply',
    name: 'Reply',
    description: 'Smart reply suggestions in multiple styles.',
    icon: MessageSquare,
  },
  {
    id: 'signals',
    name: 'Signals',
    description: 'Detect risks, red flags, and suspicious text.',
    icon: AlertTriangle,
  },
  {
    id: 'score',
    name: 'Score',
    description: 'Communication quality metrics at a glance.',
    icon: BarChart3,
  },
  {
    id: 'extract',
    name: 'Extract',
    description: 'Pull out key points, tasks, and details.',
    icon: ListChecks,
  },
  {
    id: 'rewrite',
    name: 'Rewrite',
    description: 'Transform text with different tones.',
    icon: RefreshCw,
  },
  {
    id: 'translate',
    name: 'Translate',
    description: 'Understand meaning across languages.',
    icon: Languages,
  },
  {
    id: 'clean',
    name: 'Clean',
    description: 'Fix grammar and improve readability.',
    icon: CheckCircle,
  },
];

export const useCases = [
  {
    title: 'Professional Emails',
    description: 'Understand tone and craft better responses to business communications.',
    icon: 'Mail',
  },
  {
    title: 'Customer Support',
    description: 'Analyze customer sentiment and identify urgent issues quickly.',
    icon: 'Headphones',
  },
  {
    title: 'Business Messages',
    description: 'Decode intent and improve professional messaging.',
    icon: 'Briefcase',
  },
  {
    title: 'Academic Text',
    description: 'Summarize research and extract key concepts efficiently.',
    icon: 'GraduationCap',
  },
  {
    title: 'Personal Conversations',
    description: 'Understand emotions and communicate with empathy.',
    icon: 'Users',
  },
  {
    title: 'Negotiations',
    description: 'Detect underlying intent and craft strategic responses.',
    icon: 'Handshake',
  },
  {
    title: 'Content Writing',
    description: 'Polish your writing and ensure clarity.',
    icon: 'PenTool',
  },
  {
    title: 'Scam Detection',
    description: 'Identify red flags and suspicious patterns.',
    icon: 'Shield',
  },
];

export const howItWorks = [
  {
    step: 1,
    title: 'Paste or Upload',
    description: 'Add your text or upload a document to analyze.',
  },
  {
    step: 2,
    title: 'AI Analysis',
    description: 'Let Sumalyze understand the meaning, tone, and intent.',
  },
  {
    step: 3,
    title: 'Insight & Action',
    description: 'Get clear insights and respond smarter.',
  },
];

export const accountBenefits = [
  {
    title: 'Remove Limits',
    description: 'No daily analysis limits for registered users.',
  },
  {
    title: 'Save History',
    description: 'Access your previous analyses anytime.',
  },
  {
    title: 'Larger Uploads',
    description: 'Upload bigger files and documents.',
  },
  {
    title: 'Always Free',
    description: 'Continue using Sumalyze without paywalls.',
  },
];
