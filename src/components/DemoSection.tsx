import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, AlertCircle, Loader2, X } from 'lucide-react';
import { analyzeText } from '../utils/mockAnalyzer';
import type { AnalysisResult } from '../utils/mockAnalyzer';
import AnalysisResults from './AnalysisResults';

interface DemoSectionProps {
  isVisible: boolean;
}

const SAMPLE_TEXTS = [
  {
    label: "Passive-aggressive email",
    text: "I just wanted to make sure we're all on the same page about the deadline. I've sent multiple reminders already, and I'm starting to feel like my concerns aren't being taken seriously. It would be really appreciated if someone could at least acknowledge these messages.",
  },
  {
    label: "Urgent request",
    text: "Hey, this is super urgent. The client is threatening to cancel the entire contract if we don't deliver the prototype by Friday. I need everyone to drop what they're doing and make this the top priority. No excuses.",
  },
  {
    label: "Potential scam",
    text: "Congratulations! You've been selected to receive a $5,000 grant. To claim your prize, please send us your bank account details and a processing fee of $150 within 24 hours. This offer expires soon!",
  },
];

export default function DemoSection({ isVisible }: DemoSectionProps) {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isVisible]);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    await new Promise(r => setTimeout(r, 1800));
    try {
      setResult(analyzeText(text));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|docx|doc)$/i)) {
      setError('Please upload a TXT, PDF, or DOCX file');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) { setText(content); setActiveTab('paste'); }
    };
    if (file.type === 'text/plain') reader.readAsText(file);
    else {
      setText(`[File: ${file.name}]\n\nFile uploaded. In production, text would be extracted here. For demo purposes, paste text content directly.`);
      setActiveTab('paste');
    }
  };

  const clearAll = () => { setText(''); setResult(null); setError(null); setFileName(null); };

  if (!isVisible) return null;

  return (
    <section id="demo" ref={sectionRef} className="relative py-28 overflow-hidden">
      {/* Ambient */}
      <div className="orb animate-orb-drift" style={{ width: 480, height: 480, background: 'radial-gradient(circle, rgba(136,48,78,0.1) 0%, transparent 70%)', top: '10%', right: '-5%' }} />
      <div className="orb" style={{ width: 320, height: 320, background: 'radial-gradient(circle, rgba(226,62,87,0.08) 0%, transparent 70%)', bottom: '10%', left: '-5%' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">

        {/* Section header */}
        <div className="text-center mb-14 animate-on-scroll visible">
          <div className="section-label mb-4">Live Demo</div>
          <h2 className="font-display font-bold text-white tracking-tight mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}>
            Try Sumalyze right now
          </h2>
          <p className="text-secondary text-lg max-w-xl mx-auto">
            Paste any text and see AI intelligence in action — tone, intent, risk, and more.
          </p>
        </div>

        {/* Sample text chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {SAMPLE_TEXTS.map((s) => (
            <button
              key={s.label}
              onClick={() => { setText(s.text); setActiveTab('paste'); setResult(null); }}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-all hover:bg-white/5"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Main panel */}
        <div className="glass-panel rounded-3xl overflow-hidden mb-6"
          style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)' }}>

          {/* Tab bar */}
          <div className="flex gap-1 p-4 border-b border-white/5">
            <button
              id="demo-tab-paste"
              onClick={() => setActiveTab('paste')}
              className={`tab-pill px-5 py-2 flex items-center gap-2 ${activeTab === 'paste' ? 'active' : ''}`}
            >
              <FileText size={14} />
              Paste Text
            </button>
            <button
              id="demo-tab-upload"
              onClick={() => setActiveTab('upload')}
              className={`tab-pill px-5 py-2 flex items-center gap-2 ${activeTab === 'upload' ? 'active' : ''}`}
            >
              <Upload size={14} />
              Upload File
            </button>

            {text && (
              <button onClick={clearAll} className="ml-auto flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors px-3">
                <X size={12} />
                Clear
              </button>
            )}
          </div>

          {/* Input area */}
          <div className="p-5 sm:p-6">
            {activeTab === 'paste' ? (
              <textarea
                id="demo-text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste an email, message, document excerpt, or any text you want to understand better…"
                className="input-premium w-full h-52 sm:h-60 p-5 rounded-2xl resize-none text-sm leading-relaxed"
                disabled={isAnalyzing}
              />
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                className={`relative h-52 sm:h-60 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer ${
                  isDragging ? 'border-primary/60 bg-primary/8' : 'border-white/10 hover:border-white/20'
                }`}
                style={{ background: isDragging ? 'rgba(226,62,87,0.06)' : 'rgba(49,29,63,0.4)' }}
              >
                <input
                  id="demo-file-input"
                  type="file"
                  accept=".txt,.pdf,.docx,.doc"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(226,62,87,0.1)', border: '1px solid rgba(226,62,87,0.2)' }}>
                  <Upload size={22} style={{ color: '#E23E57' }} />
                </div>
                <p className="text-white/60 font-medium mb-1">Drop your file here</p>
                <p className="text-white/30 text-sm">or click to browse · TXT, PDF, DOCX</p>
                {fileName && (
                  <p className="mt-4 text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(226,62,87,0.15)', color: '#f87f8f' }}>
                    {fileName}
                  </p>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 mt-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {/* Analyze button */}
            <button
              id="demo-analyze-btn"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !text.trim()}
              className={`w-full mt-4 py-4 rounded-2xl font-semibold text-[15px] transition-all flex items-center justify-center gap-2.5 ${
                isAnalyzing || !text.trim()
                  ? 'cursor-not-allowed'
                  : 'btn-primary'
              }`}
              style={isAnalyzing || !text.trim() ? { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.05)' } : {}}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing with AI…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                    <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Analyze with Sumalyze
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && <AnalysisResults result={result} />}
      </div>
    </section>
  );
}
