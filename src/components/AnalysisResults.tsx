import type { AnalysisResult } from '../utils/mockAnalyzer';
import {
  Sparkles, Heart, Target, MessageSquare,
  AlertTriangle, BarChart3, ListChecks, RefreshCw,
} from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const CARD_CONFIGS = [
  { color: 'rgba(226,62,87,0.12)', accent: '#E23E57', borderColor: 'rgba(226,62,87,0.2)' },
  { color: 'rgba(244,114,182,0.08)', accent: '#f472b6', borderColor: 'rgba(244,114,182,0.18)' },
  { color: 'rgba(99,102,241,0.1)', accent: '#818cf8', borderColor: 'rgba(99,102,241,0.2)' },
  { color: 'rgba(52,211,153,0.08)', accent: '#34d399', borderColor: 'rgba(52,211,153,0.18)' },
  { color: 'rgba(251,191,36,0.08)', accent: '#fbbf24', borderColor: 'rgba(251,191,36,0.18)' },
  { color: 'rgba(167,139,250,0.08)', accent: '#a78bfa', borderColor: 'rgba(167,139,250,0.18)' },
  { color: 'rgba(34,211,238,0.08)', accent: '#22d3ee', borderColor: 'rgba(34,211,238,0.18)' },
  { color: 'rgba(251,146,60,0.08)', accent: '#fb923c', borderColor: 'rgba(251,146,60,0.18)' },
];

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#34d399' }} />
          <span className="text-white font-semibold tracking-tight text-lg">Analysis Complete</span>
        </div>
        <div className="text-muted text-sm">— {result.brief.split(' ').length} key insights found</div>
      </div>

      {/* Result grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Brief */}
        <div id="result-brief" className="result-card p-5 col-span-1 sm:col-span-2 animate-slide-up delay-0"
          style={{ background: CARD_CONFIGS[0].color, borderColor: CARD_CONFIGS[0].borderColor }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={15} style={{ color: CARD_CONFIGS[0].accent }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: CARD_CONFIGS[0].accent }}>Brief</span>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">{result.brief}</p>
        </div>

        {/* Pulse */}
        <div id="result-pulse" className="result-card p-5 animate-slide-up delay-100"
          style={{ background: CARD_CONFIGS[1].color, borderColor: CARD_CONFIGS[1].borderColor }}>
          <div className="flex items-center gap-2 mb-3">
            <Heart size={15} style={{ color: CARD_CONFIGS[1].accent }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: CARD_CONFIGS[1].accent }}>Pulse</span>
          </div>
          <p className="text-white font-medium text-sm mb-3">{result.pulse.overall}</p>
          <div className="space-y-2">
            {result.pulse.emotions.slice(0, 3).map((em) => (
              <div key={em.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] text-white/50 capitalize">{em.name}</span>
                  <span className="text-[11px] text-white/40">{em.value}%</span>
                </div>
                <div className="emotion-bar">
                  <div className="emotion-bar-fill" style={{ width: `${em.value}%`, backgroundColor: em.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intent */}
        <div id="result-intent" className="result-card p-5 animate-slide-up delay-200"
          style={{ background: CARD_CONFIGS[2].color, borderColor: CARD_CONFIGS[2].borderColor }}>
          <div className="flex items-center gap-2 mb-3">
            <Target size={15} style={{ color: CARD_CONFIGS[2].accent }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: CARD_CONFIGS[2].accent }}>Intent</span>
          </div>
          <p className="text-white/80 text-sm mb-2">{result.intent.primary}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {result.intent.secondary.map((s, i) => (
              <span key={i} className="px-2 py-0.5 text-[11px] rounded-full font-medium"
                style={{ background: `${CARD_CONFIGS[2].accent}20`, color: CARD_CONFIGS[2].accent }}>
                {s}
              </span>
            ))}
          </div>
          <p className="text-[11px] mt-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {result.intent.confidence}% confidence
          </p>
        </div>

        {/* Reply */}
        <div id="result-reply" className="result-card p-5 col-span-1 sm:col-span-2 animate-slide-up delay-300"
          style={{ background: CARD_CONFIGS[3].color, borderColor: CARD_CONFIGS[3].borderColor }}>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={15} style={{ color: CARD_CONFIGS[3].accent }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: CARD_CONFIGS[3].accent }}>Reply</span>
          </div>
          <div className="space-y-2">
            {result.reply.options.slice(0, 2).map((option, i) => (
              <div key={i} className="p-3 rounded-xl"
                style={{ background: `${CARD_CONFIGS[3].accent}10`, border: `1px solid ${CARD_CONFIGS[3].accent}20` }}>
                <p className="text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{ color: CARD_CONFIGS[3].accent }}>{option.style}</p>
                <p className="text-white/70 text-xs leading-relaxed">{option.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Signals */}
        <div id="result-signals" className="result-card p-5 animate-slide-up delay-400"
          style={{ background: CARD_CONFIGS[4].color, borderColor: CARD_CONFIGS[4].borderColor }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} style={{ color: CARD_CONFIGS[4].accent }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: CARD_CONFIGS[4].accent }}>Signals</span>
            <span className="ml-auto px-2 py-0.5 text-[10px] rounded-full font-medium"
              style={{
                background: result.signals.level === 'high' ? 'rgba(239,68,68,0.15)' : result.signals.level === 'medium' ? 'rgba(251,191,36,0.15)' : 'rgba(52,211,153,0.15)',
                color: result.signals.level === 'high' ? '#f87171' : result.signals.level === 'medium' ? '#fbbf24' : '#34d399',
              }}>
              {result.signals.level}
            </span>
          </div>
          <div className="space-y-1.5">
            {result.signals.risks.length > 0 ? result.signals.risks.map((risk, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 text-xs">▲</span>
                <p className="text-white/60 text-xs leading-relaxed">{risk}</p>
              </div>
            )) : (
              <p className="text-xs" style={{ color: '#34d399' }}>No significant risks detected</p>
            )}
            {result.signals.warnings.slice(0, 2).map((warn, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5 text-xs">◆</span>
                <p className="text-white/60 text-xs leading-relaxed">{warn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Score */}
        <div id="result-score" className="result-card p-5 animate-slide-up delay-500"
          style={{ background: CARD_CONFIGS[5].color, borderColor: CARD_CONFIGS[5].borderColor }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={15} style={{ color: CARD_CONFIGS[5].accent }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: CARD_CONFIGS[5].accent }}>Score</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {([
              ['Clarity', result.score.clarity],
              ['Urgency', result.score.urgency],
              ['Pro.', result.score.professionalism],
              ['Polite', result.score.politeness],
              ['Emot.', result.score.emotionalIntensity],
              ['Risk', result.score.riskLevel],
            ] as [string, number][]).map(([label, val]) => (
              <div key={label} className="text-center">
                <p className="text-lg font-bold text-white leading-none mb-0.5">{val}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Extract */}
        <div id="result-extract" className="result-card p-5 animate-slide-up delay-600"
          style={{ background: CARD_CONFIGS[6].color, borderColor: CARD_CONFIGS[6].borderColor }}>
          <div className="flex items-center gap-2 mb-3">
            <ListChecks size={15} style={{ color: CARD_CONFIGS[6].accent }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: CARD_CONFIGS[6].accent }}>Extract</span>
          </div>
          {result.extract.keyPoints.length > 0 && (
            <div className="mb-2">
              <p className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Key Points</p>
              <div className="flex flex-wrap gap-1">
                {result.extract.keyPoints.slice(0, 3).map((pt, i) => (
                  <span key={i} className="px-2 py-0.5 text-[10px] rounded-md"
                    style={{ background: `${CARD_CONFIGS[6].accent}15`, color: CARD_CONFIGS[6].accent }}>
                    {pt}
                  </span>
                ))}
              </div>
            </div>
          )}
          {result.extract.actionItems.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Actions</p>
              <div className="flex flex-wrap gap-1">
                {result.extract.actionItems.slice(0, 2).map((a, i) => (
                  <span key={i} className="px-2 py-0.5 text-[10px] rounded-md"
                    style={{ background: 'rgba(251,146,60,0.12)', color: '#fb923c' }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rewrite */}
        <div id="result-rewrite" className="result-card p-5 animate-slide-up delay-700"
          style={{ background: CARD_CONFIGS[7].color, borderColor: CARD_CONFIGS[7].borderColor }}>
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw size={15} style={{ color: CARD_CONFIGS[7].accent }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: CARD_CONFIGS[7].accent }}>Rewrite</span>
          </div>
          <div className="space-y-1.5">
            {result.rewrite.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: `${CARD_CONFIGS[7].accent}10`, border: `1px solid ${CARD_CONFIGS[7].accent}18` }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: CARD_CONFIGS[7].accent, display: 'inline-block', flexShrink: 0 }} />
                <p className="text-[11px] text-white/60 font-medium">{opt.style}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
