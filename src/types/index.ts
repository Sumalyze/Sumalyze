// src/types/index.ts

export interface AnalysisHistoryRow {
  id: string;
  user_id: string;
  created_at: string;
  input_text: string;
  analysis_type: string;
  results: AIToolResult;
}

export interface AgentRunRow {
  id: string;
  user_id: string;
  created_at: string;
  goal: string;
  execution_log: AIAgentStep[];
  final_summary: string | null;
  status: 'running' | 'completed' | 'failed';
}

export interface SavedOutputRow {
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  content: string;
  output_type: string;
  meta_data: Record<string, any>;
}

export interface UserFeedbackRow {
  id: string;
  user_id: string | null;
  created_at: string;
  feedback_type: 'bug' | 'suggestion' | 'other';
  message: string;
  rating: number | null;
}

export interface AIToolResult {
  title?: string;
  summary?: string;
  keyPoints?: string[];
  tone?: string;
  intent?: string;
  signals?: string[];
  risks?: string[];
  suggestedReply?: string;
  output?: string; // fallback raw output
  [key: string]: any;
}

export interface AIAgentStep {
  label?: string;
  status: string;
  step?: number;
  thought?: string;
  toolUsed?: string;
  observation?: string;
}

export interface AIAgentResult {
  success: boolean;
  goal: string;
  steps: AIAgentStep[];
  summary: string;
}

export * from './billing';
